import React from "react";
import StatCard from "../ui/StatCard";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

// Dummy data based on PRD requirement
const activeRegistrations = [
    {
        id: "REG-001",
        eventTitle: "Penilaian Kompetensi Manajerial Q3",
        date: "1-5 Sep 2026",
        location: "Kantor Regional V BKN Jakarta",
        peserta: 12,
        statusLabel: "Menunggu TTD Kepala Instansi",
        statusType: "waiting"
    }
];

export default function DashboardAdminInstansi() {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">👋 Selamat Datang, Admin Instansi</h1>
                <p className="text-slate-500 text-sm mt-1">Ringkasan pendaftaran dan status surat pengajuan instansi Anda.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Pendaftaran Aktif"
                    value={2}
                    icon={
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" />
                        </svg>
                    }
                />
                <StatCard
                    label="Peserta Terdaftar"
                    value={24}
                    icon={
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    }
                />
                <StatCard
                    label="Surat Diterima"
                    value={1}
                    icon={
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    }
                    accentColor="from-green-400 to-green-600"
                />
                <StatCard
                    label="Surat Proses"
                    value={1}
                    icon={
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                    }
                    accentColor="from-amber-400 to-amber-600"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Registrations) - Spans 2 cols */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col pt-1">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-800 text-lg">📋 Pendaftaran Aktif</h2>
                        <Button variant="ghost" size="sm" className="text-primary-blue h-8 -mr-2">Lihat Semua</Button>
                    </div>

                    <div className="flex flex-col p-5 gap-4">
                        {activeRegistrations.map((reg) => (
                            <div key={reg.id} className="border border-slate-200 rounded-lg p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-900">{reg.eventTitle}</h3>
                                    <div className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                                        <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 2v4" /><path d="M16 2v4" /></svg> {reg.date}</span>
                                        <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg> {reg.location}</span>
                                        <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> <strong>{reg.peserta}</strong> peserta terdaftar</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm mt-1">
                                    <span className="text-slate-600 font-medium">Status Surat:</span>
                                    <Badge variant={(reg.statusType as any) || 'waiting'}>{reg.statusLabel}</Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-2 border-t border-slate-100 pt-4">
                                    <Button variant="secondary" size="sm" className="w-full sm:w-auto text-center justify-center">Lihat Detail</Button>
                                    {reg.statusType === 'draft' && (
                                        <Button variant="primary" size="sm" className="w-full sm:w-auto text-center justify-center">Kelola Peserta</Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alerts / Notifications Column */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full pt-1">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-800 flex items-center gap-2 text-lg">
                            🔔 Notifikasi Terbaru
                        </h2>
                    </div>
                    <div className="p-5 flex flex-col gap-6">

                        {/* Alert Item 1 */}
                        <div className="flex gap-3 items-start relative">
                            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-primary-blue mt-0.5 relative z-10">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12h5l3 3h4l3-3h5" /><path d="M21 2v4" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 2v4" /><path d="M2 13v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-800 tracking-tight">Surat <span className="font-bold text-primary-blue">SURAT/001</span> telah ditandatangani Kepala Instansi.</span>
                                <span className="text-xs text-slate-400 mt-1">2 jam yang lalu</span>
                            </div>
                        </div>

                        {/* Alert Item 2 */}
                        <div className="flex gap-3 items-start relative">
                            <div className="w-9 h-9 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0 text-green-600 mt-0.5 relative z-10">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-800 tracking-tight"><strong className="text-green-600">2 peserta baru</strong> berhasil didaftarkan ke PenKom Manajerial Q3.</span>
                                <span className="text-xs text-slate-400 mt-1">Kemarin, 14:30</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

