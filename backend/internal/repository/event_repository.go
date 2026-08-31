package repository

import (
	"database/sql"
	"fmt"

	"github.com/puspenkom-bkn/backend/internal/model"
)

type EventRepository struct {
	db *sql.DB
}

func NewEventRepository(db *sql.DB) *EventRepository {
	return &EventRepository{db: db}
}

func (r *EventRepository) CreateEvent(e *model.Event) error {
	query := `
		INSERT INTO events (id, title, location_id, start_date, end_date, start_time, price, status, created_by)
		VALUES (gen_random_uuid(), $1, NULLIF($2, '')::uuid, $3, $4, $5, $6, $7::status_enum, NULLIF($8, '')::uuid)
		RETURNING id
	`
	err := r.db.QueryRow(query, e.Title, e.LocationID, e.StartDate, e.EndDate, e.StartTime, e.Price, e.Status, e.CreatedBy).Scan(&e.ID)
	if err != nil {
		return fmt.Errorf("error saat insert event: %w", err)
	}
	return nil
}

func (r *EventRepository) GetEvents() ([]model.Event, error) {
	query := `
		SELECT id, title, COALESCE(location_id::text, ''), COALESCE(start_date::text, ''), COALESCE(end_date::text, ''), COALESCE(start_time::text, ''), COALESCE(price, 0), COALESCE(status::text, 'DRAFT'), COALESCE(created_by::text, '')
		FROM events 
		ORDER BY start_date DESC
	`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error saat query events: %w", err)
	}
	defer rows.Close()

	var list []model.Event
	for rows.Next() {
		var e model.Event
		if err := rows.Scan(&e.ID, &e.Title, &e.LocationID, &e.StartDate, &e.EndDate, &e.StartTime, &e.Price, &e.Status, &e.CreatedBy); err != nil {
			return nil, err
		}
		list = append(list, e)
	}
	if list == nil {
		list = []model.Event{}
	}
	return list, nil
}

func (r *EventRepository) GetEventByID(id string) (*model.Event, error) {
	query := `
		SELECT id, title, COALESCE(location_id::text, ''), COALESCE(start_date::text, ''), COALESCE(end_date::text, ''), COALESCE(start_time::text, ''), COALESCE(price, 0), COALESCE(status::text, 'DRAFT'), COALESCE(created_by::text, '')
		FROM events 
		WHERE id = $1
	`
	var e model.Event
	err := r.db.QueryRow(query, id).Scan(&e.ID, &e.Title, &e.LocationID, &e.StartDate, &e.EndDate, &e.StartTime, &e.Price, &e.Status, &e.CreatedBy)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("event tidak ditemukan: %w", err)
		}
		return nil, err
	}

	sessions, _ := r.GetSessionsByEventID(id)
	e.Sessions = sessions

	return &e, nil
}

func (r *EventRepository) CreateEventSession(s *model.EventSession) error {
	query := `
		INSERT INTO event_sessions (id, event_id, session_date, max_quota, used_quota)
		VALUES (gen_random_uuid(), $1, $2, $3, $4)
		RETURNING id
	`
	err := r.db.QueryRow(query, s.EventID, s.SessionDate, s.MaxQuota, s.UsedQuota).Scan(&s.ID)
	if err != nil {
		return fmt.Errorf("error saat insert event_session: %w", err)
	}
	return nil
}

func (r *EventRepository) GetSessionsByEventID(eventID string) ([]model.EventSession, error) {
	query := `
		SELECT id, event_id, COALESCE(session_date::text, ''), COALESCE(max_quota, 0), COALESCE(used_quota, 0)
		FROM event_sessions 
		WHERE event_id = $1 
		ORDER BY session_date ASC
	`
	rows, err := r.db.Query(query, eventID)
	if err != nil {
		return nil, fmt.Errorf("error saat query event_sessions: %w", err)
	}
	defer rows.Close()

	var list []model.EventSession
	for rows.Next() {
		var s model.EventSession
		if err := rows.Scan(&s.ID, &s.EventID, &s.SessionDate, &s.MaxQuota, &s.UsedQuota); err != nil {
			return nil, err
		}
		list = append(list, s)
	}
	if list == nil {
		list = []model.EventSession{}
	}
	return list, nil
}
