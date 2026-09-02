import React, { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "../ui/Table";
import Select from "../ui/Select";

const DUMMY_STAFF = [
    { id: "STF-001", nip: "198506122010121004", name: "Budi Santoso", position: "Analis SDM Aparatur Ahli Pertama" },
    { id: "STF-002", nip: "199004152015032001", name: "Siti Rahayu", position: "Perencana Ahli Muda" },
    { id: "STF-003", nip: "198803202014021003", name: "Ahmad Yani", position: "Auditor Ahli Madya" },
    { id: "STF-004", nip: "199211052019032008", name: "Dewi Lestari", position: "Pranata Komputer Ahli Pertama" },
    { id: "STF-005", nip: "198708172011011005", name: "Eko Prasetyo", position: "Analis Kepegawaian" },
];

export default function StaffManagement() {
    const [staffList, setStaffList] = useState(DUMMY_STAFF);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredStaff = staffList.filter((staff) =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.nip.includes(searchQuery)
    );

    const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
    const paginatedStaff = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // reset page to 1 when search query changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleAddStaff = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for adding staff logic
        setIsAddModalOpen(false);
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">👥 Kelola Master Data Staff</h1>
                <p className="text-slate-500 text-sm mt-1">Kelola database pegawai instansi Anda sebelum mendaftarkan ke event PenKom.</p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="w-full sm:w-80">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari berdasarkan NIP atau Nama..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition-shadow"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="secondary" className="flex-1 sm:flex-none flex items-center justify-center gap-2" onClick={() => setIsImportModalOpen(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                        Import Excel
                    </Button>
                    <Button variant="primary" className="flex-1 sm:flex-none flex items-center justify-center gap-2" onClick={() => setIsAddModalOpen(true)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Tambah Staff
                    </Button>
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">No</TableHead>
                        <TableHead>NIP</TableHead>
                        <TableHead>Nama Pegawai</TableHead>
                        <TableHead>Jabatan</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedStaff.length > 0 ? (
                        paginatedStaff.map((staff, idx) => (
                            <TableRow key={staff.id}>
                                <TableCell className="font-medium text-slate-500">{((currentPage - 1) * itemsPerPage) + idx + 1}</TableCell>
                                <TableCell className="font-mono text-slate-700">{staff.nip}</TableCell>
                                <TableCell className="font-semibold text-slate-900">{staff.name}</TableCell>
                                <TableCell>{staff.position}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-sm focus:outline-none" aria-label="Edit">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                        </button>
                                        <button className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm focus:outline-none" aria-label="Hapus">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                Tidak ada data staff yang ditemukan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 w-full py-1">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 min-w-[70px]">
                                        <Select
                                            className="bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-700 outline-none hover:border-slate-300 focus:border-primary-blue transition-colors cursor-pointer w-full text-sm"
                                            value={itemsPerPage}
                                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                        </Select>
                                    </div>
                                    <p>Menampilkan {paginatedStaff.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredStaff.length)} dari {filteredStaff.length} Pegawai</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                                    >
                                        Sebelumnya
                                    </button>
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`min-w-[32px] px-2 py-1 border rounded-md transition-colors ${currentPage === i + 1
                                                ? "border-primary-blue bg-primary-blue-light text-primary-blue font-medium"
                                                : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            {/* Modal Tambah Staff */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Tambah Data Pegawai"
                maxWidth="md"
            >
                <form onSubmit={handleAddStaff} className="flex flex-col gap-5 pt-2">
                    <Input
                        label="NIP (Nomor Induk Pegawai)"
                        placeholder="Masukkan 18 digit NIP"
                        isRequired
                    />
                    <Input
                        label="Nama Lengkap"
                        placeholder="Contoh: Budi Santoso, S.Kom"
                        isRequired
                    />
                    <Input
                        label="Jabatan"
                        placeholder="Contoh: Analis SDM Aparatur"
                        isRequired
                    />

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                        <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                        <Button variant="primary" type="submit">Simpan Data</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Import Excel */}
            <Modal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title="Import Data dari Excel"
                maxWidth="md"
            >
                <div className="flex flex-col gap-6 pt-2">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-2">
                        <p className="text-sm text-slate-600 mb-3">Pastikan format Excel Anda sesuai dengan template standar kami yang memiliki kolom <strong className="text-slate-800">NIP, Nama Pegawai, Jabatan</strong>.</p>
                        <Button variant="secondary" size="sm" className="w-full flex justify-center items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Download Template Excel (.xlsx)
                        </Button>
                    </div>

                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 hover:border-primary-blue transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary-blue group-hover:scale-110 transition-transform">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-slate-900">Pilih file atau <span className="text-primary-blue">drag & drop</span> di sini</p>
                            <p className="text-xs text-slate-500 mt-1">.xls atau .xlsx (Maks. 5MB)</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-slate-100">
                        <Button variant="ghost" onClick={() => setIsImportModalOpen(false)}>Batal</Button>
                        <Button variant="primary" disabled>Mulai Import</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
