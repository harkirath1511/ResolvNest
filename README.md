# ResolvNest — Hostel Complaint & Resolution Analytics System

**UCS310 – Database Management Systems** · B.Tech Computer Engineering (2nd Year)  
Thapar Institute of Engineering and Technology

> Harkirat Singh · Jaskirat Singh · Tilak Raj

---

## Overview

ResolvNest is a full-stack web application that manages the complete lifecycle of hostel maintenance complaints — from submission by students, through assignment to staff, to resolution and analytics for the administrator. It is built on a fully normalized (3NF) PostgreSQL schema hosted on Supabase, with a Next.js 16 frontend.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router, Server Components, Server Actions) |
| Styling | Tailwind CSS v4 |
| Database | Supabase PostgreSQL |
| DB Client | `@supabase/supabase-js` (service role, server-only) |
| Charts | Recharts |
| Validation | Zod |
| Language | TypeScript (strict) |

---

## Quick Start

### 1. Set up the database

Open **Supabase → SQL Editor** and run the scripts in `db/` in this order:

```
01_schema.sql      ← Create tables, enum, indexes
05_triggers.sql    ← Triggers (run before seed so logs are captured)
03_views.sql       ← Analytics views
04_functions.sql   ← PL/pgSQL functions & procedures
02_seed.sql        ← Demo data (hostels, students, staff, complaints)
06_transactions.sql ← (Optional) ACID demo for the report
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
# from Supabase → Settings → API
```

### 3. Install & run

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

---

## Demo Accounts (seeded by `02_seed.sql`)

| Role | Who to pick | What you can do |
|------|------------|-----------------|
| **Student** | Any of the 12 seeded students | View own complaints, raise a new complaint, see status timeline |
| **Staff** | Any of the 5 seeded staff | View assigned complaints, update status (calls `sp_update_status`) |
| **Admin** | Administrator | See all complaints, filter, assign staff (calls `sp_assign_complaint`), CRUD entities, view analytics charts |

---

## ER Diagram (Summary)

```
HOSTEL (hostel_id PK, hostel_name, block, capacity)
  │
  └─< STUDENT (student_id PK, name, room_no, hostel_id FK, contact)
         │
         └─< COMPLAINT (complaint_id PK, student_id FK, category_id FK, staff_id FK,
                         complaint_date, description, current_status, resolved_at)
                │
                └─< STATUS_LOG (log_id PK, complaint_id FK, status, updated_time, note)

CATEGORY (category_id PK, category_name)
STAFF    (staff_id PK, name, role, contact)
```

---

## DBMS Feature Map

| DBMS Requirement | Implementation | File |
|-----------------|---------------|------|
| DDL (CREATE TABLE) | All 6 tables + ENUM + indexes | `db/01_schema.sql` |
| DML (INSERT/UPDATE) | Seed data | `db/02_seed.sql` |
| Views | 6 analytics views | `db/03_views.sql` |
| Function | `fn_avg_resolution_hours`, `fn_hostel_complaint_summary` | `db/04_functions.sql` |
| Stored Procedure | `sp_assign_complaint`, `sp_update_status` | `db/04_functions.sql` |
| Explicit Cursor | Inside `fn_hostel_complaint_summary` | `db/04_functions.sql` |
| Exception Handling | `RAISE EXCEPTION` in all procedures/functions | `db/04_functions.sql` |
| Trigger (AFTER INSERT) | `trg_complaint_after_insert` — auto-logs Submitted | `db/05_triggers.sql` |
| Trigger (AFTER UPDATE) | `trg_complaint_after_status_change` — auto-logs status changes | `db/05_triggers.sql` |
| Trigger (BEFORE UPDATE) | `trg_complaint_resolved_at` — manages resolved_at timestamp | `db/05_triggers.sql` |
| Transactions (ACID) | `BEGIN/COMMIT` + ROLLBACK demo | `db/06_transactions.sql` |
| Normalization | 3NF verified — no partial or transitive dependencies | `db/01_schema.sql` |
| JOIN queries | `v_recent_complaints` joins 4 tables | `db/03_views.sql` |
| GROUP BY + aggregates | All analytics views use `COUNT`, `AVG`, `GROUP BY` | `db/03_views.sql` |
| Subqueries | Inside `sp_update_status` note-update logic | `db/04_functions.sql` |

---

## Project Structure

```
resolvnest/
├── db/                       ← SQL scripts (hand in for report)
│   ├── 01_schema.sql
│   ├── 02_seed.sql
│   ├── 03_views.sql
│   ├── 04_functions.sql
│   ├── 05_triggers.sql
│   ├── 06_transactions.sql
│   └── README.md
├── src/
│   ├── app/
│   │   ├── page.tsx           ← Role picker landing
│   │   ├── login/[role]/      ← Mock login (no password)
│   │   ├── student/           ← Student portal
│   │   ├── staff/             ← Staff portal
│   │   └── admin/             ← Admin portal + analytics
│   ├── components/            ← Shared UI components
│   └── lib/
│       ├── supabase.ts        ← Supabase client (server-only)
│       ├── session.ts         ← Cookie-based mock session
│       ├── types.ts           ← TypeScript types
│       ├── validation.ts      ← Zod schemas
│       └── db/                ← Typed DB wrappers per entity
└── .env.local.example
```
