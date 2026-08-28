package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

// InitDB membuka koneksi dan memverifikasi ke Supabase PostgreSQL database
func InitDB(databaseURL string) (*sql.DB, error) {
	if databaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL tidak boleh kosong")
	}

	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("gagal membuka koneksi database: %w", err)
	}

	// Konfigurasi Connection Pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(15 * time.Minute)

	// Test koneksi (Ping)
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("gagal ping database Supabase: %w", err)
	}

	log.Println("✅ Berhasil terhubung ke Supabase Database (PostgreSQL)")
	return db, nil
}
