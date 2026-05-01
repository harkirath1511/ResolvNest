-- ============================================================
-- ResolvNest – Hostel Complaint & Resolution Analytics System
-- Script 01: Schema (DDL) — run this first
-- ============================================================

-- Clean up if re-running
DROP TABLE IF EXISTS status_log  CASCADE;
DROP TABLE IF EXISTS complaint   CASCADE;
DROP TABLE IF EXISTS student     CASCADE;
DROP TABLE IF EXISTS staff       CASCADE;
DROP TABLE IF EXISTS category    CASCADE;
DROP TABLE IF EXISTS hostel      CASCADE;
DROP TYPE  IF EXISTS complaint_status;

-- ── ENUM ────────────────────────────────────────────────────
CREATE TYPE complaint_status AS ENUM (
  'Submitted',
  'Assigned',
  'In_Progress',
  'Resolved',
  'Reopened'
);

-- ── HOSTEL ──────────────────────────────────────────────────
-- 3NF: hostel_name, block, capacity depend only on hostel_id
CREATE TABLE hostel (
  hostel_id   SERIAL       PRIMARY KEY,
  hostel_name VARCHAR(100) NOT NULL,
  block       VARCHAR(10)  NOT NULL,
  capacity    INT          NOT NULL CHECK (capacity > 0)
);

-- ── CATEGORY ────────────────────────────────────────────────
-- 3NF: category_name depends only on category_id
CREATE TABLE category (
  category_id   SERIAL       PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE
);

-- ── STAFF ───────────────────────────────────────────────────
-- 3NF: name, role, contact depend only on staff_id
CREATE TABLE staff (
  staff_id SERIAL       PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  role     VARCHAR(100) NOT NULL,
  contact  VARCHAR(20)  NOT NULL
);

-- ── STUDENT ─────────────────────────────────────────────────
-- 3NF: name, room_no, contact depend only on student_id;
--      hostel_id is a FK (no transitive dependency)
CREATE TABLE student (
  student_id SERIAL       PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  room_no    VARCHAR(10)  NOT NULL,
  hostel_id  INT          NOT NULL REFERENCES hostel (hostel_id) ON DELETE RESTRICT,
  contact    VARCHAR(20)  NOT NULL
);

-- ── COMPLAINT ───────────────────────────────────────────────
-- 3NF: all non-key attributes depend only on complaint_id
CREATE TABLE complaint (
  complaint_id    SERIAL           PRIMARY KEY,
  student_id      INT              NOT NULL REFERENCES student  (student_id)  ON DELETE CASCADE,
  category_id     INT              NOT NULL REFERENCES category (category_id) ON DELETE RESTRICT,
  staff_id        INT                       REFERENCES staff    (staff_id)    ON DELETE SET NULL,
  complaint_date  TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  description     TEXT             NOT NULL,
  current_status  complaint_status NOT NULL DEFAULT 'Submitted',
  resolved_at     TIMESTAMPTZ
);

-- ── STATUS_LOG ──────────────────────────────────────────────
-- Tracks every status transition for a complaint (1-to-many)
CREATE TABLE status_log (
  log_id        SERIAL           PRIMARY KEY,
  complaint_id  INT              NOT NULL REFERENCES complaint (complaint_id) ON DELETE CASCADE,
  status        complaint_status NOT NULL,
  updated_time  TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  note          TEXT
);

-- ── INDEXES ─────────────────────────────────────────────────
CREATE INDEX idx_complaint_student   ON complaint   (student_id);
CREATE INDEX idx_complaint_staff     ON complaint   (staff_id);
CREATE INDEX idx_complaint_category  ON complaint   (category_id);
CREATE INDEX idx_complaint_status    ON complaint   (current_status);
CREATE INDEX idx_student_hostel      ON student     (hostel_id);
CREATE INDEX idx_status_log_complaint ON status_log (complaint_id);
