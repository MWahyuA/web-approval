package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/puspenkom-bkn/backend/config"
	"github.com/puspenkom-bkn/backend/internal/handler"
	"github.com/puspenkom-bkn/backend/internal/middleware"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Setup router
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("GET /api/health", handler.HealthCheck)

	// Apply middleware
	stack := middleware.Chain(
		middleware.Logger,
		middleware.CORS(cfg.AllowedOrigins),
		middleware.Recovery,
	)

	// Start server
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
