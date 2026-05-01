-- ============================================================
-- ResolvNest – Hostel Complaint & Resolution Analytics System
-- Script 05: Triggers — run after 01_schema.sql
--            (Run BEFORE 02_seed.sql so seed data is logged)
-- ============================================================

-- ── Helper trigger functions ─────────────────────────────────

-- Called AFTER INSERT on complaint:
-- Automatically inserts the initial 'Submitted' entry in status_log.
CREATE OR REPLACE FUNCTION fn_trg_complaint_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO status_log (complaint_id, status, updated_time, note)
  VALUES (NEW.complaint_id, NEW.current_status, NEW.complaint_date, 'Complaint submitted.');
  RETURN NEW;
END;
$$;

-- Called AFTER UPDATE on complaint when current_status changes:
-- Automatically logs the new status into status_log.
CREATE OR REPLACE FUNCTION fn_trg_complaint_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.current_status IS DISTINCT FROM NEW.current_status THEN
    INSERT INTO status_log (complaint_id, status, updated_time)
    VALUES (NEW.complaint_id, NEW.current_status, NOW());
  END IF;
  RETURN NEW;
END;
$$;

-- Called BEFORE UPDATE on complaint:
-- Sets resolved_at = NOW() when status becomes 'Resolved';
-- Clears resolved_at when status is 'Reopened'.
CREATE OR REPLACE FUNCTION fn_trg_complaint_resolved_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.current_status = 'Resolved' AND OLD.current_status != 'Resolved' THEN
    NEW.resolved_at := NOW();
  ELSIF NEW.current_status = 'Reopened' THEN
    NEW.resolved_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- ── Attach triggers ──────────────────────────────────────────

DROP TRIGGER IF EXISTS trg_complaint_after_insert       ON complaint;
DROP TRIGGER IF EXISTS trg_complaint_after_status_change ON complaint;
DROP TRIGGER IF EXISTS trg_complaint_resolved_at         ON complaint;

-- 1. Auto-log initial status on new complaint
CREATE TRIGGER trg_complaint_after_insert
  AFTER INSERT ON complaint
  FOR EACH ROW
  EXECUTE FUNCTION fn_trg_complaint_after_insert();

-- 2. Auto-log every status change
CREATE TRIGGER trg_complaint_after_status_change
  AFTER UPDATE OF current_status ON complaint
  FOR EACH ROW
  EXECUTE FUNCTION fn_trg_complaint_status_change();

-- 3. Manage resolved_at timestamp automatically
CREATE TRIGGER trg_complaint_resolved_at
  BEFORE UPDATE OF current_status ON complaint
  FOR EACH ROW
  EXECUTE FUNCTION fn_trg_complaint_resolved_at();
