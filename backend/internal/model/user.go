package model

import "time"

// User merepresentasikan entitas pengguna di database Supabase
type User struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // "-" agar password_hash TIDAK PERNAH dikirim ke JSON response
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// RegisterRequest adalah format JSON payload input saat mendaftar
type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"` // 'admin', 'approver', atau 'user'
}

// LoginRequest adalah format JSON payload input saat login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthResponse adalah format JSON output yang dikembalikan setelah login/register sukses
type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
