-- ============================================================
-- ResolvNest – Hostel Complaint & Resolution Analytics System
-- Script 02: Seed data (DML) — run after 01_schema.sql
-- ============================================================
-- NOTE: status_log rows are auto-inserted by triggers defined
--       in 05_triggers.sql. Run 05 before seeding complaints.

-- ── HOSTELS ─────────────────────────────────────────────────
INSERT INTO hostel (hostel_name, block, capacity) VALUES
  ('Kailash Bhawan',  'A', 200),
  ('Himadri Bhawan',  'B', 150),
  ('Manimahesh Bhawan','C', 180);

-- ── CATEGORIES ──────────────────────────────────────────────
INSERT INTO category (category_name) VALUES
  ('Electrical'),
  ('Plumbing'),
  ('Internet / WiFi'),
  ('Cleanliness'),
  ('Furniture'),
  ('Other');

-- ── STAFF ───────────────────────────────────────────────────
INSERT INTO staff (name, role, contact) VALUES
  ('Ramesh Kumar',   'Electrician',        '9800000001'),
  ('Suresh Sharma',  'Plumber',            '9800000002'),
  ('Dinesh Verma',   'Network Technician', '9800000003'),
  ('Mahesh Singh',   'Housekeeping',       '9800000004'),
  ('Ganesh Yadav',   'Carpenter',          '9800000005');

-- ── STUDENTS ────────────────────────────────────────────────
-- hostel_id: 1=Kailash, 2=Himadri, 3=Manimahesh
INSERT INTO student (name, room_no, hostel_id, contact) VALUES
  ('Harkirat Singh',   'A-101', 1, '9700000001'),
  ('Jaskirat Singh',   'A-102', 1, '9700000002'),
  ('Tilak Raj',        'A-201', 1, '9700000003'),
  ('Ananya Sharma',    'B-101', 2, '9700000004'),
  ('Rohan Mehta',      'B-205', 2, '9700000005'),
  ('Priya Nair',       'C-110', 3, '9700000006'),
  ('Arjun Patel',      'C-210', 3, '9700000007'),
  ('Simran Kaur',      'A-301', 1, '9700000008'),
  ('Vikram Bose',      'B-310', 2, '9700000009'),
  ('Deepika Reddy',    'C-302', 3, '9700000010'),
  ('Karan Joshi',      'A-401', 1, '9700000011'),
  ('Neha Gupta',       'B-402', 2, '9700000012');

-- ── COMPLAINTS ──────────────────────────────────────────────
-- (triggers will auto-insert status_log rows on insert + status change)

-- Resolved complaints (for analytics: resolution time data)
INSERT INTO complaint (student_id, category_id, staff_id, complaint_date, description, current_status, resolved_at) VALUES
  (1, 1, 1, NOW() - INTERVAL '15 days', 'Tube light in room not working for 3 days.',          'Resolved', NOW() - INTERVAL '13 days'),
  (2, 2, 2, NOW() - INTERVAL '12 days', 'Water tap in washroom is leaking.',                   'Resolved', NOW() - INTERVAL '10 days'),
  (4, 3, 3, NOW() - INTERVAL '10 days', 'WiFi disconnects every hour in B block.',              'Resolved', NOW() - INTERVAL '7 days'),
  (6, 4, 4, NOW() - INTERVAL '8 days',  'Common area corridor not cleaned for 2 days.',         'Resolved', NOW() - INTERVAL '6 days'),
  (3, 5, 5, NOW() - INTERVAL '20 days', 'Chair in room broken, cannot sit for studies.',        'Resolved', NOW() - INTERVAL '16 days'),
  (7, 1, 1, NOW() - INTERVAL '6 days',  'Main switch in room tripping repeatedly.',             'Resolved', NOW() - INTERVAL '4 days');

-- In-Progress complaints
INSERT INTO complaint (student_id, category_id, staff_id, complaint_date, description, current_status) VALUES
  (5,  2, 2, NOW() - INTERVAL '3 days', 'Drain in bathroom blocked, water not draining.',      'In_Progress'),
  (8,  3, 3, NOW() - INTERVAL '4 days', 'Internet very slow, getting less than 1 Mbps.',       'In_Progress'),
  (9,  1, 1, NOW() - INTERVAL '2 days', 'Power socket in room not working.',                   'In_Progress');

-- Assigned complaints
INSERT INTO complaint (student_id, category_id, staff_id, complaint_date, description, current_status) VALUES
  (10, 4, 4, NOW() - INTERVAL '1 day',  'Room not swept / mopped for 4 days.',                 'Assigned'),
  (11, 5, 5, NOW() - INTERVAL '2 days', 'Cupboard door hinge broken, cannot lock.',            'Assigned');

-- Submitted complaints (not yet assigned)
INSERT INTO complaint (student_id, category_id, complaint_date, description, current_status) VALUES
  (12, 6, NOW() - INTERVAL '5 hours', 'Hot water not available in morning for 3 days.',        'Submitted'),
  (1,  1, NOW() - INTERVAL '2 hours', 'Room fan making loud noise, disturbing sleep.',         'Submitted'),
  (3,  4, NOW() - INTERVAL '1 hour',  'Dustbin in corridor overflowing, needs emptying.',      'Submitted');

-- Reopened complaint
INSERT INTO complaint (student_id, category_id, staff_id, complaint_date, description, current_status) VALUES
  (2,  2, 2, NOW() - INTERVAL '18 days', 'Washroom tap leaking again after previous fix.',     'Reopened');
