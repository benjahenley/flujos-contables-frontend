"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  BookOpen,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  KeyRound,
  MoreVertical,
  RefreshCw,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────── */
interface CertData {
  id: string;
  certName: string;
  cuit: string;
  companyName: string;
  environment: "DEV" | "PROD";
  status: "ACTIVE" | "EXPIRED" | "PENDING_CERT";
  expiresAt: string | null;
  createdAt: string;
}

/* ── Config maps ─────────────────────────────────────────────── */
const STATUS = {
  ACTIVE: {
    label: "Activo",
    color: "#10b981",
    bg: "rgba(16,185,129,.09)",
    border: "rgba(16,185,129,.22)",
    Icon: CheckCircle2,
  },
  EXPIRED: {
    label: "Vencido",
    color: "#ef4444",
    bg: "rgba(239,68,68,.09)",
    border: "rgba(239,68,68,.22)",
    Icon: AlertTriangle,
  },
  PENDING_CERT: {
    label: "Pendiente",
    color: "#f59e0b",
    bg: "rgba(245,158,11,.09)",
    border: "rgba(245,158,11,.22)",
    Icon: Clock,
  },
} as const;

const ENV = {
  DEV: { label: "Homologación", color: "#27a0c9", bg: "rgba(39,160,201,.1)" },
  PROD: { label: "Producción", color: "#059669", bg: "rgba(5,150,105,.1)" },
} as const;

