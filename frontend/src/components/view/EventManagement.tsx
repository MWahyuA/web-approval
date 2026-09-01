import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Badge from "../ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import Modal from "../ui/Modal";

// Local interface matching the API response
interface EventSession {
    id: string;
    event_id: string;
    session_date: string;
    max_quota: number;
    used_quota: number;
    remaining_quota?: number;
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
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'create' | 'edit' | 'view';
        eventId: string | null;
    }>({ isOpen: false, type: 'create', eventId: null });
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
        sessions: [] as { id?: string; date: string; max_quota: string }[]
    });

    useEffect(() => {
        if (formData.start_date && formData.end_date) {
            const startDate = new Date(formData.start_date);
            const endDate = new Date(formData.end_date);
            if (startDate <= endDate) {
                const newSessions: { id?: string; date: string; max_quota: string }[] = [];
                let current = new Date(startDate);
                while (current <= endDate) {
                    const dateStr = current.toISOString().split('T')[0];
                    const existing = formData.sessions.find(s => s.date === dateStr);
                    newSessions.push({
                        id: existing ? existing.id : undefined,
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
                fetch("http://localhost:8080/api/v1/bkn-regional-offices")
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
        setModalState({ isOpen: false, type: 'create', eventId: null });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (modalState.type === 'view') return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const url = modalState.type === 'edit'
                ? `http://localhost:8080/api/v1/events/${modalState.eventId}`
                : "http://localhost:8080/api/v1/events";
            const method = modalState.type === 'edit' ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
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
                const savedEvent = await res.json();
                const targetEventId = modalState.type === 'create' ? savedEvent.id : modalState.eventId;

                // Create sessions
                if (formData.sessions.length > 0) {
                    const sessionPromises = formData.sessions.map(sess => {
                        if (modalState.type === 'edit' && sess.id) {
                            return fetch(`http://localhost:8080/api/v1/sessions/${sess.id}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    session_date: sess.date,
                                    max_quota: parseInt(sess.max_quota) || 0
                                })
                            });
                        }
                        return fetch(`http://localhost:8080/api/v1/events/${targetEventId}/sessions`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                event_id: targetEventId,
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
                    onClick={() => {
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
                        setModalState({ isOpen: true, type: 'create', eventId: null });
                    }}
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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul Event</TableHead>
                            <TableHead>Lokasi</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Jumlah Kuota</TableHead>
                            <TableHead>Kuota Tersisa</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="!text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <>
                                {[...Array(3)].map((_, i) => (
                                    <TableRow key={i} className="animate-pulse">
                                        <TableCell><div className="h-4 bg-slate-200 rounded w-3/4"></div></TableCell>
                                        <TableCell><div className="h-4 bg-slate-200 rounded w-1/2"></div></TableCell>
                                        <TableCell><div className="h-4 bg-slate-200 rounded w-2/3"></div></TableCell>
                                        <TableCell><div className="h-4 bg-slate-200 rounded w-16"></div></TableCell>
                                        <TableCell><div className="h-4 bg-slate-200 rounded w-16"></div></TableCell>
                                        <TableCell><div className="h-6 bg-slate-200 rounded-full w-16"></div></TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                                                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ) : filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => {
                                const maxQuota = event.sessions ? event.sessions.reduce((acc, curr) => acc + (curr.max_quota || 0), 0) : 0;
                                const usedQuota = event.sessions ? event.sessions.reduce((acc, curr) => acc + (curr.used_quota || 0), 0) : 0;
                                const remainingQuota = maxQuota - usedQuota;

                                return (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium text-slate-700">{event.title}</TableCell>
                                        <TableCell>
                                            {locations.find(l => l.id === event.location_id)?.name || "Pusat Penilaian - BKN"}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(event.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            {" - "}
                                            {new Date(event.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-700">
                                            {maxQuota} orang
                                        </TableCell>
                                        <TableCell className="font-medium text-primary-blue">
                                            {remainingQuota} orang
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={event.status === 'active' ? 'success' : event.status === 'completed' ? 'info' : 'draft'}
                                            >
                                                {event.status === 'active' ? 'Aktif' : event.status === 'completed' ? 'Selesai' : 'Tidak Aktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm" title="Lihat" onClick={() => {
                                                    setFormData({
                                                        title: event.title,
                                                        location_id: event.location_id,
                                                        start_date: event.start_date.split('T')[0],
                                                        end_date: event.end_date.split('T')[0],
                                                        start_time: event.start_time,
                                                        price: event.price.toString(),
                                                        status: event.status,
                                                        sessions: (event.sessions || []).map(s => ({ id: s.id, date: s.session_date.split('T')[0], max_quota: s.max_quota.toString() }))
                                                    });
                                                    setModalState({ isOpen: true, type: 'view', eventId: event.id });
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors shadow-sm" title="Edit" onClick={() => {
                                                    setFormData({
                                                        title: event.title,
                                                        location_id: event.location_id,
                                                        start_date: event.start_date.split('T')[0],
                                                        end_date: event.end_date.split('T')[0],
                                                        start_time: event.start_time,
                                                        price: event.price.toString(),
                                                        status: event.status,
                                                        sessions: (event.sessions || []).map(s => ({ id: s.id, date: s.session_date.split('T')[0], max_quota: s.max_quota.toString() }))
                                                    });
                                                    setModalState({ isOpen: true, type: 'edit', eventId: event.id });
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                                    Tidak ada event yang ditemukan untuk pencarian "{search}".
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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

            {/* Dynamically Reused Modal */}
            <Modal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                title={modalState.type === 'create' ? "📝 Buat Event Baru" : modalState.type === 'edit' ? "✏️ Edit Event" : "👁️ Detail Event"}
                maxWidth="xl"
                footer={
                    <>
                        {modalState.type === 'view' ? (
                            <Button variant="ghost" onClick={handleCloseModal}>Tutup</Button>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={handleCloseModal} disabled={isSubmitting}>Batal</Button>
                                <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
                                    {modalState.type === 'create' ? "Simpan & Publikasi" : "Simpan Perubahan"}
                                </Button>
                            </>
                        )}
                    </>
                }
            >
                <form id="create-event-form" className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
                    <Input
                        label="Judul Event"
                        required
                        placeholder="Contoh: Penilaian Kompetensi Manajerial Q4"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        disabled={modalState.type === 'view'}
                    />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Lokasi <span className="text-red-500">*</span></label>
                        <select
                            required
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all disabled:bg-slate-100 disabled:text-slate-500"
                            value={formData.location_id}
                            onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                            disabled={modalState.type === 'view'}
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
                            min={modalState.type === 'create' ? new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] : undefined}
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            disabled={modalState.type === 'view'}
                        />
                        <Input
                            label="Tanggal Selesai"
                            type="date"
                            required
                            min={modalState.type === 'create' ? (formData.start_date || new Date().toISOString().split('T')[0]) : undefined}
                            value={formData.end_date}
                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            disabled={modalState.type === 'view'}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                            label="Waktu Mulai Tiap Harinya"
                            type="time"
                            required
                            value={formData.start_time}
                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                            disabled={modalState.type === 'view'}
                        />
                        <Input
                            label="Harga per Peserta"
                            type="number"
                            required
                            min="0"
                            placeholder="0"
                            helperText="ℹ️ Isi 0 untuk event gratis"
                            leftIcon={<span className="text-slate-400 font-medium">Rp</span>}
                            value={formData.price}
                            disabled={modalState.type === 'view'}
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === 'E') {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || Number(val) >= 0) {
                                    setFormData({ ...formData, price: val });
                                }
                            }}
                        />
                    </div>

                    {modalState.type !== 'create' && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">Status Event <span className="text-red-500">*</span></label>
                            <select
                                required
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all disabled:bg-slate-100 disabled:text-slate-500"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                disabled={modalState.type === 'view'}
                            >
                                <option value="active">Aktif</option>
                                <option value="inactive">Inaktif</option>
                            </select>
                        </div>
                    )}

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
                                                min="0"
                                                placeholder="Kuota..."
                                                className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-blue disabled:bg-slate-100 disabled:text-slate-500"
                                                value={session.max_quota}
                                                disabled={modalState.type === 'view'}
                                                onKeyDown={(e) => {
                                                    if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === 'E') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '' || Number(val) >= 0) {
                                                        const newSessions = [...formData.sessions];
                                                        newSessions[index].max_quota = val;
                                                        setFormData({ ...formData, sessions: newSessions });
                                                    }
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
