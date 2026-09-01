package handler

import (
	"encoding/json"
	"net/http"

	"github.com/puspenkom-bkn/backend/internal/model"
	"github.com/puspenkom-bkn/backend/internal/service"
)

type BKNOfficeHandler struct {
	service *service.BKNOfficeService
}

func NewBKNOfficeHandler(service *service.BKNOfficeService) *BKNOfficeHandler {
	return &BKNOfficeHandler{service: service}
}

func (h *BKNOfficeHandler) CreateOffice(w http.ResponseWriter, r *http.Request) {
	var req model.CreateBKNRegionalOfficeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Payload JSON tidak valid", http.StatusBadRequest)
		return
	}

	res, err := h.service.CreateOffice(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(res)
}

func (h *BKNOfficeHandler) GetOffices(w http.ResponseWriter, r *http.Request) {
	list, err := h.service.GetOffices()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(list)
}

func (h *BKNOfficeHandler) GetOfficeByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "ID kantor regional wajib diisi", http.StatusBadRequest)
		return
	}

	office, err := h.service.GetOfficeByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(office)
}
