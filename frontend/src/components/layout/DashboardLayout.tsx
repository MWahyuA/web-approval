import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";

interface DashboardLayoutProps {
    children: React.ReactNode;
    activePath?: string;
}

export default function DashboardLayout({ children, activePath = "/dashboard" }: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Sidebar - controlled by state */}
            <Sidebar
                activePath={activePath}
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
                    }`}
            >
                <Header userName="Dr. Handoyo" userRole="Admin Puspenkom" notificationCount={3} />

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
