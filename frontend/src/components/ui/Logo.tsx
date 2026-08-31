import React from "react";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    showText?: boolean;
    inverseText?: boolean;
    className?: string;
}

const sizeMap = {
    sm: { icon: "w-8 h-8 p-1.5", text: "text-base" },
    md: { icon: "w-11 h-11 p-2", text: "text-xl" },
    lg: { icon: "w-16 h-16 p-3", text: "text-2xl" },
};

export default function Logo({
    size = "md",
    showText = true,
    inverseText = false,
    className = "",
}: LogoProps) {
    const s = sizeMap[size];

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Logo Mark — Image */}
            <div
                className={`relative bg-white rounded-full flex items-center justify-center shadow-md shrink-0 ${s.icon}`}
            >
                <img
                    src="/image.png"
                    alt="Logo BKN"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Wordmark */}
            {showText && (
                <div className="flex flex-col leading-tight">
                    <span className={`font-bold ${inverseText ? 'text-white' : 'text-slate-900'} ${s.text} tracking-tight`}>
                        Puspenkom
                    </span>
                    <span className={`text-[10px] font-semibold tracking-[0.12em] uppercase ${inverseText ? 'text-white/80' : 'text-slate-400'}`}>
                        BKN
                    </span>
                </div>
            )}
        </div>
    );
}
