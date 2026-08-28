package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/puspenkom-bkn/backend/config"
	"github.com/puspenkom-bkn/backend/internal/database"
	"github.com/puspenkom-bkn/backend/internal/handler"
	"github.com/puspenkom-bkn/backend/internal/middleware"
)

func main() {
	// 1. Load configuration
	cfg := config.Load()

	// 2. Inisialisasi Koneksi ke Database Supabase (PostgreSQL)
	db, err := database.InitDB(cfg.DatabaseURL)
	if err != nil {
		log.Printf("⚠️ Warning DB Connection: %v", err)
		log.Println("💡 Pastikan DATABASE_URL di file .env sudah diisi dengan URI Supabase Anda.")
	} else if db != nil {
		defer db.Close()
	}

	// 3. Setup router
	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("GET /api/health", handler.HealthCheck)

	// 4. Apply middleware
	stack := middleware.Chain(
		middleware.Logger,
		middleware.CORS(cfg.AllowedOrigins),
		middleware.Recovery,
	)

	// 5. Start server
	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("🚀 Server starting on http://localhost%s", addr)

	server := &http.Server{
		Addr:    addr,
		Handler: stack(mux),
	}

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
		os.Exit(1)
	}
}
