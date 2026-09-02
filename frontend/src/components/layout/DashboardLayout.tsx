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

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
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

        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarCollapsed(true);
            } else {
                const storedState = localStorage.getItem("sidebarCollapsed");
                if (storedState) {
                    setSidebarCollapsed(storedState === "true");
                }
            }
        };

        // Initial check
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleToggleSidebar = () => {
        const newState = !sidebarCollapsed;
        setSidebarCollapsed(newState);
        localStorage.setItem("sidebarCollapsed", String(newState));
    };

    if (!isMounted) {
        return <div className="min-h-screen bg-[#F8FAFC]"></div>; // Prevent SSR flash of broken layout
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Sidebar - controlled by state */}
            <Sidebar
                activePath={activePath}
                collapsed={sidebarCollapsed}
                onToggle={handleToggleSidebar}
                userRole={userRole}
            />

            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? "ml-[72px]" : "ml-[72px] lg:ml-[260px]"
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
