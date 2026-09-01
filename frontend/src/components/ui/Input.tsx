import React, { useState, forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isRequired?: boolean;
    showPasswordToggle?: boolean;
    wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
            error,
            leftIcon,
            rightIcon,
            isRequired = false,
            showPasswordToggle = false,
            type = "text",
            className = "",
            wrapperClassName = "",
            id,
            required,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        const isPassword = type === "password";
        const resolvedType = isPassword && showPassword ? "text" : type;

        return (
            <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-semibold text-slate-700"
                    >
                        {label}
                        {(isRequired || required) && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                {/* Input wrapper */}
                <div className="relative">
                    {/* Left Icon */}
                    {leftIcon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            {leftIcon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        type={resolvedType}
                        className={`
              w-full rounded-lg border bg-white
              text-sm text-slate-900 placeholder:text-slate-400
              transition-all duration-200 ease-in-out
              focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200
              ${leftIcon ? "pl-10" : "pl-4"}
              ${isPassword && showPasswordToggle || rightIcon ? "pr-10" : "pr-4"}
              py-3
              ${error
                                ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
                                : "border-slate-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                            }
              ${className}
            `}
                        aria-invalid={!!error}
                        required={required}
                        aria-describedby={
                            error
                                ? `${inputId}-error`
                                : helperText
                                    ? `${inputId}-helper`
                                    : undefined
                        }
                        {...props}
                    />

                    {/* Right Icon or Password Toggle */}
                    {isPassword && showPasswordToggle ? (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                /* Eye-off icon */
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            ) : (
                                /* Eye icon */
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    ) : (
                        rightIcon && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                {rightIcon}
                            </span>
                        )
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="text-xs font-medium text-error flex items-center gap-1"
                        role="alert"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </p>
                )}

                {/* Helper Text */}
                {helperText && !error && (
                    <p
                        id={`${inputId}-helper`}
                        className="text-xs text-slate-400"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
export default Input;
