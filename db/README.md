# ResolvNest — Database Setup Guide

## Run Order in Supabase SQL Editor

Open your Supabase project → **SQL Editor** and run the scripts **in this exact order**:

| # | File | What it does |
|---|------|-------------|
| 1 | `01_schema.sql` | Creates ENUM, all 6 tables, indexes |
| 2 | `05_triggers.sql` | Creates triggers (must be before seed so logs are captured) |
| 3 | `03_views.sql` | Creates analytics views |
| 4 | `04_functions.sql` | Creates PL/pgSQL functions & procedures |
| 5 | `02_seed.sql` | Inserts demo hostels, categories, staff, students, complaints |
| 6 | `06_transactions.sql` | (Optional) Runs ACID demos for the report |

## Get Your Supabase Credentials

1. Go to your Supabase project → **Settings → API**
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`
4. Paste into `.env.local` (copy from `.env.local.example`)

## PL/pgSQL Feature Map (for DBMS Report)

| DBMS Requirement | Implementation |
|------------------|---------------|
| Stored Procedure | `sp_assign_complaint`, `sp_update_status` |
| Function | `fn_avg_resolution_hours`, `fn_hostel_complaint_summary` |
| Explicit Cursor | Inside `fn_hostel_complaint_summary` |
| Trigger (INSERT) | `trg_complaint_after_insert` — auto-logs 'Submitted' |
| Trigger (UPDATE) | `trg_complaint_after_status_change` — auto-logs every status change |
| Trigger (BEFORE) | `trg_complaint_resolved_at` — manages `resolved_at` timestamp |
| Exception Handling | `RAISE EXCEPTION` in all functions/procedures |
| Views | `v_complaints_by_status`, `v_complaints_by_hostel`, `v_complaints_by_category`, `v_avg_resolution_by_category`, `v_staff_workload`, `v_recent_complaints` |
| Transactions | `06_transactions.sql` — `BEGIN/COMMIT` and rollback demo |
| DDL | `01_schema.sql` — `CREATE TABLE`, `CREATE INDEX`, `CREATE TYPE` |
| DML | `02_seed.sql` — `INSERT`, `UPDATE` via procedures |
| Normalization | 3NF — all tables free from partial/transitive dependencies |

## ER Summary

```
HOSTEL ──< STUDENT ──< COMPLAINT >── CATEGORY
                           │
                        STAFF ──< COMPLAINT
                           │
                      STATUS_LOG (auto-maintained by triggers)
```
