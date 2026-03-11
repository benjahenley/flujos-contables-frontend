"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Mail, User, Lock, CheckCircle } from "lucide-react";

type Direction = "forward" | "back";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<Direction>("forward");
  const [animKey, setAnimKey] = useState(0);

  // Form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP input: auto-advance and handle backspace
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const goTo = (nextStep: number, dir: Direction) => {
    setDirection(dir);
    setAnimKey((k) => k + 1);
    setStep(nextStep);
    setError("");
  };

  // Step 1 → Step 2: send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authService.sendOtp(email);
      goTo(2, "forward");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el código");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 → Step 3: verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("");
    if (token.length < 6) { setError("Ingresá los 6 dígitos del código"); return; }
    setIsLoading(true);
    setError("");
    try {
      await authService.verifyEmailOtp(email, token);
      goTo(3, "forward");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código incorrecto");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: complete registration
  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return; }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return; }
    setIsLoading(true);
    setError("");
    try {
      await authService.completeSignUp(name, password, email);
      goTo(4, "forward"); // success state
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  const stepLabels = ["Tus datos", "Verificá tu email", "Creá tu contraseña"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');
        .auth-font-display { font-family: 'Fraunces', serif; }
        .auth-font-body    { font-family: 'DM Sans', sans-serif; }

        .auth-bg {
          background-color: #080f16;
          background-image:
            radial-gradient(ellipse at 80% 40%, rgba(39,160,201,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 10% 80%, rgba(16,185,129,0.10) 0%, transparent 50%);
        }
        .auth-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cardUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes successPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .slide-forward { animation: slideInRight 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        .slide-back    { animation: slideInLeft  0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        .card-enter    { animation: cardUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        .success-pop   { animation: successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

        .auth-input {
          display: block;
          width: 100%;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          padding: 11px 14px;
          font-size: 0.9rem;
          color: #0f172a;
          transition: all 0.15s ease;
          outline: none;
          font-family: 'DM Sans', sans-serif;
        }
        .auth-input::placeholder { color: #94a3b8; }
        .auth-input:focus {
          background: #fff;
          border-color: #27a0c9;
          box-shadow: 0 0 0 3px rgba(39,160,201,0.12);
        }

        .otp-box {
          width: 48px;
          height: 56px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 1.4rem;
          font-weight: 700;
          text-align: center;
          color: #0f172a;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s ease;
          outline: none;
          caret-color: #27a0c9;
        }
        .otp-box:focus {
          border-color: #27a0c9;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(39,160,201,0.12);
        }
        .otp-box.filled {
          border-color: #27a0c9;
          background: #eff9fd;
          color: #27a0c9;
        }

        .auth-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 10px;
          background: #27a0c9;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .auth-btn:hover:not(:disabled) {
          background: #1e7a9c;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(39,160,201,0.35);
        }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .step-dot {
          width: 8px; height: 8px;
          border-radius: 9999px;
          transition: all 0.3s ease;
        }
        .step-dot.active  { width: 24px; background: #27a0c9; }
        .step-dot.done    { background: #10b981; }
        .step-dot.pending { background: #e2e8f0; }

        .progress-line {
          height: 2px;
          flex: 1;
          transition: background 0.4s ease;
        }
      `}</style>

      <div className="auth-bg auth-font-body min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="auth-grid absolute inset-0 pointer-events-none" />

        <div className="card-enter relative z-10 w-full max-w-md">
          <div className="bg-white rounded-2xl px-8 py-10 sm:px-10 sm:py-12"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Link href="/">
                <Image src="/logo-celeste.png" alt="Flujos Contables" width={44} height={44} className="drop-shadow-md" />
              </Link>
            </div>

            {/* Step progress — only on steps 1-3 */}
            {step <= 3 && (
              <div className="mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`step-dot ${s === step ? "active" : s < step ? "done" : "pending"}`} />
                  ))}
                </div>
                <p className="text-center text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#27a0c9" }}>
                  Paso {step} de 3 — {stepLabels[step - 1]}
                </p>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ── STEP 1: Name + Email ── */}
            {step === 1 && (
              <div key={`step-${animKey}`} className={direction === "forward" ? "slide-forward" : "slide-back"}>
                <div className="mb-6">
                  <h1 className="auth-font-display text-3xl font-bold text-gray-900 mb-1">Crear cuenta</h1>
                  <p className="text-sm" style={{ color: "#6b7280" }}>
                    Te enviamos un código a tu email para verificar tu identidad.
                  </p>
                </div>
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold" style={{ color: "#374151" }}>
                      <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Nombre</span>
                    </label>
                    <input
                      type="text" required autoComplete="name"
                      value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre completo"
                      className="auth-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold" style={{ color: "#374151" }}>
                      <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</span>
                    </label>
                    <input
                      type="email" required autoComplete="email"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="auth-input"
                    />
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={isLoading} className="auth-btn">
                      {isLoading ? "Enviando código..." : <>Enviar código <ArrowRight className="h-4 w-4" /></>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === 2 && (
              <div key={`step-${animKey}`} className={direction === "forward" ? "slide-forward" : "slide-back"}>
                <div className="mb-6">
                  <h1 className="auth-font-display text-3xl font-bold text-gray-900 mb-1">Revisá tu email</h1>
                  <p className="text-sm" style={{ color: "#6b7280" }}>
                    Enviamos un código de 6 dígitos a{" "}
                    <span className="font-semibold" style={{ color: "#374151" }}>{email}</span>
                  </p>
                </div>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* OTP boxes */}
                  <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text" inputMode="numeric" maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`otp-box ${digit ? "filled" : ""}`}
                      />
                    ))}
                  </div>
                  <button type="submit" disabled={isLoading || otp.join("").length < 6} className="auth-btn">
                    {isLoading ? "Verificando..." : <>Verificar código <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </form>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <button onClick={() => goTo(1, "back")} className="flex items-center gap-1 font-medium hover:underline"
                    style={{ color: "#6b7280" }}>
                    <ArrowLeft className="h-3.5 w-3.5" /> Cambiar email
                  </button>
                  <button
                    onClick={async () => { setError(""); await authService.sendOtp(email); }}
                    className="font-semibold hover:underline" style={{ color: "#27a0c9" }}>
                    Reenviar código
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Password ── */}
            {step === 3 && (
              <div key={`step-${animKey}`} className={direction === "forward" ? "slide-forward" : "slide-back"}>
                <div className="mb-6">
                  <h1 className="auth-font-display text-3xl font-bold text-gray-900 mb-1">Creá tu contraseña</h1>
                  <p className="text-sm" style={{ color: "#6b7280" }}>
                    Ya verificamos tu email. Elegí una contraseña segura para tu cuenta.
                  </p>
                </div>
                <form onSubmit={handleComplete} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold" style={{ color: "#374151" }}>
                      <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Contraseña</span>
                    </label>
                    <input
                      type="password" required autoComplete="new-password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="auth-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold" style={{ color: "#374151" }}>
                      <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Confirmar contraseña</span>
                    </label>
                    <input
                      type="password" required autoComplete="new-password"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repetí la contraseña"
                      className="auth-input"
                    />
                  </div>
                  {/* Password strength hint */}
                  {password.length > 0 && (
                    <div className="flex gap-1 pt-1">
                      {[1, 2, 3, 4].map((lvl) => (
                        <div key={lvl} className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            background: password.length >= lvl * 2
                              ? lvl <= 2 ? "#f59e0b" : "#10b981"
                              : "#e2e8f0"
                          }} />
                      ))}
                      <span className="ml-2 text-xs" style={{ color: "#6b7280" }}>
                        {password.length < 4 ? "Débil" : password.length < 7 ? "Regular" : "Fuerte"}
                      </span>
                    </div>
                  )}
                  <div className="pt-2">
                    <button type="submit" disabled={isLoading} className="auth-btn">
                      {isLoading ? "Creando cuenta..." : <>Crear cuenta <ArrowRight className="h-4 w-4" /></>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── STEP 4: Success ── */}
            {step === 4 && (
              <div className="slide-forward text-center py-4">
                <div className="flex justify-center mb-5">
                  <div className="success-pop h-20 w-20 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h2 className="auth-font-display text-3xl font-bold text-gray-900 mb-2">¡Bienvenido!</h2>
                <p className="text-sm mb-1" style={{ color: "#6b7280" }}>
                  Tu cuenta fue creada exitosamente.
                </p>
                <p className="text-xs" style={{ color: "#94a3b8" }}>Redirigiendo al dashboard...</p>
              </div>
            )}

            {/* Footer link — only steps 1-3 */}
            {step <= 3 && (
              <div className="mt-6 text-center">
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  ¿Ya tenés cuenta?{" "}
                  <button onClick={() => router.push("/auth/sign-in")}
                    className="font-semibold underline underline-offset-4 hover:no-underline"
                    style={{ color: "#27a0c9" }}>
                    Iniciá sesión acá
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Back to home */}
          <div className="mt-5 text-center">
            <Link href="/" className="text-sm hover:underline transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}>
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
