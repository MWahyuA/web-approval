import React, { useState, type FormEvent } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Logo from "../ui/Logo";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; root?: string }>({});

    function validate() {
        const errs: typeof errors = {};
        if (!email.trim()) errs.email = "Email wajib diisi";
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Format email tidak valid";
        if (!password) errs.password = "Password wajib diisi";
        else if (password.length < 8) errs.password = "Password minimal 8 karakter";
        return errs;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setIsLoading(true);
        setErrors({});

        try {
            const response = await fetch("http://localhost:8080/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setErrors({ root: errorText || "Gagal masuk. Periksa kembali email dan password Anda." });
                return;
            }

            const data = await response.json();

            // Simpan token dan data user ke localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect sesuai role
            if (data.user && data.user.role === "admin_puspenkom") {
                window.location.href = "/admin-puspenkom/dashboard";
            } else if (data.user && data.user.role === "admin_instansi") {
                window.location.href = "/admin-instansi/dashboard";
            } else {
                window.location.href = "/"; // Default for now
            }
        } catch (error) {
            setErrors({ root: "Gagal terhubung ke server. Pastikan server berjalan." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* ===== Left Panel — Branding ===== */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-primary">
                {/* Decorative circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
                <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5" />
                <div className="absolute top-1/3 right-16 w-64 h-64 rounded-full bg-white/5" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-3 shadow-md shrink-0">
                            <img src="/image.png" alt="Logo BKN" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-white font-bold text-2xl tracking-wide">Puspenkom BKN</span>
                    </div>

                    {/* Hero text */}
                    <div className="max-w-md">
                        <h1 className="text-white text-4xl xl:text-5xl font-bold leading-tight mb-6">
                            Penilaian Kompetensi
                            <br />
                            <span className="text-white/80">ASN Digital</span>
                        </h1>
                        <p className="text-white/70 text-lg leading-relaxed mb-8">
                            Platform pendaftaran penilaian kompetensi ASN secara online.
                            Proses lebih cepat, akurat, dan sepenuhnya paperless.
                        </p>
                    </div>

                    {/* Footer */}
                    <p className="text-white/40 text-xs">
                        © 2026 Pusat Penilaian Kompetensi — Badan Kepegawaian Negara
                    </p>
                </div>
            </div>

            {/* ===== Right Panel — Login Form ===== */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-10 flex justify-center">
                        <Logo size="lg" />
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            Selamat Datang 👋
                        </h2>
                        <p className="text-slate-500 text-sm">
                            Masuk ke akun Anda untuk mengelola pendaftaran penilaian kompetensi.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                        {errors.root && (
                            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{errors.root}</span>
                            </div>
                        )}
                        <Input
                            label="Email"
                            type="email"
                            placeholder="nama@instansi.go.id"
                            isRequired
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email || errors.root) setErrors((prev) => ({ ...prev, email: undefined, root: undefined }));
                            }}
                            error={errors.email}
                            leftIcon={
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                            }
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Masukkan password"
                            isRequired
                            showPasswordToggle
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password || errors.root) setErrors((prev) => ({ ...prev, password: undefined, root: undefined }));
                            }}
                            error={errors.password}
                            leftIcon={
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            }
                        />

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-300 text-primary-blue focus:ring-primary-blue/20 cursor-pointer accent-[#269DD8]"
                                />
                                Ingat saya
                            </label>
                            <a
                                href="/forgot-password"
                                className="text-primary-blue hover:underline font-medium"
                            >
                                Lupa password?
                            </a>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            isLoading={isLoading}
                        >
                            Masuk
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-xs text-slate-400 font-medium">INFO</span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    {/* Security notice */}
                    <div className="flex items-start gap-3 bg-white border border-slate-100 rounded-xl p-4">
                        <div className="w-8 h-8 rounded-lg bg-primary-blue-light flex items-center justify-center shrink-0 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#269DD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-700 mb-0.5">Platform Aman & Terenkripsi</p>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Data Anda dilindungi dengan enkripsi SSL. Hubungi admin IT instansi untuk akses akun.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
