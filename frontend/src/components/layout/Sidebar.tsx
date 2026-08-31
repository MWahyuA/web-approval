import React, { useState } from "react";
import Logo from "../ui/Logo";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
}

interface SidebarProps {
    activePath?: string;
    collapsed?: boolean;
    onToggle?: () => void;
}

const navItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
        ),
    },
    {
        label: "Kelola Event",
        href: "/dashboard/events",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
            </svg>
        ),
    },
    {
        label: "Surat Masuk",
        href: "/dashboard/surat",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" />
            </svg>
        ),
        badge: 5,
    },
    {
        label: "Laporan",
        href: "/dashboard/laporan",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
            </svg>
        ),
    },
    {
        label: "Profil",
        href: "/dashboard/profil",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
        ),
    },
];

export default function Sidebar({ activePath = "/dashboard", collapsed = false, onToggle }: SidebarProps) {
    return (
        <aside
            className={`
        fixed top-0 left-0 z-40
        h-screen bg-gradient-primary shadow-xl
        flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-[260px]"}
      `}
        >
            {/* Logo area */}
            <div className={`h-16 flex items-center border-b border-white/10 shrink-0 ${collapsed ? "justify-center px-2" : "px-5"}`}>
                <Logo size={collapsed ? "sm" : "md"} showText={!collapsed} inverseText={true} />
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = activePath === item.href || activePath.startsWith(item.href + "/");
                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={`
                group flex items-center gap-3 rounded-lg
                transition-all duration-150 ease-in-out
                relative no-underline
                ${collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"}
                ${isActive
                                    ? "bg-white/20 text-white font-semibold shadow-inner"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                }
              `}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            {!collapsed && (
                                <span className="text-sm flex-1">{item.label}</span>
                            )}
                            {!collapsed && item.badge && (
                                <span className="bg-white text-primary-pink text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {item.badge}
                                </span>
                            )}
                            {collapsed && item.badge && (
                                <span className="absolute -top-0.5 -right-0.5 bg-white text-primary-pink text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {item.badge}
                                </span>
                            )}
                        </a>
                    );
                })}
            </nav>

            {/* Collapse toggle */}
            <div className={`p-3 border-t border-white/10 ${collapsed ? "flex justify-center" : ""}`}>
                <button
                    onClick={() => onToggle?.()}
                    className={`
            flex items-center gap-2 text-white/70 hover:text-white
            rounded-lg hover:bg-white/10 transition-colors cursor-pointer
            ${collapsed ? "p-2 justify-center" : "px-3 py-2 w-full"}
          `}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                    >
                        <path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" />
                    </svg>
                    {!collapsed && <span className="text-sm">Collapse</span>}
                </button>
            </div>
        </aside>
    );
}
