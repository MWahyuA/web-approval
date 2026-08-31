import React, { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";

interface DashboardLayoutProps {
    children: React.ReactNode;
    activePath?: string;
}

export default function DashboardLayout({ children, activePath = "/dashboard" }: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.name) setUserName(user.name);
                if (user.role) setUserRole(user.role);
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Sidebar - controlled by state */}
            <Sidebar
                activePath={activePath}
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                userRole={userRole}
            />

            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
                    }`}
            >
                <Header userName={userName} userRole={userRole} notificationCount={3} />

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
