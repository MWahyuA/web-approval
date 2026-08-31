import React, { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";

const DUMMY_EVENTS = [
    {
        id: "1",
        title: "Penilaian Kompetensi Manajerial Q3",
        location: "Kanreg I BKN Yogyakarta",
        date: "1-5 Sep 2026",
        quota: 100,
        status: "Aktif",
    },
    {
        id: "2",
        title: "Penilaian Kompetensi Teknis IT",
        location: "Kanreg III BKN Bandung",
        date: "10-12 Sep 2026",
        quota: 50,
        status: "Aktif",
    },
    {
        id: "3",
        title: "Penilaian Kompetensi Sosial Kultural",
        location: "Puspenkom BKN Pusat",
        date: "15-17 Sep 2026",
        quota: 80,
        status: "Draft",
    }
];

export default function EventManagement() {
    const [search, setSearch] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form state for creating event
    const [formData, setFormData] = useState({
        title: "",
        location_id: "",
        start_date: "",
        end_date: "",
        start_time: "",
        price: "",
        quota_per_day: ""
    });

    const filteredEvents = DUMMY_EVENTS.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Call API to create event
        console.log("Submit Create Event:", formData);
        setIsCreateModalOpen(false);
    };

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Area */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">📅 Kelola Event Penilaian Kompetensi</h1>
                <p className="text-sm text-slate-500">Buat, edit, dan pantau status event penilaian kompetensi.</p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button
                    variant="primary"
                    onClick={() => setIsCreateModalOpen(true)}
                    leftIcon={
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    }
                >
                    Buat Event Baru
                </Button>

                <div className="w-full sm:w-64">
                    <Input
                        placeholder="Cari event..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        leftIcon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm w-full overflow-hidden flex flex-col">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left flex-col min-w-[500px]">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="bg-slate-50 px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Judul Event</th>
                                <th className="bg-slate-50 px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Lokasi</th>
                                <th className="bg-slate-50 px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                <th className="bg-slate-50 px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Kuota</th>
                                <th className="bg-slate-50 px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="bg-slate-50 px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-5 py-3 font-medium text-slate-700 text-sm whitespace-nowrap">{event.title}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">{event.location}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">{event.date}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">{event.quota} per hari</td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <Badge variant={event.status === 'Aktif' ? 'success' : 'draft'}>
                                                {event.status}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3 text-right whitespace-nowrap">
                                            <button className="text-slate-400 hover:text-primary-blue p-2 rounded-lg hover:bg-slate-50 transition-colors" title="Edit Event">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-slate-500">
                                        Tidak ada event yang ditemukan untuk pencarian "{search}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Dummies */}
            <div className="flex items-center justify-between text-sm text-slate-500 mt-2">
                <p>Menampilkan {filteredEvents.length} dari {DUMMY_EVENTS.length} event</p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>Sebelumnya</button>
                    <button className="px-3 py-1.5 border border-primary-blue bg-primary-blue-light text-primary-blue font-medium rounded-md">1</button>
                    <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>Selanjutnya</button>
                </div>
            </div>

            {/* Create Event Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="📝 Buat Event Baru"
                maxWidth="xl"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="primary" onClick={handleCreateSubmit}>
                            Simpan & Publikasi
                        </Button>
                    </>
                }
            >
                <form id="create-event-form" className="flex flex-col gap-5 w-full" onSubmit={handleCreateSubmit}>
                    <Input
                        label="Judul Event"
                        required
                        placeholder="Contoh: Penilaian Kompetensi Manajerial Q4"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Lokasi <span className="text-red-500">*</span></label>
                        <select
                            required
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
                            value={formData.location_id}
                            onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                        >
                            <option value="" disabled>Pilih Lokasi Kantor Regional BKN</option>
                            <option value="1">Kanreg I BKN Yogyakarta</option>
                            <option value="2">Kanreg II BKN Surabaya</option>
                            <option value="3">Kanreg III BKN Bandung</option>
                            <option value="4">Pusat BKN Jakarta</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                            label="Tanggal Mulai"
                            type="date"
                            required
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        />
                        <Input
                            label="Tanggal Selesai"
                            type="date"
                            required
                            value={formData.end_date}
                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Waktu Mulai Tiap Harinya"
                        type="time"
                        required
                        value={formData.start_time}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                            label="Harga per Peserta"
                            type="number"
                            required
                            placeholder="0"
                            helperText="ℹ️ Isi 0 untuk event gratis"
                            leftIcon={<span className="text-slate-400 font-medium">Rp</span>}
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                        <Input
                            label="Kuota Maks per Hari"
                            type="number"
                            required
                            placeholder="Contoh: 100"
                            rightIcon={<span className="text-slate-400 text-xs font-medium">peserta</span>}
                            value={formData.quota_per_day}
                            onChange={(e) => setFormData({ ...formData, quota_per_day: e.target.value })}
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
}
