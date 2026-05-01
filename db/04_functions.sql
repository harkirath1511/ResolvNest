-- ============================================================
-- ResolvNest – Hostel Complaint & Resolution Analytics System
-- Script 04: PL/pgSQL Functions & Procedures
--            Run after 01_schema.sql
-- ============================================================

-- ── fn_avg_resolution_hours ─────────────────────────────────
-- Returns the average resolution time in hours for a given category.
-- Raises an exception if the category does not exist.
CREATE OR REPLACE FUNCTION fn_avg_resolution_hours(p_category_id INT)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
  v_exists BOOL;
  v_avg    NUMERIC;
BEGIN
  -- Exception handling: verify the category exists
  SELECT EXISTS (
    SELECT 1 FROM category WHERE category_id = p_category_id
  ) INTO v_exists;

  IF NOT v_exists THEN
    RAISE EXCEPTION 'Category with id % does not exist.', p_category_id;
  END IF;

  SELECT
    ROUND(
      AVG(EXTRACT(EPOCH FROM (resolved_at - complaint_date)) / 3600)::NUMERIC,
      2
    )
  INTO v_avg
  FROM complaint
  WHERE category_id    = p_category_id
    AND current_status = 'Resolved'
    AND resolved_at IS NOT NULL;

  -- Return 0 if no resolved complaints exist for this category
  RETURN COALESCE(v_avg, 0);
END;
$$;

-- ── fn_hostel_complaint_summary ─────────────────────────────
-- Returns a per-student complaint summary for a hostel.
-- Demonstrates an explicit CURSOR iterating over students.
CREATE OR REPLACE FUNCTION fn_hostel_complaint_summary(p_hostel_id INT)
RETURNS TABLE(
  student_name    TEXT,
  room_no         TEXT,
  total_complaints BIGINT,
  resolved_count   BIGINT,
  open_count       BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_hostel_exists BOOL;
  v_student       RECORD;
  -- Explicit cursor over students in the hostel
  cur_students CURSOR FOR
    SELECT student_id, name, room_no
    FROM   student
    WHERE  hostel_id = p_hostel_id
    ORDER  BY room_no;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM hostel WHERE hostel_id = p_hostel_id
  ) INTO v_hostel_exists;

  IF NOT v_hostel_exists THEN
    RAISE EXCEPTION 'Hostel with id % does not exist.', p_hostel_id;
  END IF;

  OPEN cur_students;

  LOOP
    FETCH cur_students INTO v_student;
    EXIT WHEN NOT FOUND;

    -- Aggregate for this student and yield a row
    SELECT
      v_student.name::TEXT,
      v_student.room_no::TEXT,
      COUNT(*)                                                         AS total,
      COUNT(*) FILTER (WHERE c.current_status = 'Resolved')           AS resolved,
      COUNT(*) FILTER (WHERE c.current_status != 'Resolved')          AS open
    INTO
      student_name,
      room_no,
      total_complaints,
      resolved_count,
      open_count
    FROM complaint c
    WHERE c.student_id = v_student.student_id;

    RETURN NEXT;
  END LOOP;

  CLOSE cur_students;
END;
$$;

-- ── sp_assign_complaint ─────────────────────────────────────
-- Assigns a complaint to a staff member.
-- Raises an exception if the complaint is already resolved.
-- Returns void so it can be called via Supabase .rpc().
CREATE OR REPLACE FUNCTION sp_assign_complaint(
  p_complaint_id INT,
  p_staff_id     INT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_status complaint_status;
BEGIN
  SELECT current_status INTO v_status
  FROM   complaint
  WHERE  complaint_id = p_complaint_id
  FOR    UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Complaint % not found.', p_complaint_id;
  END IF;

  IF v_status = 'Resolved' THEN
    RAISE EXCEPTION 'Complaint % is already resolved and cannot be reassigned.', p_complaint_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM staff WHERE staff_id = p_staff_id) THEN
    RAISE EXCEPTION 'Staff member % does not exist.', p_staff_id;
  END IF;

  UPDATE complaint
  SET staff_id       = p_staff_id,
      current_status = 'Assigned'
  WHERE complaint_id = p_complaint_id;

  -- status_log row inserted automatically by trg_complaint_after_status_change
END;
$$;

-- ── sp_update_status ────────────────────────────────────────
-- Updates the status of a complaint with optional note.
-- Enforces legal status transitions and handles resolved_at timestamp.
-- Returns void so it can be called via Supabase .rpc().
CREATE OR REPLACE FUNCTION sp_update_status(
  p_complaint_id INT,
  p_new_status   complaint_status,
  p_note         TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current complaint_status;
BEGIN
  SELECT current_status INTO v_current
  FROM   complaint
  WHERE  complaint_id = p_complaint_id
  FOR    UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Complaint % not found.', p_complaint_id;
  END IF;

  -- Enforce legal state machine transitions
  IF v_current = 'Resolved' AND p_new_status NOT IN ('Reopened') THEN
    RAISE EXCEPTION
      'Cannot transition from Resolved to %. Only Reopened is allowed.', p_new_status;
  END IF;

  IF v_current = 'Submitted' AND p_new_status NOT IN ('Assigned') THEN
    RAISE EXCEPTION
      'Cannot transition from Submitted to %. Assign it first.', p_new_status;
  END IF;

  UPDATE complaint
  SET current_status = p_new_status,
      resolved_at    = CASE
                         WHEN p_new_status = 'Resolved' THEN NOW()
                         WHEN p_new_status = 'Reopened' THEN NULL
                         ELSE resolved_at
                       END
  WHERE complaint_id = p_complaint_id;

  -- If a note is provided, add an explicit status_log entry with that note
  -- (the trigger inserts a log entry anyway; this adds the note to it)
  IF p_note IS NOT NULL THEN
    UPDATE status_log
    SET note = p_note
    WHERE log_id = (
      SELECT log_id FROM status_log
      WHERE complaint_id = p_complaint_id
      ORDER BY updated_time DESC
      LIMIT 1
    );
  END IF;

  -- status_log insert is handled automatically by trg_complaint_after_status_change
END;
$$;

-- PostgREST (Supabase) only exposes RPCs that API roles may execute. Without these
-- grants, .rpc() can fail with "Could not find the function ... in the schema cache".
GRANT EXECUTE ON FUNCTION public.sp_assign_complaint(integer, integer)
  TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.sp_update_status(integer, complaint_status, text)
  TO anon, authenticated, service_role;
