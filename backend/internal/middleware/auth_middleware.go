package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/puspenkom-bkn/backend/internal/service"
)

type contextKey string

const UserIDKey contextKey = "userID"
const UserRoleKey contextKey = "userRole"

// AuthMiddleware memeriksa keberadaan dan keabsahan token JWT dari header Authorization: Bearer <token>
func AuthMiddleware(authService *service.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "Header Authorization tidak ditemukan (diperlukan token Bearer)", http.StatusUnauthorized)
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				http.Error(w, "Format Authorization harus 'Bearer <token>'", http.StatusUnauthorized)
				return
			}

			tokenString := parts[1]
			claims, err := authService.ValidateToken(tokenString)
			if err != nil {
				http.Error(w, err.Error(), http.StatusUnauthorized)
				return
			}

			userID, ok := claims["user_id"].(string)
			if !ok || userID == "" {
				http.Error(w, "User ID tidak valid dalam token", http.StatusUnauthorized)
				return
			}

			role, _ := claims["role"].(string)

			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			ctx = context.WithValue(ctx, UserRoleKey, role)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
