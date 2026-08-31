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

	// 3. Inisialisasi Dependency Layer (Repo -> Service -> Handler)
	userRepo := repository.NewUserRepository(db)
	authService := service.NewAuthService(userRepo, cfg.JWTSecret)
	authHandler := handler.NewAuthHandler(authService)

	instRepo := repository.NewInstitutionRepository(db)
	instService := service.NewInstitutionService(instRepo)
	instHandler := handler.NewInstitutionHandler(instService)

	eventRepo := repository.NewEventRepository(db)
	eventService := service.NewEventService(eventRepo)
	eventHandler := handler.NewEventHandler(eventService)

	bknOfficeRepo := repository.NewBKNOfficeRepository(db)
	bknOfficeService := service.NewBKNOfficeService(bknOfficeRepo)
	bknOfficeHandler := handler.NewBKNOfficeHandler(bknOfficeService)

	// 4. Setup router
	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("GET /api/health", handler.HealthCheck)

	// Auth Endpoints (Register & Login)
	mux.HandleFunc("POST /api/v1/auth/register", authHandler.Register)
	mux.HandleFunc("POST /api/v1/auth/login", authHandler.Login)

	// Protected Endpoints (Memerlukan Header Authorization: Bearer <token>)
	authMiddleware := middleware.AuthMiddleware(authService)
	mux.Handle("GET /api/v1/auth/me", authMiddleware(http.HandlerFunc(authHandler.GetProfile)))

	// BKN Regional Offices Endpoints
	mux.HandleFunc("GET /api/v1/bkn-regional-offices", bknOfficeHandler.GetOffices)
	mux.HandleFunc("GET /api/v1/bkn-regional-offices/{id}", bknOfficeHandler.GetOfficeByID)
	mux.Handle("POST /api/v1/bkn-regional-offices", authMiddleware(http.HandlerFunc(bknOfficeHandler.CreateOffice)))

	// Institutions & Staff Endpoints
	mux.Handle("POST /api/v1/institutions", authMiddleware(http.HandlerFunc(instHandler.CreateInstitution)))
	mux.HandleFunc("GET /api/v1/institutions", instHandler.GetInstitutions)
	mux.HandleFunc("GET /api/v1/institutions/{id}", instHandler.GetInstitutionByID)
	mux.Handle("POST /api/v1/staff", authMiddleware(http.HandlerFunc(instHandler.CreateStaff)))
	mux.HandleFunc("GET /api/v1/institutions/{id}/staff", instHandler.GetStaffByInstitution)

	// Events & Event Sessions Endpoints
	mux.Handle("POST /api/v1/events", authMiddleware(http.HandlerFunc(eventHandler.CreateEvent)))
	mux.HandleFunc("GET /api/v1/events", eventHandler.GetEvents)
	mux.HandleFunc("GET /api/v1/events/{id}", eventHandler.GetEventByID)
	mux.Handle("POST /api/v1/events/{id}/sessions", authMiddleware(http.HandlerFunc(eventHandler.CreateSession)))

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
