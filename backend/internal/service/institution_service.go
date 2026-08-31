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
