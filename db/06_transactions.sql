-- ============================================================
-- ResolvNest – Hostel Complaint & Resolution Analytics System
-- Script 06: Transaction Management Demo (ACID properties)
--            This script is for academic demonstration.
--            Run after 01–05 and 02_seed.sql.
-- ============================================================

-- ── DEMO A: Successful atomic assignment ─────────────────────
-- Shows BEGIN / COMMIT: assign complaint 13 to staff 1 AND add a note atomically.
BEGIN;

  -- Step 1: Assign the complaint (calls our procedure)
  CALL sp_assign_complaint(13, 1);

  -- Step 2: Add an admin note directly (same transaction)
  UPDATE status_log
  SET note = 'Manually assigned by admin during ACID demo.'
  WHERE log_id = (
    SELECT log_id FROM status_log
    WHERE  complaint_id = 13
    ORDER  BY updated_time DESC
    LIMIT  1
  );

  -- Both steps succeed → commit
COMMIT;

-- Verify
SELECT complaint_id, current_status, staff_id
FROM   complaint
WHERE  complaint_id = 13;

-- ── DEMO B: Rollback on error ────────────────────────────────
-- Shows BEGIN / ROLLBACK: attempt to assign an already-resolved complaint (id=1).
-- The procedure raises an exception → we catch and rollback.
DO $$
BEGIN
  BEGIN  -- savepoint block
    CALL sp_assign_complaint(1, 2);  -- complaint 1 is Resolved → should raise
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'ROLLBACK triggered: %', SQLERRM;
      -- The inner block rolls back automatically on exception in a DO block
  END;
END;
$$;

-- Verify complaint 1 is still Resolved and unchanged
SELECT complaint_id, current_status, staff_id
FROM   complaint
WHERE  complaint_id = 1;

-- ── DEMO C: Status update with note ─────────────────────────
BEGIN;
  CALL sp_update_status(7, 'Resolved', 'Drain unblocked. Checked and cleared.');
COMMIT;

SELECT complaint_id, current_status, resolved_at
FROM   complaint
WHERE  complaint_id = 7;

-- ── DEMO D: Trigger verification ─────────────────────────────
-- After the updates above, confirm status_log has entries.
SELECT sl.log_id, sl.complaint_id, sl.status, sl.updated_time, sl.note
FROM   status_log sl
WHERE  sl.complaint_id IN (7, 13)
ORDER  BY sl.complaint_id, sl.updated_time;
