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
	"github.com/puspenkom-bkn/backend/internal/repository"
	"github.com/puspenkom-bkn/backend/internal/service"
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

	// 3. Inisialisasi Dependency Layer Auth (Repo -> Service -> Handler)
	userRepo := repository.NewUserRepository(db)
	authService := service.NewAuthService(userRepo, cfg.JWTSecret)
	authHandler := handler.NewAuthHandler(authService)

	// 4. Setup router
	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("GET /api/health", handler.HealthCheck)

	// Auth Endpoints (Register & Login)
	mux.HandleFunc("POST /api/v1/auth/register", authHandler.Register)
	mux.HandleFunc("POST /api/v1/auth/login", authHandler.Login)

	// 5. Apply middleware
	stack := middleware.Chain(
		middleware.Logger,
		middleware.CORS(cfg.AllowedOrigins),
		middleware.Recovery,
	)

	// 6. Start server
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
