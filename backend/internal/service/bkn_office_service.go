package service

import (
	"errors"

	"github.com/puspenkom-bkn/backend/internal/model"
	"github.com/puspenkom-bkn/backend/internal/repository"
)

type BKNOfficeService struct {
	repo *repository.BKNOfficeRepository
}

func NewBKNOfficeService(repo *repository.BKNOfficeRepository) *BKNOfficeService {
	return &BKNOfficeService{repo: repo}
}

func (s *BKNOfficeService) CreateOffice(req model.CreateBKNRegionalOfficeRequest) (*model.BKNRegionalOffice, error) {
	if req.Name == "" {
		return nil, errors.New("nama kantor regional BKN wajib diisi")
	}

	office := &model.BKNRegionalOffice{
		Name:    req.Name,
		Address: req.Address,
	}

	if err := s.repo.CreateOffice(office); err != nil {
		return nil, err
	}
	return office, nil
}

func (s *BKNOfficeService) GetOffices() ([]model.BKNRegionalOffice, error) {
	return s.repo.GetOffices()
}

func (s *BKNOfficeService) GetOfficeByID(id string) (*model.BKNRegionalOffice, error) {
	return s.repo.GetOfficeByID(id)
}
