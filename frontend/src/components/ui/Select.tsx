import React, { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    helperText?: string;
    error?: string;
    isRequired?: boolean;
    children: React.ReactNode;
    wrapperClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            helperText,
            error,
            isRequired = false,
            className = "",
            wrapperClassName = "",
            id,
            children,
            required,
            ...props
        },
        ref
    ) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={selectId}
                        className="text-sm font-semibold text-slate-700"
                    >
                        {label}
                        {(isRequired || required) && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                {/* Select */}
                <div className="relative w-full h-full">
                    <select
                        ref={ref}
                        id={selectId}
                        className={`appearance-none bg-none pr-10 ${className}`}
                        aria-invalid={!!error}
                        required={required}
                        aria-describedby={
                            error
                                ? `${selectId}-error`
                                : helperText
                                    ? `${selectId}-helper`
                                    : undefined
                        }
                        {...props}
                    >
                        {children}
                    </select>
                    <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-600">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <p
                        id={`${selectId}-error`}
                        className="text-xs font-medium text-red-500 flex items-center gap-1"
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
                        id={`${selectId}-helper`}
                        className="text-xs text-slate-400"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";
export default Select;
