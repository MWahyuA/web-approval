-- ========================================================
-- Database Migration: UP Script (000001_init_schema.up.sql)
-- Projek: Web Approval (Puspenkom BKN)
-- ========================================================

-- Enable extension untuk generate UUID otomatis di PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABEL USERS (Pengguna & Hak Akses)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- 'admin', 'approver', 'user'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL BKN_REGIONAL_OFFICES (Kantor Regional BKN)
CREATE TABLE IF NOT EXISTS bkn_regional_offices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL INSTITUTIONS (Instansi Pengusul / Kemen / Pemda)
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address TEXT,
    letterhead_data JSONB,
    letter_number_format VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL STAFF (Pegawai / ASN di Bawah Instansi)
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nip VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL EVENTS (Acara Penilaian Kompetensi ASN)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    location_id UUID REFERENCES bkn_regional_offices(id) ON DELETE SET NULL,
    start_date DATE,
    end_date DATE,
    start_time TIME,
    price NUMERIC(15, 2) DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'PUBLISHED', 'CLOSED'
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL EVENT_SESSIONS (Jadwal Sesi & Kuota Per Acara)
CREATE TABLE IF NOT EXISTS event_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    max_quota INT NOT NULL DEFAULT 0,
    used_quota INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk mempercepat pencarian data berukuran besar
CREATE INDEX IF NOT EXISTS idx_staff_institution_id ON staff(institution_id);
CREATE INDEX IF NOT EXISTS idx_events_location_id ON events(location_id);
CREATE INDEX IF NOT EXISTS idx_event_sessions_event_id ON event_sessions(event_id);
