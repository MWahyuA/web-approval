package service

import (
	"testing"

	"github.com/puspenkom-bkn/backend/internal/model"
)

// Tes apakah validasi nama kosong berjalan dengan benar
func TestCreateInstitution_NamaKosong(t *testing.T) {
	// 1. Inisialisasi Service (repo nil karena validasi terjadi sebelum ke DB)
	svc := NewInstitutionService(nil)

	// 2. Siapkan Request TANPA Nama (Nama = "")
	req := model.CreateInstitutionRequest{
		Name: "",
		Code: "BKN-01",
	}

	// 3. Panggil method CreateInstitution pada struct svc
	_, err := svc.CreateInstitution(req)

	// 4. Pengecekan (Assert): Seharusnya return error karena nama kosong
	if err == nil {
		t.Errorf("Ekspektasi: Error karena nama kosong, tapi hasil: err == nil (tidak ada error)")
	}
}
