import React, { useState, useRef } from "react";
import * as XLSX from 'xlsx';
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "../ui/Table";
import Select from "../ui/Select";

interface StaffData {
    id: string;
    nip: string;
    name: string;
    position: string;
    institution_id: string;
}

export default function StaffManagement() {
    const [staffList, setStaffList] = useState<StaffData[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [modalState, setModalState] = useState<{ isOpen: boolean, type: 'create' | 'edit', staffId: string | null }>({ isOpen: false, type: 'create', staffId: null });
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [importError, setImportError] = useState<string | null>(null);

    const [formData, setFormData] = useState({ nip: "", name: "", position: "" });
    const [instId, setInstId] = useState<string>("");

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

    React.useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            let userInstId = user?.institution_id;

            // Temporary workaround to fetch first institution if user doesn't have institution_id yet
            if (!userInstId) {
                try {
                    const res = await fetch("http://localhost:8080/api/v1/institutions");
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.length > 0) {
                            userInstId = data[0].id;
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch institutions", e);
                }
            }

            if (userInstId) {
                setInstId(userInstId);
                fetchStaff(userInstId);
            } else {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    const fetchStaff = async (institutionId: string) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token") || "";
            const res = await fetch(`http://localhost:8080/api/v1/institutions/${institutionId}/staff`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStaffList(data || []);
            }
        } catch (error) {
            console.error("Failed to fetch staff", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (type: 'create' | 'edit', staff?: StaffData) => {
        setFormError(null);
        if (type === 'edit' && staff) {
            setFormData({ nip: staff.nip, name: staff.name, position: staff.position });
            setModalState({ isOpen: true, type: 'edit', staffId: staff.id });
        } else {
            setFormData({ nip: "", name: "", position: "" });
            setModalState({ isOpen: true, type: 'create', staffId: null });
        }
    };

    const handleSubmitStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Validation check for duplicates
        const isDuplicate = staffList.some(staff => staff.nip === formData.nip && staff.id !== modalState.staffId);
        if (isDuplicate) {
            setFormError("Pegawai dengan NIP tersebut sudah terdaftar!");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token") || "";
            const url = modalState.type === 'edit'
                ? `http://localhost:8080/api/v1/staff/${modalState.staffId}`
                : "http://localhost:8080/api/v1/staff";
            const method = modalState.type === 'edit' ? "PUT" : "POST";

            const payload = modalState.type === 'edit'
                ? formData
                : { ...formData, institution_id: instId };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setModalState({ isOpen: false, type: 'create', staffId: null });
                if (instId) fetchStaff(instId);
            } else {
                const err = await res.json();
                alert(`Error: ${err.message || 'Gagal menyimpan staff'}`);
            }
        } catch (error) {
            console.error("Failed to save staff", error);
            alert("Terjadi kesalahan jaringan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteStaff = async (id: string) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data pegawai ini?")) return;
        try {
            const token = localStorage.getItem("token") || "";
            const res = await fetch(`http://localhost:8080/api/v1/staff/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                if (instId) fetchStaff(instId);
            } else {
                const err = await res.json();
                alert(`Error: ${err.message || 'Gagal menghapus staff'}`);
            }
        } catch (error) {
            console.error("Failed to delete staff", error);
            alert("Terjadi kesalahan jaringan.");
        }
    };

    const handleDownloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([
            { "NIP": "198506122010121004", "Nama Pegawai": "Budi Santoso", "Jabatan": "Analis SDM Aparatur Ahli Pertama" }
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template_Staff");
        XLSX.writeFile(wb, "Template_Data_Pegawai.xlsx");
    };

    const handleImportData = async () => {
        if (!selectedFile) return;
        setIsSubmitting(true);
        try {
            const data = await selectedFile.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

            const validRows: any[] = [];
            const duplicateNips: string[] = [];

            jsonData.forEach(row => {
                const rowNip = String(row["NIP"]?.toString().trim() || "");
                const rowName = String(row["Nama Pegawai"]?.toString().trim() || "");
                const rowPosition = String(row["Jabatan"]?.toString().trim() || "");

                if (!rowNip || !rowName) return; // skip invalid required format

                const isDup = staffList.some(s => s.nip === rowNip) || validRows.some(vr => vr.nip === rowNip);
                if (isDup) {
                    duplicateNips.push(rowNip);
                } else {
                    validRows.push({
                        nip: rowNip,
                        name: rowName,
                        position: rowPosition,
                        institution_id: instId
                    });
                }
            });

            if (validRows.length === 0) {
                if (duplicateNips.length > 0) {
                    setImportError("Semua pegawai dalam file ini sudah terdaftar di database!");
                } else {
                    setImportError("Data di file tidak valid atau kosong. Mohon periksa format nama kolomnya.");
                }
                setIsSubmitting(false);
                return;
            }

            // Post all validRows sequentially or Promise.all
            const token = localStorage.getItem("token") || "";
            const promises = validRows.map(payload =>
                fetch("http://localhost:8080/api/v1/staff", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                })
            );

            await Promise.all(promises);

            if (duplicateNips.length > 0) {
                alert(`Berhasil impor ${validRows.length} data. Terdapat ${duplicateNips.length} data diabaikan karena NIP duplikat.`);
            } else {
                alert(`Sukses berhasil impor ${validRows.length} data pegawai.`);
            }

            setIsImportModalOpen(false);
            setSelectedFile(null);
            fetchStaff(instId);
        } catch (error) {
            console.error("Import failed:", error);
            setImportError("Gagal membaca atau memproses file Excel. Pastikan format file benar.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kelola Master Data Pegawai</h1>
                <p className="text-slate-500 text-sm mt-1">Kelola database pegawai instansi Anda sebelum mendaftarkan ke event PenKom.</p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="w-full flex-1">
                    <Input
                        wrapperClassName="w-full h-full"
                        className="w-full h-full min-h-[44px]"
                        placeholder="Cari berdasarkan NIP atau Nama..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        }
                    />
                </div>
                <div className="flex items-stretch gap-3 w-full sm:w-auto shrink-0">
                    <Button variant="secondary" className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-[44px]" onClick={() => setIsImportModalOpen(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                        Import Excel
                    </Button>
                    <Button variant="primary" className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-[44px]" onClick={() => handleOpenModal('create')}>
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
                        <TableHead className="!text-center">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                Memuat data...
                            </TableCell>
                        </TableRow>
                    ) : paginatedStaff.length > 0 ? (
                        paginatedStaff.map((staff, idx) => (
                            <TableRow key={staff.id}>
                                <TableCell className="font-medium text-slate-500">{((currentPage - 1) * itemsPerPage) + idx + 1}</TableCell>
                                <TableCell className="font-mono text-slate-700">{staff.nip}</TableCell>
                                <TableCell className="font-semibold text-slate-900">{staff.name}</TableCell>
                                <TableCell>{staff.position}</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-sm focus:outline-none"
                                            aria-label="Edit"
                                            onClick={() => handleOpenModal('edit', staff)}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                        </button>
                                        <button
                                            className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm focus:outline-none"
                                            aria-label="Hapus"
                                            onClick={() => handleDeleteStaff(staff.id)}
                                        >
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

            {/* Modal Tambah/Edit Staff */}
            <Modal
                isOpen={modalState.isOpen}
                onClose={() => {
                    setModalState({ ...modalState, isOpen: false });
                    setFormError(null);
                }}
                title={modalState.type === 'create' ? "Tambah Data Pegawai" : "Edit Data Pegawai"}
                maxWidth="md"
            >
                <form onSubmit={handleSubmitStaff} className="flex flex-col gap-5 pt-2">
                    {formError && (
                        <div className="flex items-center gap-2 p-3 pb-3 -mb-1 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{formError}</span>
                        </div>
                    )}
                    <Input
                        label="NIP (Nomor Induk Pegawai)"
                        placeholder="Masukkan 18 digit NIP"
                        isRequired
                        value={formData.nip}
                        onChange={(e) => {
                            setFormData({ ...formData, nip: e.target.value });
                            setFormError(null);
                        }}
                    />
                    <Input
                        label="Nama Lengkap"
                        placeholder="Contoh: Budi Santoso, S.Kom"
                        isRequired
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                        label="Jabatan"
                        placeholder="Contoh: Analis SDM Aparatur"
                        isRequired
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                        <Button variant="ghost" type="button" onClick={() => setModalState({ ...modalState, isOpen: false })} disabled={isSubmitting}>Batal</Button>
                        <Button variant="primary" type="submit" isLoading={isSubmitting}>Simpan Data</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Import Excel */}
            <Modal
                isOpen={isImportModalOpen}
                onClose={() => {
                    setIsImportModalOpen(false);
                    setSelectedFile(null);
                    setImportError(null);
                }}
                title="Import Data dari Excel"
                maxWidth="md"
            >
                <div className="flex flex-col gap-6 pt-2">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-2">
                        <p className="text-sm text-slate-600 mb-2">
                            Pastikan format Excel Anda sesuai dengan template standar kami yang memiliki kolom <strong className="text-slate-800">NIP, Nama Pegawai, Jabatan</strong>.
                        </p>

                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 shadow-sm">
                            <p className="text-sm text-amber-800">
                                <span className="font-bold flex items-center gap-1.5 mb-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                    Format NIP
                                </span>
                                Ketik tanda kutip satu (<code className="font-bold text-amber-900">'</code>) sebelum angkanya di Excel agar tidak error / berubah jadi tulisan aneh.
                                <br />Contoh: <code className="bg-white/60 px-1 py-0.5 rounded font-mono font-bold border border-amber-100">'198506122010121004</code>
                            </p>
                        </div>

                        <Button variant="secondary" size="sm" className="w-full flex justify-center items-center gap-2" onClick={handleDownloadTemplate} type="button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Download Template Excel (.xlsx)
                        </Button>
                    </div>

                    {importError && (
                        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{importError}</span>
                        </div>
                    )}

                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => {
                            setImportError(null);
                            const file = e.target.files?.[0];
                            if (file) setSelectedFile(file);
                        }}
                    />

                    <div
                        className={`border-2 border-dashed ${selectedFile ? 'border-primary-blue bg-blue-50/50' : 'border-slate-300'} rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 hover:border-primary-blue transition-colors cursor-pointer group`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            setImportError(null);
                            const file = e.dataTransfer.files[0];
                            if (file && (file.name.endsWith('.xls') || file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))) {
                                setSelectedFile(file);
                            }
                        }}
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary-blue group-hover:scale-110 transition-transform">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                        </div>
                        <div className="text-center">
                            {selectedFile ? (
                                <>
                                    <p className="text-sm font-semibold text-primary-blue">{selectedFile.name}</p>
                                    <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB terpilih</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-slate-900">Pilih file atau <span className="text-primary-blue">drag & drop</span> di sini</p>
                                    <p className="text-xs text-slate-500 mt-1">.xls atau .xlsx (Maks. 5MB)</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-slate-100">
                        <Button variant="ghost" onClick={() => {
                            setIsImportModalOpen(false);
                            setSelectedFile(null);
                            setImportError(null);
                        }} disabled={isSubmitting}>Batal</Button>
                        <Button variant="primary" disabled={!selectedFile || isSubmitting} isLoading={isSubmitting} onClick={handleImportData}>Mulai Import</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