/* ── Page ────────────────────────────────────────────────────── */
export default function MisCertificados() {
  const router = useRouter();
  const [certs, setCerts] = useState<CertData[]>([]);

  const active = certs.filter((c) => c.status === "ACTIVE").length;
  const expired = certs.filter((c) => c.status === "EXPIRED").length;
  const pending = certs.filter((c) => c.status === "PENDING_CERT").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Sora:wght@400;500;600;700&display=swap');

        .mc-condensed { font-family: 'Barlow Condensed', ui-sans-serif, system-ui, sans-serif; }
        .mc-sora      { font-family: 'Sora', ui-sans-serif, system-ui, sans-serif; }

        @keyframes mcFadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .mc-anim { opacity:0; animation: mcFadeUp .5s ease forwards; }
        .mc-a1 { animation-delay:.05s; }
        .mc-a2 { animation-delay:.13s; }
        .mc-a3 { animation-delay:.21s; }
        .mc-a4 { animation-delay:.29s; }

        .mc-cert-card {
          transition: box-shadow .22s ease, transform .22s ease;
        }
        .mc-cert-card:hover {
          box-shadow: 0 8px 32px rgba(39,160,201,.13), 0 2px 6px rgba(0,0,0,.07);
          transform: translateY(-2px);
        }

        .mc-new-btn {
          cursor: pointer;
          transition: background .18s ease, box-shadow .18s ease, transform .18s ease;
        }
        .mc-new-btn:hover {
          background: #1e7a9c !important;
          box-shadow: 0 0 22px rgba(39,160,201,.45);
          transform: translateY(-1px);
        }

        .mc-dot-grid {
          background-image: radial-gradient(circle, rgba(255,255,255,.15) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      <div
        className="mc-sora"
        style={{ background: "#f4f7f9", minHeight: "100%" }}>
        {/* ── Dark Header ──────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1a2640 100%)",
          }}>
          <div className="mc-dot-grid absolute inset-0 pointer-events-none" />
          <div
            className="absolute pointer-events-none"
            style={{
              right: "-80px",
              top: "-80px",
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(39,160,201,.28) 0%, transparent 70%)",
            }}
          />

          <div className="relative px-6 md:px-10 pt-10 pb-8">
            {/* Top row */}
            <div className="mc-anim mc-a1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
              <div>
                <div
                  className="mc-condensed inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3"
                  style={{
                    background: "rgba(39,160,201,.18)",
                    color: "#7dd3fc",
                  }}>
                  <Shield className="h-3 w-3" />
                  Certificados AFIP
                </div>
                <h1 className="mc-condensed text-4xl md:text-5xl font-black text-white leading-none">
                  Mis Certificados
                </h1>
                <p
                  className="mc-sora text-sm mt-2"
                  style={{ color: "rgba(255,255,255,.45)" }}>
                  Gestioná tus certificados digitales para facturación
                  electrónica
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  href="/flows/mis-certificados/guia"
                  className="mc-sora inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background: "rgba(255,255,255,.08)",
                    color: "rgba(255,255,255,.7)",
                    border: "1px solid rgba(255,255,255,.1)",
                  }}>
                  <BookOpen className="h-4 w-4" />
                  Guía
                </Link>

                <button
                  onClick={() =>
                    router.push("/flows/mis-certificados/configurar")
                  }
                  className="mc-new-btn mc-sora inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{
                    background: "#27a0c9",
                    boxShadow: "0 0 20px rgba(39,160,201,.35)",
                  }}>
                  <Plus className="h-4 w-4" />
                  Nuevo certificado
                </button>
              </div>
            </div>

            {/* Stats strip — only when certs exist */}
            {certs.length > 0 && (
              <div
                className="mc-anim mc-a2 flex gap-6 mt-8 pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
                <Stat
                  count={certs.length}
                  label="Total"
                  color="rgba(255,255,255,.6)"
                />
                <Stat count={active} label="Activos" color="#10b981" />
                <Stat count={expired} label="Vencidos" color="#ef4444" />
                <Stat count={pending} label="Pendientes" color="#f59e0b" />
              </div>
            )}
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────── */}
        <div className="px-6 md:px-10 py-8">
          {certs.length === 0 ? (
            /* ── Empty state ─────────────────────────────── */
            <div className="mc-anim mc-a2 max-w-lg mx-auto mt-10 text-center">
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(39,160,201,.12), rgba(39,160,201,.04))",
                  border: "1px solid rgba(39,160,201,.15)",
                  boxShadow: "0 0 40px rgba(39,160,201,.08)",
                }}>
                <KeyRound className="h-10 w-10" style={{ color: "#27a0c9" }} />
              </div>

              <h2 className="mc-condensed text-3xl font-bold text-gray-900 mb-2">
                Sin certificados aún
              </h2>
              <p className="mc-sora text-gray-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                Configurá tu primer certificado digital para poder emitir
                facturas electrónicas a través de AFIP/ARCA.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() =>
                    router.push("/flows/mis-certificados/configurar")
                  }
                  className="mc-new-btn mc-sora w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
                  style={{
                    background: "#27a0c9",
                    boxShadow: "0 0 20px rgba(39,160,201,.3)",
                  }}>
                  Configurar primer certificado
                </button>

                <Link
                  href="/flows/mis-certificados/guia"
                  className="mc-sora w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-colors"
                  style={{
                    background: "white",
                    color: "#374151",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0,0,0,.06)",
                  }}>
                  Ver guía de configuración
                </Link>
              </div>

              <p className="mc-sora text-xs text-gray-400 mt-6 inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Necesitás habilitar WSASS en ARCA antes de comenzar
              </p>
            </div>
          ) : (
            /* ── Cert cards grid ─────────────────────────── */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {certs.map((cert, i) => (
                <CertCard key={cert.id} cert={cert} animDelay={i * 0.07} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function Stat({
  count,
  label,
  color,
}: {
  count: number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="mc-condensed text-3xl font-black" style={{ color }}>
        {count}
      </span>
      <span
        className="mc-sora text-xs"
        style={{ color: "rgba(255,255,255,.4)" }}>
        {label}
      </span>
    </div>
  );
}

function CertCard({ cert, animDelay }: { cert: CertData; animDelay: number }) {
  const status = STATUS[cert.status];
  const env = ENV[cert.environment];
  const StatusIcon = status.Icon;

  const expiryLabel = cert.expiresAt
    ? new Date(cert.expiresAt).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div
      className="mc-cert-card bg-white rounded-2xl overflow-hidden"
      style={{
        border: "1px solid #e8ecf0",
        boxShadow: "0 1px 4px rgba(0,0,0,.05)",
        animation: `mcFadeUp .5s ease ${animDelay + 0.2}s forwards`,
        opacity: 0,
      }}>
      {/* Status color bar */}
      <div className="h-1" style={{ background: status.color }} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: env.bg }}>
              <Shield className="h-5 w-5" style={{ color: env.color }} />
            </div>
            <div>
              <p className="mc-condensed text-lg font-bold text-gray-900 leading-tight">
                {cert.certName}
              </p>
              <p className="mc-sora text-xs text-gray-400 font-mono mt-0.5">
                {cert.cuit}
              </p>
            </div>
          </div>

          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Opciones">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="mc-sora inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold"
            style={{ background: env.bg, color: env.color }}>
            {env.label}
          </span>
          <span
            className="mc-sora inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
            style={{
              background: status.bg,
              color: status.color,
              border: `1px solid ${status.border}`,
            }}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </span>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="mc-sora text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">
              Vencimiento
            </p>
            <p className="mc-sora text-sm font-medium text-gray-700">
              {expiryLabel}
            </p>
          </div>

          {cert.status === "PENDING_CERT" ? (
            <Link
              href="/flows/mis-certificados/configurar"
              className="mc-sora inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "rgba(245,158,11,.1)", color: "#d97706" }}>
              <RefreshCw className="h-3 w-3" />
              Completar
            </Link>
          ) : (
            <button
              className="mc-sora inline-flex items-center gap-1 text-xs font-medium hover:gap-2 transition-all cursor-pointer"
              style={{ color: "#27a0c9" }}>
              Ver detalles
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
