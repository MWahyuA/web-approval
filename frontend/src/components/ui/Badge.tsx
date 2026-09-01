import React from "react";

type BadgeVariant = "draft" | "waiting" | "signed" | "approved" | "rejected" | "info" | "success" | "warning" | "error";

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    dot?: boolean;
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    draft: "bg-slate-100 text-slate-600",
    waiting: "bg-amber-50 text-amber-700",
    signed: "bg-blue-50 text-blue-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    error: "bg-red-50 text-red-700",
};

const dotColors: Record<BadgeVariant, string> = {
    draft: "bg-slate-400",
    waiting: "bg-amber-500",
    signed: "bg-blue-500",
    approved: "bg-emerald-500",
    rejected: "bg-red-500",
    info: "bg-blue-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
};

export default function Badge({
    variant = "draft",
    children,
    dot = true,
    className = "",
}: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 rounded-full
        text-xs font-semibold leading-none whitespace-nowrap
        ${variantClasses[variant]}
        ${className}
      `}
        >
            {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
            {children}
        </span>
    );
}
