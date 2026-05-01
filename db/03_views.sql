-- ============================================================
-- ResolvNest – Hostel Complaint & Resolution Analytics System
-- Script 03: Views — run after 01_schema.sql
-- ============================================================

-- ── v_complaints_by_status ──────────────────────────────────
-- Count of complaints grouped by their current status.
CREATE OR REPLACE VIEW v_complaints_by_status AS
SELECT
  current_status        AS status,
  COUNT(*)              AS total
FROM complaint
GROUP BY current_status;

-- ── v_complaints_by_hostel ─────────────────────────────────
-- Total and open (unresolved) complaint counts per hostel.
CREATE OR REPLACE VIEW v_complaints_by_hostel AS
SELECT
  h.hostel_id,
  h.hostel_name,
  h.block,
  COUNT(c.complaint_id)                                          AS total_complaints,
  COUNT(c.complaint_id) FILTER (WHERE c.current_status != 'Resolved') AS open_complaints
FROM hostel h
LEFT JOIN student  s ON s.hostel_id   = h.hostel_id
LEFT JOIN complaint c ON c.student_id  = s.student_id
GROUP BY h.hostel_id, h.hostel_name, h.block;

-- ── v_complaints_by_category ───────────────────────────────
-- Total complaint count per category (recurring-issue insight).
CREATE OR REPLACE VIEW v_complaints_by_category AS
SELECT
  cat.category_id,
  cat.category_name,
  COUNT(c.complaint_id)  AS total_complaints,
  COUNT(c.complaint_id) FILTER (WHERE c.current_status = 'Resolved') AS resolved_count,
  COUNT(c.complaint_id) FILTER (WHERE c.current_status != 'Resolved') AS open_count
FROM category cat
LEFT JOIN complaint c ON c.category_id = cat.category_id
GROUP BY cat.category_id, cat.category_name;

-- ── v_avg_resolution_by_category ───────────────────────────
-- Average resolution time (hours) per category for resolved complaints.
CREATE OR REPLACE VIEW v_avg_resolution_by_category AS
SELECT
  cat.category_id,
  cat.category_name,
  COUNT(c.complaint_id)                                              AS resolved_count,
  ROUND(
    AVG(EXTRACT(EPOCH FROM (c.resolved_at - c.complaint_date)) / 3600)::NUMERIC,
    2
  )                                                                  AS avg_resolution_hours
FROM category cat
JOIN complaint c ON c.category_id = cat.category_id
WHERE c.current_status = 'Resolved'
  AND c.resolved_at IS NOT NULL
GROUP BY cat.category_id, cat.category_name;

-- ── v_staff_workload ────────────────────────────────────────
-- Open vs resolved complaint count per staff member.
CREATE OR REPLACE VIEW v_staff_workload AS
SELECT
  s.staff_id,
  s.name       AS staff_name,
  s.role,
  COUNT(c.complaint_id)                                              AS total_assigned,
  COUNT(c.complaint_id) FILTER (WHERE c.current_status = 'Resolved') AS resolved_count,
  COUNT(c.complaint_id) FILTER (WHERE c.current_status != 'Resolved'
                                  AND c.staff_id IS NOT NULL)        AS open_count
FROM staff s
LEFT JOIN complaint c ON c.staff_id = s.staff_id
GROUP BY s.staff_id, s.name, s.role;

-- ── v_recent_complaints ─────────────────────────────────────
-- Denormalised view for the admin complaints list (avoids repeated JOINs in queries).
CREATE OR REPLACE VIEW v_recent_complaints AS
SELECT
  c.complaint_id,
  c.description,
  c.complaint_date,
  c.current_status,
  c.resolved_at,
  st.student_id,
  st.name          AS student_name,
  st.room_no,
  h.hostel_name,
  h.block,
  cat.category_name,
  sf.staff_id,
  sf.name          AS staff_name
FROM complaint  c
JOIN student    st  ON st.student_id  = c.student_id
JOIN hostel     h   ON h.hostel_id    = st.hostel_id
JOIN category   cat ON cat.category_id = c.category_id
LEFT JOIN staff sf  ON sf.staff_id    = c.staff_id
ORDER BY c.complaint_date DESC;
