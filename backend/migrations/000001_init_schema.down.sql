-- ==========================================================
-- Database Migration: DOWN Script (000001_init_schema.down.sql)
-- Perintah Rollback (Menghapus tabel dengan urutan terbalik)
-- ==========================================================

DROP INDEX IF EXISTS idx_event_sessions_event_id;
DROP INDEX IF EXISTS idx_events_location_id;
DROP INDEX IF EXISTS idx_staff_institution_id;

DROP TABLE IF EXISTS event_sessions;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS institutions;
DROP TABLE IF EXISTS bkn_regional_offices;
DROP TABLE IF EXISTS users;
