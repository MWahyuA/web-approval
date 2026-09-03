package repository

import (
	"database/sql"
	"fmt"

	"github.com/puspenkom-bkn/backend/internal/model"
)

type InstitutionRepository struct {
	db *sql.DB
}

func NewInstitutionRepository(db *sql.DB) *InstitutionRepository {
	return &InstitutionRepository{db: db}
}

func (r *InstitutionRepository) CreateInstitution(inst *model.Institution) error {
	query := `
		INSERT INTO institutions (id, name, code, address, letterhead_data, letter_number_format)
		VALUES (gen_random_uuid(), $1, $2, $3, CASE WHEN $4 = '' THEN NULL ELSE $4::jsonb END, $5)
		RETURNING id, created_at
	`
	err := r.db.QueryRow(query, inst.Name, inst.Code, inst.Address, inst.LetterheadData, inst.LetterNumberFormat).
		Scan(&inst.ID, &inst.CreatedAt)
	if err != nil {
		return fmt.Errorf("error saat insert institution: %w", err)
	}
	return nil
}

func (r *InstitutionRepository) GetInstitutions() ([]model.Institution, error) {
	query := `SELECT id, name, code, COALESCE(address, ''), COALESCE(letterhead_data::text, '{}'), COALESCE(letter_number_format, ''), created_at FROM institutions ORDER BY created_at DESC`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error saat query institutions: %w", err)
	}
	defer rows.Close()

	var list []model.Institution
	for rows.Next() {
		var i model.Institution
		if err := rows.Scan(&i.ID, &i.Name, &i.Code, &i.Address, &i.LetterheadData, &i.LetterNumberFormat, &i.CreatedAt); err != nil {
			return nil, err
		}
		list = append(list, i)
	}
	if list == nil {
		list = []model.Institution{}
	}
	return list, nil
}

func (r *InstitutionRepository) GetInstitutionByID(id string) (*model.Institution, error) {
	query := `SELECT id, name, code, COALESCE(address, ''), COALESCE(letterhead_data::text, '{}'), COALESCE(letter_number_format, ''), created_at FROM institutions WHERE id = $1`
	var i model.Institution
	err := r.db.QueryRow(query, id).Scan(&i.ID, &i.Name, &i.Code, &i.Address, &i.LetterheadData, &i.LetterNumberFormat, &i.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("instansi tidak ditemukan: %w", err)
		}
		return nil, err
	}
	return &i, nil
}

func (r *InstitutionRepository) CreateStaff(s *model.Staff) error {
	query := `
		INSERT INTO staff (id, nip, name, position, institution_id)
		VALUES (gen_random_uuid(), $1, $2, $3, $4)
		RETURNING id, created_at
	`
	err := r.db.QueryRow(query, s.NIP, s.Name, s.Position, s.InstitutionID).Scan(&s.ID, &s.CreatedAt)
	if err != nil {
		return fmt.Errorf("error saat insert staff: %w", err)
	}
	return nil
}

func (r *InstitutionRepository) GetStaffByInstitutionID(institutionID string) ([]model.Staff, error) {
	query := `SELECT id, nip, name, COALESCE(position, ''), institution_id, created_at FROM staff WHERE institution_id = $1 ORDER BY created_at DESC`
	rows, err := r.db.Query(query, institutionID)
	if err != nil {
		return nil, fmt.Errorf("error saat query staff: %w", err)
	}
	defer rows.Close()

	var list []model.Staff
	for rows.Next() {
		var s model.Staff
		if err := rows.Scan(&s.ID, &s.NIP, &s.Name, &s.Position, &s.InstitutionID, &s.CreatedAt); err != nil {
			return nil, err
		}
		list = append(list, s)
	}
	if list == nil {
		list = []model.Staff{}
	}
	return list, nil
}

// GetStaffByID mengambil data 1 staf berdasarkan ID
func (r *InstitutionRepository) GetStaffByID(id string) (*model.Staff, error) {
	query := `SELECT id, nip, name, COALESCE(position, ''), institution_id, created_at FROM staff WHERE id = $1`
	var s model.Staff
	err := r.db.QueryRow(query, id).Scan(&s.ID, &s.NIP, &s.Name, &s.Position, &s.InstitutionID, &s.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("staff tidak ditemukan: %w", err)
		}
		return nil, err
	}
	return &s, nil
}

// UpdateStaff mengedit data NIP, Nama, dan Jabatan staf
func (r *InstitutionRepository) UpdateStaff(s *model.Staff) error {
	query := `
		UPDATE staff
		SET nip = $1,
		    name = $2,
		    position = $3
		WHERE id = $4
	`
	res, err := r.db.Exec(query, s.NIP, s.Name, s.Position, s.ID)
	if err != nil {
		return fmt.Errorf("error saat update staff: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("staff tidak ditemukan")
	}
	return nil
}

// DeleteStaff menghapus data staf berdasarkan ID
func (r *InstitutionRepository) DeleteStaff(id string) error {
	query := `DELETE FROM staff WHERE id = $1`
	res, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("error saat delete staff: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("staff tidak ditemukan")
	}
	return nil
}

// UpdateInstitution mengedit data instansi berdasarkan ID
func (r *InstitutionRepository) UpdateInstitution(inst *model.Institution) error {
	query := `
		UPDATE institutions
		SET name = $1,
		    code = $2,
		    address = $3,
		    letterhead_data = CASE WHEN $4 = '' THEN NULL ELSE $4::jsonb END,
		    letter_number_format = $5
		WHERE id = $6
	`

	res, err := r.db.Exec(query, inst.Name, inst.Code, inst.Address, inst.LetterheadData, inst.LetterNumberFormat, inst.ID)
	if err != nil {
		return fmt.Errorf("error saat update institution: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return fmt.Errorf("instansi tidak ditemukan")
	}
	return nil
}

// DeleteInstitution menghapus data instansi berdasarkan ID
func (r *InstitutionRepository) DeleteInstitution(id string) error {
	query := `DELETE FROM institutions WHERE id = $1`
	res, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("error saat delete institution: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("instansi tidak ditemukan")
	}
	return nil
}

