package repository

import (
	"database/sql"
	"fmt"

	"github.com/puspenkom-bkn/backend/internal/model"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

// GetUserByEmail mencari user berdasarkan email
func (r *UserRepository) GetUserByEmail(email string) (*model.User, error) {
	var user model.User
	query := `
		SELECT id, name, email, password_hash, role, institution_id, created_at, updated_at 
		FROM users 
		WHERE email = $1
	`

	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.InstitutionID,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user tidak ditemukan: %w", err)
		}
		return nil, fmt.Errorf("error saat query user: %w", err)
	}

	return &user, nil
}

// GetUserByID mencari user berdasarkan ID
func (r *UserRepository) GetUserByID(id string) (*model.User, error) {
	var user model.User
	query := `
		SELECT id, name, email, password_hash, role, institution_id, created_at, updated_at 
		FROM users 
		WHERE id = $1
	`

	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.InstitutionID,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user tidak ditemukan: %w", err)
		}
		return nil, fmt.Errorf("error saat query user: %w", err)
	}

	return &user, nil
}

// CreateUser membuat user baru
func (r *UserRepository) CreateUser(user *model.User) error {
	query := `
		INSERT INTO users (id, name, email, password_hash, role) 
		VALUES (gen_random_uuid(), $1, $2, $3, $4::user_role)
		RETURNING id
	`

	err := r.db.QueryRow(query, user.Name, user.Email, user.PasswordHash, user.Role).Scan(&user.ID)
	if err != nil {
		return fmt.Errorf("error saat insert user: %w", err)
	}

	return nil
}
