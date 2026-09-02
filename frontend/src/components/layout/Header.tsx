import React, { useState } from "react";

interface HeaderProps {
    userName?: string;
    userRole?: string;
    notificationCount?: number;
}

export default function Header({
    userName = "",
    userRole = "",
    notificationCount = 5,
}: HeaderProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotif, setShowNotif] = useState(false);

    return (
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-100 flex items-center justify-end px-6 gap-3">
            {/* Notification bell */}
            <div className="relative">
                <button
                    onClick={() => { setShowNotif(!showNotif); setShowDropdown(false); }}
                    className="relative w-10 h-10 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                    aria-label="Notifications"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    {notificationCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-gradient-primary text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                            {notificationCount}
                        </span>
                    )}
                </button>

                {/* Notification dropdown */}
                {showNotif && (
                    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 border-b border-slate-100">
                            <span className="text-sm font-semibold text-slate-800">Notifikasi</span>
                        </div>
                        {[
                            { text: "Surat pengajuan baru dari Kemenkumham", time: "5 menit lalu", unread: true },
                            { text: "Surat SURAT/002 telah ditandatangani", time: "1 jam lalu", unread: true },
                            { text: "PenKom Manajerial Q3 kuota hampir penuh", time: "3 jam lalu", unread: false },
                        ].map((n, i) => (
                            <div key={i} className={`px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-start gap-3 ${n.unread ? "bg-primary-blue-light/30" : ""}`}>
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? "bg-primary-blue" : "bg-transparent"}`} />
                                <div>
                                    <p className="text-sm text-slate-700">{n.text}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                                </div>
                            </div>
                        ))}
                        <div className="px-4 py-2 border-t border-slate-100">
                            <a href="/dashboard/notifikasi" className="text-xs text-primary-blue font-medium hover:underline">Lihat semua notifikasi →</a>
                        </div>
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-200" />

            {/* User avatar & dropdown */}
            <div className="relative">
                <button
                    onClick={() => { setShowDropdown(!showDropdown); setShowNotif(false); }}
                    className="flex items-center gap-3 hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors cursor-pointer"
                >
                    <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {userName ? userName.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="hidden sm:flex flex-col items-start leading-tight">
                        <span className="text-sm font-semibold text-slate-800">{userName || "\u00A0"}</span>
                        <span className="text-[11px] text-slate-400 capitalize">{userRole ? userRole.replace(/_/g, ' ') : "\u00A0"}</span>
                    </div>
                    <svg className="text-slate-400 hidden sm:block" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </button>

                {/* User dropdown */}
                {showDropdown && (
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1">
                        <a href="/dashboard/profil" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 no-underline">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
                            Profil Saya
                        </a>
                        <a href="/dashboard/pengaturan" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 no-underline">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                            Pengaturan
                        </a>
                        <div className="border-t border-slate-100 my-1" />
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("user");
                                window.location.href = "/login";
                            }}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 no-underline w-full text-left"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                            Keluar
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
