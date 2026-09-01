package service

import (
	"errors"

	"github.com/puspenkom-bkn/backend/internal/model"
	"github.com/puspenkom-bkn/backend/internal/repository"
)

type EventService struct {
	repo *repository.EventRepository
}

func NewEventService(repo *repository.EventRepository) *EventService {
	return &EventService{repo: repo}
}

func (s *EventService) CreateEvent(req model.CreateEventRequest, userID string) (*model.Event, error) {
	if req.Title == "" {
		return nil, errors.New("judul acara wajib diisi")
	}

	status := req.Status
	if status == "" {
		status = "DRAFT"
	}

	event := &model.Event{
		Title:      req.Title,
		LocationID: req.LocationID,
		StartDate:  req.StartDate,
		EndDate:    req.EndDate,
		StartTime:  req.StartTime,
		Price:      req.Price,
		Status:     status,
		CreatedBy:  userID,
	}

	if err := s.repo.CreateEvent(event); err != nil {
		return nil, err
	}
	return event, nil
}

func (s *EventService) GetEvents() ([]model.Event, error) {
	return s.repo.GetEvents()
}

func (s *EventService) GetEventByID(id string) (*model.Event, error) {
	return s.repo.GetEventByID(id)
}

func (s *EventService) CreateSession(req model.CreateEventSessionRequest) (*model.EventSession, error) {
	if req.EventID == "" || req.SessionDate == "" || req.MaxQuota <= 0 {
		return nil, errors.New("ID event, tanggal sesi, dan max kuota (> 0) wajib diisi")
	}

	session := &model.EventSession{
		EventID:     req.EventID,
		SessionDate: req.SessionDate,
		MaxQuota:    req.MaxQuota,
		UsedQuota:   0,
	}

	if err := s.repo.CreateEventSession(session); err != nil {
		return nil, err
	}
	return session, nil
}
