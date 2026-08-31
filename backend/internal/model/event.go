package model


// Event merepresentasikan data Acara Penilaian Kompetensi ASN di Supabase
type Event struct {
	ID         string         `json:"id"`
	Title      string         `json:"title"`
	LocationID string         `json:"location_id,omitempty"`
	StartDate  string         `json:"start_date,omitempty"`
	EndDate    string         `json:"end_date,omitempty"`
	StartTime  string         `json:"start_time,omitempty"`
	Price      float64        `json:"price"`
	Status     string         `json:"status"` // 'DRAFT', 'PUBLISHED', 'CLOSED'
	CreatedBy  string         `json:"created_by"`
	Sessions   []EventSession `json:"sessions,omitempty"`
}

// EventSession merepresentasikan data sesi jadwal & kuota per acara
type EventSession struct {
	ID             string `json:"id"`
	EventID        string `json:"event_id"`
	SessionDate    string `json:"session_date"`
	MaxQuota       int    `json:"max_quota"`
	UsedQuota      int    `json:"used_quota"`
	RemainingQuota int    `json:"remaining_quota"`
}

// CreateEventRequest payload JSON untuk membuat acara penilaian baru
type CreateEventRequest struct {
	Title      string  `json:"title"`
	LocationID string  `json:"location_id"`
	StartDate  string  `json:"start_date"`
	EndDate    string  `json:"end_date"`
	StartTime  string  `json:"start_time"`
	Price      float64 `json:"price"`
	Status     string  `json:"status"`
}

// CreateEventSessionRequest payload JSON untuk membuat sesi kuota baru pada acara
type CreateEventSessionRequest struct {
	EventID     string `json:"event_id"`
	SessionDate string `json:"session_date"`
	MaxQuota    int    `json:"max_quota"`
}
