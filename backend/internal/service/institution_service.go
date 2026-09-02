package service

import (
	"errors"

	"github.com/puspenkom-bkn/backend/internal/model"
	"github.com/puspenkom-bkn/backend/internal/repository"
)

type InstitutionService struct {
	repo *repository.InstitutionRepository
}

func NewInstitutionService(repo *repository.InstitutionRepository) *InstitutionService {
	return &InstitutionService{repo: repo}
}

func (s *InstitutionService) CreateInstitution(req model.CreateInstitutionRequest) (*model.Institution, error) {
	if req.Name == "" || req.Code == "" {
		return nil, errors.New("nama dan kode instansi wajib diisi")
	}

	inst := &model.Institution{
		Name:               req.Name,
		Code:               req.Code,
		Address:            req.Address,
		LetterheadData:     req.LetterheadData,
		LetterNumberFormat: req.LetterNumberFormat,
	}

	if err := s.repo.CreateInstitution(inst); err != nil {
		return nil, err
	}
	return inst, nil
}

func (s *InstitutionService) GetInstitutions() ([]model.Institution, error) {
	return s.repo.GetInstitutions()
}

func (s *InstitutionService) GetInstitutionByID(id string) (*model.Institution, error) {
	return s.repo.GetInstitutionByID(id)
}

func (s *InstitutionService) CreateStaff(req model.CreateStaffRequest) (*model.Staff, error) {
	if req.NIP == "" || req.Name == "" || req.InstitutionID == "" {
		return nil, errors.New("NIP, nama, dan ID instansi wajib diisi")
	}

	staff := &model.Staff{
		NIP:           req.NIP,
		Name:          req.Name,
		Position:      req.Position,
		InstitutionID: req.InstitutionID,
	}

	if err := s.repo.CreateStaff(staff); err != nil {
		return nil, err
	}
	return staff, nil
}

func (s *InstitutionService) GetStaffByInstitution(institutionID string) ([]model.Staff, error) {
	return s.repo.GetStaffByInstitutionID(institutionID)
}

func (s *InstitutionService) GetStaffByID(id string) (*model.Staff, error) {
	if id == "" {
		return nil, errors.New("ID staf wajib diisi")
	}
	return s.repo.GetStaffByID(id)
}

func (s *InstitutionService) UpdateStaff(id string, req model.UpdateStaffRequest) (*model.Staff, error) {
	if id == "" {
		return nil, errors.New("ID staf wajib diisi")
	}
	if req.NIP == "" || req.Name == "" {
		return nil, errors.New("NIP dan nama staf wajib diisi")
	}

	staff := &model.Staff{
		ID:       id,
		NIP:      req.NIP,
		Name:     req.Name,
		Position: req.Position,
	}

	if err := s.repo.UpdateStaff(staff); err != nil {
		return nil, err
	}
	return s.repo.GetStaffByID(id)
}

func (s *InstitutionService) DeleteStaff(id string) error {
	if id == "" {
		return errors.New("ID staf wajib diisi")
	}
	return s.repo.DeleteStaff(id)
}

func (s *InstitutionService) UpdateInstitution(id string, req model.UpdateInstitutionRequest) (*model.Institution, error) {
	// Validasi: ID tidak boleh kosong
	if id == "" {
		return nil, errors.New("ID instansi wajib diisi")
	}
	// Validasi bisnis: nama dan kode wajib ada
	if req.Name == "" || req.Code == "" {
		return nil, errors.New("nama dan kode instansi wajib diisi")
	}

	// Siapkan struct Institution untuk dikirim ke repository
	inst := &model.Institution{
		ID:                 id,
		Name:               req.Name,
		Code:               req.Code,
		Address:            req.Address,
		LetterheadData:     req.LetterheadData,
		LetterNumberFormat: req.LetterNumberFormat,
	}

	// Jalankan update di database
	if err := s.repo.UpdateInstitution(inst); err != nil {
		return nil, err
	}

	// Ambil data terbaru setelah di-update (biar response-nya lengkap)
	return s.repo.GetInstitutionByID(id)
}

func (s *InstitutionService) DeleteInstitution(id string) error {
	if id == "" {
		return errors.New("ID instansi wajib diisi")
	}
	return s.repo.DeleteInstitution(id)
}
