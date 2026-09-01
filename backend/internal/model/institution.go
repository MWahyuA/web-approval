package model

import "time"

// Institution merepresentasikan data instansi pengusung di Supabase
type Institution struct {
	ID                 string    `json:"id"`
	Name               string    `json:"name"`
	Code               string    `json:"code"`
	Address            string    `json:"address,omitempty"`
	LetterheadData     string    `json:"letterhead_data,omitempty"`
	LetterNumberFormat string    `json:"letter_number_format,omitempty"`
	CreatedAt          time.Time `json:"created_at"`
}

// Staff merepresentasikan data pegawai/ASN di Supabase
type Staff struct {
	ID            string    `json:"id"`
	NIP           string    `json:"nip"`
	Name          string    `json:"name"`
	Position      string    `json:"position,omitempty"`
	InstitutionID string    `json:"institution_id"`
	CreatedAt     time.Time `json:"created_at"`
}

// CreateInstitutionRequest payload JSON untuk membuat instansi baru
type CreateInstitutionRequest struct {
	Name               string `json:"name"`
	Code               string `json:"code"`
	Address            string `json:"address"`
	LetterheadData     string `json:"letterhead_data"`
	LetterNumberFormat string `json:"letter_number_format"`
}

// CreateStaffRequest payload JSON untuk membuat pegawai/ASN baru
type CreateStaffRequest struct {
	NIP           string `json:"nip"`
	Name          string `json:"name"`
	Position      string `json:"position"`
	InstitutionID string `json:"institution_id"`
}
