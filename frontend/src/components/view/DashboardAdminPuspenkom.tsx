import React from "react";
import StatCard from "../ui/StatCard";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";

// Dummy data based on PRD requirement
const unverifiedLetters = [
    { id: "SURAT/001", instansi: "Kemenkumham", peserta: 12, status: "🟡 Baru" },
    { id: "SURAT/002", instansi: "Kemenkes", peserta: 8, status: "🟡 Baru" },
    { id: "SURAT/003", instansi: "Kemendikbud", peserta: 15, status: "🔵 Proses" },
];

export default function DashboardAdminPuspenkom() {
    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Admin Puspenkom</h1>
                <p className="text-slate-500 text-sm mt-1">Ringkasan aktivitas verifikasi surat pengajuan PenKom.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="PenKom Aktif"
                    value={12}
                    icon={
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 2v4" /><path d="M16 2v4" />
                        </svg>
                    }
                />
                <StatCard
                    label="Surat Masuk"
                    value={8}
                    icon={
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.2 8.4c.5.3.8.8.8 1.4v10.2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.8c0-.6.3-1.1.8-1.4l8-5.3a2 2 0 0 1 2.4 0l8 5.3Z" /><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
                        </svg>
                    }
                />
                <StatCard
                    label="Peserta Terdaftar"
                    value={156}
                    icon={
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    }
                    trend={{ value: "12%", positive: true }}
                />
                <StatCard
                    label="Menunggu TTD Kepala"
                    value={3}
                    icon={
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m21.6 10-3-3" /><path d="m15.4 3.7 3 3" /><path d="m14 8-1.3-1.3C11.5 5.5 10 5.4 9 6.2 7.7 7.2 8 8 9.5 9.2c1.7 1.4 3.4 1 5 1.7l-4.5 4.5c-.8.8-2 .9-3 .1L5 13.5l-3 3 1.2 2.8L6 20l2.8-1.2 3.1-3.1" /><path d="M20 12v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" /><path d="M16 2v2" />
                        </svg>
                    }
                    accentColor="from-amber-400 to-amber-600"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Table Column - Spans 2 cols */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="font-semibold text-slate-800">📋 Surat Masuk Perlu Verifikasi</h2>
                        <a href="/dashboard/surat" className="text-sm font-medium text-primary-blue hover:underline">Lihat Semua</a>
                    </div>
                    <div className="w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. Surat</TableHead>
                                    <TableHead>Instansi</TableHead>
                                    <TableHead>Jml Peserta</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="!text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {unverifiedLetters.map((letter) => (
                                    <TableRow key={letter.id}>
                                        <TableCell className="font-semibold text-slate-700">{letter.id}</TableCell>
                                        <TableCell>{letter.instansi}</TableCell>
                                        <TableCell>{letter.peserta} Orang</TableCell>
                                        <TableCell>
                                            <Badge variant={letter.status.includes('Baru') ? 'waiting' : 'info'}>
                                                {letter.status.replace('🟡', '').replace('🔵', '').trim()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end">
                                                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm focus:outline-none" aria-label="Lihat Surat">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Alerts / Notifications Column */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                            ⚠️ Alert Sistem
                        </h2>
                    </div>
                    <div className="p-5 flex flex-col gap-4">

                        {/* Alert Item 1 */}
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5 text-red-600">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-800">Verifikasi Terlambat</span>
                                <span className="text-xs text-slate-500 leading-relaxed mt-0.5">
                                    Terdapat <strong>2 surat</strong> menunggu verifikasi lebih dari 3 hari. Segera tindak lanjuti.
                                </span>
                                <a href="#" className="text-xs text-primary-blue font-medium mt-1 hover:underline">Lihat daftar surat</a>
                            </div>
                        </div>

                        {/* Alert Item 2 */}
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-600">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-800">Kuota PenKom Menipis</span>
                                <span className="text-xs text-slate-500 leading-relaxed mt-0.5">
                                    PenKom <strong>Manajerial Q4</strong> (Jakarta) kapasitasnya hampir penuh (90%).
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
