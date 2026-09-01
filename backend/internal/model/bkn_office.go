package model

import "time"

// BKNRegionalOffice merepresentasikan data Kantor Regional BKN di Supabase
type BKNRegionalOffice struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Address   string    `json:"address,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// CreateBKNRegionalOfficeRequest payload JSON untuk membuat kantor regional BKN baru
type CreateBKNRegionalOfficeRequest struct {
	Name    string `json:"name"`
	Address string `json:"address"`
}
