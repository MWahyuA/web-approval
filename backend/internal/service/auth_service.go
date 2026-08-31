package service

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/puspenkom-bkn/backend/internal/model"
	"github.com/puspenkom-bkn/backend/internal/repository"
)

type AuthService struct {
	repo      *repository.UserRepository
	jwtSecret string
}

func NewAuthService(repo *repository.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{
		repo:      repo,
		jwtSecret: jwtSecret,
	}
}

// Register mendaftarkan user baru dengan password yang di-hash menggunakan Bcrypt
func (s *AuthService) Register(req model.RegisterRequest) (*model.AuthResponse, error) {
	// 1. Cek apakah email sudah terdaftar
	existingUser, _ := s.repo.GetUserByEmail(req.Email)
	if existingUser != nil {
		return nil, errors.New("email sudah terdaftar")
	}

	// 2. Hash password menggunakan bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("gagal memproses password: %w", err)
	}

	// 3. Set default role jika kosong
	role := req.Role
	if role == "" {
		role = "user"
	}

	// 4. Buat objek user baru
	user := &model.User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		Role:         role,
	}

	// 5. Simpan user ke database Supabase
	if err := s.repo.CreateUser(user); err != nil {
		return nil, err
	}

	// 6. Generate JWT token
	token, err := s.generateToken(user)
	if err != nil {
		return nil, err
	}

	return &model.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

// Login memverifikasi email & password, lalu mengembalikan token JWT
func (s *AuthService) Login(req model.LoginRequest) (*model.AuthResponse, error) {
	// 1. Cari user berdasarkan email
	user, err := s.repo.GetUserByEmail(req.Email)
	if err != nil || user == nil {
		return nil, errors.New("email atau password salah")
	}

	// 2. Membandingkan password input dengan password hash di database
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		return nil, errors.New("email atau password salah")
	}

	// 3. Generate JWT Token
	token, err := s.generateToken(user)
	if err != nil {
		return nil, err
	}

	return &model.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

// generateToken membuat string token JWT berdurasi 24 jam
func (s *AuthService) generateToken(user *model.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", fmt.Errorf("gagal membuat token JWT: %w", err)
	}

	return tokenString, nil
}
