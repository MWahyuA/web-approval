package config

import (
	"log"
	"os"

	"github.com/joho/godotenv" // 1. Tambahkan import ini
)

type Config struct {
	Port           string
	DatabaseURL    string
	JWTSecret      string
	AllowedOrigins string
}

func Load() *Config {
	// 2. Muat file .env jika ada (jika tidak ada/production, akan memakai OS env)
	if err := godotenv.Load(); err != nil {
		log.Println("ℹ️ File .env tidak ditemukan, menggunakan variabel lingkungan OS")
	}

	return &Config{
		Port:           getEnv("PORT", "8080"),
		DatabaseURL:    getEnv("DATABASE_URL", ""),
		JWTSecret:      getEnv("JWT_SECRET", "default-secret-key"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:4321"),
	}
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		return val
	}
	return fallback
}
