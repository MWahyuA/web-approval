package handler

import (
	"encoding/json"
	"net/http"

	"github.com/puspenkom-bkn/backend/internal/model"
	"github.com/puspenkom-bkn/backend/internal/service"
)

type InstitutionHandler struct {
	service *service.InstitutionService
}

func NewInstitutionHandler(service *service.InstitutionService) *InstitutionHandler {
	return &InstitutionHandler{service: service}
}

func (h *InstitutionHandler) CreateInstitution(w http.ResponseWriter, r *http.Request) {
	var req model.CreateInstitutionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Payload JSON tidak valid", http.StatusBadRequest)
		return
	}

	res, err := h.service.CreateInstitution(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(res)
}

func (h *InstitutionHandler) GetInstitutions(w http.ResponseWriter, r *http.Request) {
	list, err := h.service.GetInstitutions()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(list)
}

func (h *InstitutionHandler) GetInstitutionByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "ID instansi wajib diisi", http.StatusBadRequest)
		return
	}

	inst, err := h.service.GetInstitutionByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(inst)
}

func (h *InstitutionHandler) CreateStaff(w http.ResponseWriter, r *http.Request) {
	var req model.CreateStaffRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Payload JSON tidak valid", http.StatusBadRequest)
		return
	}

	res, err := h.service.CreateStaff(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(res)
}

func (h *InstitutionHandler) GetStaffByInstitution(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "ID instansi wajib diisi", http.StatusBadRequest)
		return
	}

	list, err := h.service.GetStaffByInstitution(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(list)
}

func (h *InstitutionHandler) GetStaffByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "ID staf wajib diisi", http.StatusBadRequest)
		return
	}

	staff, err := h.service.GetStaffByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(staff)
}

func (h *InstitutionHandler) UpdateStaff(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "ID staf wajib diisi", http.StatusBadRequest)
		return
	}

	var req model.UpdateStaffRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Payload JSON tidak valid", http.StatusBadRequest)
		return
	}

	res, err := h.service.UpdateStaff(id, req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

func (h *InstitutionHandler) DeleteStaff(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "ID staf wajib diisi", http.StatusBadRequest)
		return
	}

	if err := h.service.DeleteStaff(id); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Staf berhasil dihapus"})
}

func (h *InstitutionHandler) UpdateInstitution(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "ID instansi wajib diisi", http.StatusBadRequest)
		return
	}

	var req model.UpdateInstitutionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Payload JSON tidak valid", http.StatusBadRequest)
		return
	}

	res, err := h.service.UpdateInstitution(id, req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

func (h *InstitutionHandler) DeleteInstitution(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "ID instansi wajib diisi", http.StatusBadRequest)
		return
	}

	if err := h.service.DeleteInstitution(id); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Instansi berhasil dihapus"})
}
