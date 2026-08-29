import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-[13px]",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "text-white bg-gradient-primary hover:bg-gradient-primary-hover shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm",
    secondary:
        "text-primary-blue bg-white border-2 border-primary-blue hover:bg-primary-blue-light active:bg-primary-blue-light/70",
    ghost:
        "text-slate-600 bg-transparent hover:bg-slate-100 hover:text-slate-900",
    danger:
        "text-white bg-error hover:bg-red-700 shadow-sm hover:shadow-md",
    success:
        "text-white bg-success hover:bg-green-700 shadow-sm hover:shadow-md",
};

export default function Button({
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-lg
        transition-all duration-200 ease-in-out
        cursor-pointer
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            ) : (
                leftIcon
            )}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
}
