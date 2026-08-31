import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";

// Local interface matching the API response
interface EventSession {
    id: string;
    event_id: string;
    session_date: string;
    max_quota: number;
    used_quota: number;
}

interface EventData {
    id: string;
    title: string;
    location_id: string;
    start_date: string;
    end_date: string;
    start_time: string;
    price: number;
    status: string;
    sessions?: EventSession[];
}

export default function EventManagement() {
    const [search, setSearch] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [events, setEvents] = useState<EventData[]>([]);
    const [locations, setLocations] = useState<{ id: string, name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state for creating event
    const [formData, setFormData] = useState({
        title: "",
        location_id: "",
        start_date: "",
        end_date: "",
        start_time: "",
        price: "",
        status: "active",
        sessions: [] as { date: string; max_quota: string }[]
    });

    useEffect(() => {
        if (formData.start_date && formData.end_date) {
            const startDate = new Date(formData.start_date);
            const endDate = new Date(formData.end_date);
            if (startDate <= endDate) {
                const newSessions: { date: string; max_quota: string }[] = [];
                let current = new Date(startDate);
                while (current <= endDate) {
                    const dateStr = current.toISOString().split('T')[0];
                    const existing = formData.sessions.find(s => s.date === dateStr);
                    newSessions.push({
                        date: dateStr,
                        max_quota: existing ? existing.max_quota : ""
                    });
                    current.setDate(current.getDate() + 1);
                }
                // Avoid infinite loop by checking if we really need to update
                if (JSON.stringify(newSessions) !== JSON.stringify(formData.sessions)) {
                    setFormData(prev => ({ ...prev, sessions: newSessions }));
                }
            } else if (formData.sessions.length > 0) {
                setFormData(prev => ({ ...prev, sessions: [] }));
            }
        } else if (formData.sessions.length > 0) {
            setFormData(prev => ({ ...prev, sessions: [] }));
        }
    }, [formData.start_date, formData.end_date, formData.sessions]);

    const fetchEventsAndLocations = async () => {
        setIsLoading(true);
        try {
            const [eventsRes, locationsRes] = await Promise.all([
                fetch("http://localhost:8080/api/v1/events"),
                fetch("http://localhost:8080/api/v1/institutions")
            ]);

            if (eventsRes.ok) {
                const data = await eventsRes.json();
                // Handle both wrapped {data: ...} and direct array
                setEvents(Array.isArray(data) ? data : (data.data || []));
            }
            if (locationsRes.ok) {
                const locData = await locationsRes.json();
                setLocations(Array.isArray(locData) ? locData : (locData.data || []));
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEventsAndLocations();
    }, []);

    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setFormData({
            title: "",
            location_id: "",
            start_date: "",
            end_date: "",
            start_time: "",
            price: "",
            status: "active",
            sessions: []
        });
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/v1/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    location_id: formData.location_id,
                    start_date: formData.start_date,
                    end_date: formData.end_date,
                    start_time: formData.start_time,
                    price: parseFloat(formData.price) || 0,
                    status: formData.status
                })
            });

            if (res.ok) {
                const createdEvent = await res.json();

                // Create sessions
                if (formData.sessions.length > 0) {
                    const sessionPromises = formData.sessions.map(sess => {
                        return fetch(`http://localhost:8080/api/v1/events/${createdEvent.id}/sessions`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                event_id: createdEvent.id,
                                session_date: sess.date,
                                max_quota: parseInt(sess.max_quota) || 0
                            })
                        });
                    });
                    await Promise.all(sessionPromises);
                }

                handleCloseModal();
                fetchEventsAndLocations(); // Refresh data
            } else {
                const err = await res.json();
                alert(`Error: ${err.message || 'Gagal menyimpan event'}`);
            }
        } catch (error) {
            console.error("Submit Event error:", error);
            alert("Terjadi kesalahan jaringan.");
        } finally {
            setIsSubmitting(false);
        }
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-slate-500">Memuat data event...</td>
                                </tr>
                            ) : filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-5 py-3 font-medium text-slate-700 text-sm whitespace-nowrap">{event.title}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">
                                            {locations.find(l => l.id === event.location_id)?.name || "Pusat Penilaian - BKN"}
                                        </td>
                                        <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">{event.start_date} s.d {event.end_date}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">
                                            {event.sessions && event.sessions.length > 0 ? `${event.sessions[0].max_quota} per sesi` : "-"}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <Badge
                                                variant={event.status === 'active' ? 'success' : event.status === 'completed' ? 'info' : 'draft'}
                                            >
                                                {event.status === 'active' ? 'Aktif' : event.status === 'completed' ? 'Selesai' : 'Tidak Aktif'}
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
                <p>Menampilkan {filteredEvents.length} event</p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>Sebelumnya</button>
                    <button className="px-3 py-1.5 border border-primary-blue bg-primary-blue-light text-primary-blue font-medium rounded-md">1</button>
                    <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>Selanjutnya</button>
                </div>
            </div>

            {/* Create Event Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                title="📝 Buat Event Baru"
                maxWidth="xl"
                footer={
                    <>
                        <Button variant="ghost" onClick={handleCloseModal} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button variant="primary" onClick={handleCreateSubmit} isLoading={isSubmitting}>
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
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                            label="Tanggal Mulai"
                            type="date"
                            required
                            min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        />
                        <Input
                            label="Tanggal Selesai"
                            type="date"
                            required
                            min={formData.start_date || new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                            value={formData.end_date}
                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                            label="Waktu Mulai Tiap Harinya"
                            type="time"
                            required
                            value={formData.start_time}
                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        />
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
                    </div>

                    {/* Dynamic Session Quotas */}
                    {formData.sessions.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-100">
                            <label className="text-sm font-semibold text-slate-700">Atur Kuota per Sesi (Hari) <span className="text-red-500">*</span></label>
                            <p className="text-xs text-slate-500 mb-1">Total {formData.sessions.length} hari yang terdeteksi dari rentang tanggal. Tentukan kuota maksimal tiap harinya.</p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3 max-h-48 overflow-y-auto custom-scrollbar">
                                {formData.sessions.map((session, index) => (
                                    <div key={session.date} className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-primary-blue"></span>
                                            <span className="text-sm font-medium text-slate-700">{
                                                new Date(session.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
                                            }</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                placeholder="Kuota..."
                                                className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-blue"
                                                value={session.max_quota}
                                                onChange={(e) => {
                                                    const newSessions = [...formData.sessions];
                                                    newSessions[index].max_quota = e.target.value;
                                                    setFormData({ ...formData, sessions: newSessions });
                                                }}
                                                required
                                            />
                                            <span className="text-xs text-slate-400">orang</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-200 px-1">
                                <span className="text-sm font-semibold text-slate-700">Total Keseluruhan Kuota</span>
                                <span className="text-lg font-bold text-primary-blue">
                                    {formData.sessions.reduce((acc, curr) => acc + (parseInt(curr.max_quota) || 0), 0)}
                                    <span className="text-sm font-normal text-slate-500 ml-1">orang</span>
                                </span>
                            </div>
                        </div>
                    )}
                </form>
            </Modal>
        </div>
    );
}
