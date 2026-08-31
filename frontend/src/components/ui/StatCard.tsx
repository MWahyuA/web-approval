import React from "react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: { value: string; positive: boolean };
    accentColor?: string;
    className?: string;
}

export default function StatCard({
    label,
    value,
    icon,
    trend,
    accentColor = "from-primary-blue to-primary-pink",
    className = "",
}: StatCardProps) {
    return (
        <div
            className={`
        relative bg-white rounded-xl border border-slate-100
        p-5 flex flex-col gap-3
        shadow-sm hover:shadow-md transition-shadow duration-200
        overflow-hidden group
        ${className}
      `}
        >
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentColor} opacity-80`} />

            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-slate-500">{label}</span>
                    <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors shrink-0">
                    {icon}
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-1.5">
                    <span
                        className={`text-xs font-semibold ${trend.positive ? "text-emerald-600" : "text-red-600"
                            }`}
                    >
                        {trend.positive ? "↑" : "↓"} {trend.value}
                    </span>
                    <span className="text-xs text-slate-400">dari bulan lalu</span>
                </div>
            )}
        </div>
    );
}
