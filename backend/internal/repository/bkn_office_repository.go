package repository

import (
	"database/sql"
	"fmt"

	"github.com/puspenkom-bkn/backend/internal/model"
)

type BKNOfficeRepository struct {
	db *sql.DB
}

func NewBKNOfficeRepository(db *sql.DB) *BKNOfficeRepository {
	return &BKNOfficeRepository{db: db}
}

func (r *BKNOfficeRepository) CreateOffice(o *model.BKNRegionalOffice) error {
	query := `
		INSERT INTO bkn_regional_offices (id, name, address)
		VALUES (gen_random_uuid(), $1, $2)
		RETURNING id, created_at
	`
	err := r.db.QueryRow(query, o.Name, o.Address).Scan(&o.ID, &o.CreatedAt)
	if err != nil {
		return fmt.Errorf("error saat insert bkn_regional_office: %w", err)
	}
	return nil
}

func (r *BKNOfficeRepository) GetOffices() ([]model.BKNRegionalOffice, error) {
	query := `
		SELECT id, name, COALESCE(address, ''), created_at 
		FROM bkn_regional_offices 
		ORDER BY name ASC
	`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error saat query bkn_regional_offices: %w", err)
	}
	defer rows.Close()

	var list []model.BKNRegionalOffice
	for rows.Next() {
		var o model.BKNRegionalOffice
		if err := rows.Scan(&o.ID, &o.Name, &o.Address, &o.CreatedAt); err != nil {
			return nil, err
		}
		list = append(list, o)
	}
	if list == nil {
		list = []model.BKNRegionalOffice{}
	}
	return list, nil
}

func (r *BKNOfficeRepository) GetOfficeByID(id string) (*model.BKNRegionalOffice, error) {
	query := `
		SELECT id, name, COALESCE(address, ''), created_at 
		FROM bkn_regional_offices 
		WHERE id = $1
	`
	var o model.BKNRegionalOffice
	err := r.db.QueryRow(query, id).Scan(&o.ID, &o.Name, &o.Address, &o.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("kantor regional BKN tidak ditemukan: %w", err)
		}
		return nil, err
	}
	return &o, nil
}
