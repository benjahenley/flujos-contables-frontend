"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Download,
  Zap,
  CloudUpload,
  Receipt,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────── */
type UploadStatus =
  | "procesando"
  | "listo"
  | "error"
  | "generando"
  | "completado";

interface UploadRecord {
  id: string;
  fileName: string;
  uploadedAt: string;
  totalRows: number;
  status: UploadStatus;
  caeGenerados?: number;
  errores?: number;
  ambiente: "homologacion" | "produccion";
}

/* ── Mock data ───────────────────────────────────────────────── */
const mockHistory: UploadRecord[] = [
  {
    id: "1",
    fileName: "facturas_febrero_2026.xlsx",
    uploadedAt: "2026-02-28T14:30:00Z",
    totalRows: 48,
    status: "completado",
    caeGenerados: 48,
    errores: 0,
    ambiente: "produccion",
  },
  {
    id: "2",
    fileName: "facturas_enero_2026.xlsx",
    uploadedAt: "2026-01-31T10:15:00Z",
    totalRows: 52,
    status: "completado",
    caeGenerados: 50,
    errores: 2,
    ambiente: "produccion",
  },
  {
    id: "3",
    fileName: "prueba_diciembre.csv",
    uploadedAt: "2025-12-15T09:00:00Z",
    totalRows: 5,
    status: "completado",
    caeGenerados: 5,
    errores: 0,
    ambiente: "homologacion",
  },
];

/* ── Config maps ─────────────────────────────────────────────── */
const STATUS_CFG = {
  procesando: {
    label: "Procesando",
    color: "#f59e0b",
    bg: "rgba(245,158,11,.09)",
    border: "#fcd34d",
    Icon: Clock,
  },
  listo: {
    label: "Listo",
    color: "#27a0c9",
    bg: "rgba(39,160,201,.09)",
    border: "#7dd3fc",
    Icon: AlertCircle,
  },
  generando: {
    label: "Generando CAEs",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,.09)",
    border: "#c4b5fd",
    Icon: Clock,
  },
  completado: {
    label: "Completado",
    color: "#10b981",
    bg: "rgba(16,185,129,.09)",
    border: "#6ee7b7",
    Icon: CheckCircle2,
  },
  error: {
    label: "Error",
    color: "#ef4444",
    bg: "rgba(239,68,68,.09)",
    border: "#fca5a5",
    Icon: XCircle,
  },
} as const;

const ENV_CFG = {
  produccion: {
    label: "Producción",
    color: "#0f172a",
    bg: "rgba(15,23,42,.08)",
  },
  homologacion: {
    label: "Homologación",
    color: "#92400e",
    bg: "rgba(245,158,11,.13)",
  },
} as const;

/* ── Helpers ─────────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Page ────────────────────────────────────────────────────── */
export default function Facturacion() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [history] = useState<UploadRecord[]>(mockHistory);

  const totalCaes = history.reduce((s, r) => s + (r.caeGenerados ?? 0), 0);
  const totalFiles = history.length;
  const totalErrors = history.reduce((s, r) => s + (r.errores ?? 0), 0);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    router.push(
      `/flows/facturacion/preview?file=${encodeURIComponent(file.name)}`,
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Sora:wght@400;500;600;700&display=swap');

        .fc-condensed { font-family: 'Barlow Condensed', ui-sans-serif, system-ui, sans-serif; }
        .fc-sora      { font-family: 'Sora', ui-sans-serif, system-ui, sans-serif; }

        @keyframes fcFadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fc-anim { opacity:0; animation: fcFadeUp .5s ease forwards; }
        .fc-a1 { animation-delay:.05s; }
        .fc-a2 { animation-delay:.13s; }
        .fc-a3 { animation-delay:.21s; }
        .fc-a4 { animation-delay:.29s; }

        /* Animated dashed SVG border */
        @keyframes dashScroll {
          to { stroke-dashoffset: -28; }
        }
        .fc-dash-idle {
          stroke: #d1d5db;
          transition: stroke .25s ease;
        }
        .fc-dash-active {
          stroke: #27a0c9;
          animation: dashScroll .7s linear infinite;
        }

        /* Drop zone inner glow */
        @keyframes zonePulse {
          0%, 100% { opacity: .4; }
          50%       { opacity: .8; }
        }
        .fc-zone-glow {
          animation: zonePulse 2.8s ease infinite;
        }

        .fc-zone {
          transition: background .2s ease, transform .15s ease;
        }
        .fc-zone:hover  { background: #f8faff; }
        .fc-zone.active { background: rgba(39,160,201,.04); transform: scale(1.005); }

        /* History cards */
        .fc-row {
          transition: box-shadow .2s ease, transform .2s ease;
        }
        .fc-row:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,.07);
          transform: translateY(-1px);
        }
      `}</style>

      <div
        className="fc-sora"
        style={{ background: "#f4f7f9", minHeight: "100%" }}>
        {/* ── Header ───────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 px-6 md:px-10 pt-8 pb-6">
          <div className="fc-anim fc-a1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div
                className="fc-condensed inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2"
                style={{ background: "rgba(39,160,201,.1)", color: "#1e7a9c" }}>
                <Receipt className="h-3 w-3" />
                WSFEv1 · AFIP
              </div>
              <h1 className="fc-condensed text-4xl md:text-5xl font-black text-gray-900 leading-none">
                Facturación Electrónica
              </h1>
              <p className="fc-sora text-sm text-gray-400 mt-2">
                Subí un Excel o CSV con las facturas del mes y generá los CAEs
                automáticamente.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 py-8 space-y-8">
          {/* ── Drop zone ──────────────────────────────────── */}
          <div className="fc-anim fc-a2">
            <div
              className={`fc-zone relative rounded-2xl cursor-pointer p-12 text-center ${isDragging ? "active" : ""}`}
              style={{ background: "white", border: "none" }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}>
              {/* Animated SVG border */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ borderRadius: "1rem" }}>
                <rect
                  x="2"
                  y="2"
                  width="calc(100% - 4px)"
                  height="calc(100% - 4px)"
                  rx="14"
                  ry="14"
                  fill="none"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  className={isDragging ? "fc-dash-active" : "fc-dash-idle"}
                />
              </svg>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileInput}
              />

              <div className="flex flex-col items-center gap-5 relative">
                {/* Icon */}
                <div className="relative">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragging ? "scale-110" : ""}`}
                    style={{
                      background: isDragging
                        ? "rgba(39,160,201,.12)"
                        : "rgba(39,160,201,.07)",
                    }}>
                    <CloudUpload
                      className="w-9 h-9 transition-colors duration-300"
                      style={{ color: isDragging ? "#27a0c9" : "#93c5da" }}
                    />
                  </div>
                  {/* Glow ring when dragging */}
                  {isDragging && (
                    <div
                      className="fc-zone-glow absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ boxShadow: "0 0 0 8px rgba(39,160,201,.15)" }}
                    />
                  )}
                </div>

                {/* Text */}
                <div>
                  <p className="fc-sora text-base font-semibold text-gray-700">
                    {isDragging
                      ? "Soltá el archivo acá"
                      : "Subí tu archivo de facturas"}
                  </p>
                  <p className="fc-sora text-sm text-gray-400 mt-1">
                    Arrastrá y soltá, o{" "}
                    <span style={{ color: "#27a0c9" }} className="font-medium">
                      hacé click para seleccionar
                    </span>
                  </p>
                </div>

                {/* Format tags */}
                <div className="flex items-center gap-2">
                  {[".xlsx", ".xls", ".csv"].map((ext) => (
                    <span
                      key={ext}
                      className="fc-sora px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{
                        background: "rgba(39,160,201,.08)",
                        color: "#1e7a9c",
                      }}>
                      {ext}
                    </span>
                  ))}
                  <span className="fc-sora text-xs text-gray-400">
                    · hasta 10 MB
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── History ────────────────────────────────────── */}
          <div className="fc-anim fc-a3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="fc-condensed text-2xl font-bold text-gray-900">
                Historial de cargas
              </h2>
              <span className="fc-sora text-sm text-gray-400">
                {history.length} {history.length === 1 ? "archivo" : "archivos"}
              </span>
            </div>

            {history.length === 0 ? (
              <div
                className="rounded-2xl p-12 text-center"
                style={{ background: "white", border: "1px solid #e8ecf0" }}>
                <FileSpreadsheet
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: "#d1d5db" }}
                />
                <p className="fc-sora text-sm text-gray-400">
                  Aún no hay cargas. Subí tu primer archivo arriba.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((record, i) => (
                  <HistoryCard
                    key={record.id}
                    record={record}
                    animDelay={i * 0.06}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function StatChip({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div
      className="fc-sora flex items-baseline gap-1.5 px-4 py-2 rounded-xl"
      style={{ background: "white", border: "1px solid #e8ecf0" }}>
      <span className="fc-condensed text-2xl font-black" style={{ color }}>
        {value}
      </span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

function HistoryCard({
  record,
  animDelay,
}: {
  record: UploadRecord;
  animDelay: number;
}) {
  const st = STATUS_CFG[record.status];
  const env = ENV_CFG[record.ambiente];
  const StatusIcon = st.Icon;

  return (
    <div
      className="fc-row bg-white rounded-2xl overflow-hidden flex"
      style={{
        border: "1px solid #e8ecf0",
        boxShadow: "0 1px 3px rgba(0,0,0,.04)",
        animation: `fcFadeUp .45s ease ${animDelay + 0.3}s forwards`,
        opacity: 0,
      }}>
      {/* Left status bar */}
      <div className="w-1 flex-shrink-0" style={{ background: st.color }} />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 flex-1 min-w-0">
        {/* File info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(22,163,74,.08)" }}>
            <FileSpreadsheet className="w-4 h-4" style={{ color: "#16a34a" }} />
          </div>
          <div className="min-w-0">
            <p className="fc-sora text-sm font-semibold text-gray-800 truncate">
              {record.fileName}
            </p>
            <p className="fc-sora text-xs text-gray-400 mt-0.5">
              {formatDate(record.uploadedAt)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-center">
            <p className="fc-condensed text-lg font-bold text-gray-800 leading-none">
              {record.totalRows}
            </p>
            <p className="fc-sora text-[10px] uppercase tracking-wide text-gray-400 mt-0.5">
              filas
            </p>
          </div>

          {record.status === "completado" && (
            <>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <p
                  className="fc-condensed text-lg font-bold leading-none"
                  style={{ color: "#10b981" }}>
                  {record.caeGenerados}
                </p>
                <p className="fc-sora text-[10px] uppercase tracking-wide text-gray-400 mt-0.5">
                  CAEs
                </p>
              </div>
              {(record.errores ?? 0) > 0 && (
                <div className="text-center">
                  <p
                    className="fc-condensed text-lg font-bold leading-none"
                    style={{ color: "#ef4444" }}>
                    {record.errores}
                  </p>
                  <p className="fc-sora text-[10px] uppercase tracking-wide text-gray-400 mt-0.5">
                    errores
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Badges + actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Ambiente */}
          <span
            className="fc-sora px-2.5 py-1 rounded-lg text-xs font-semibold"
            style={{ background: env.bg, color: env.color }}>
            {env.label}
          </span>

          {/* Status */}
          <span
            className="fc-sora inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
            style={{ background: st.bg, color: st.color }}>
            <StatusIcon className="w-3 h-3" />
            {st.label}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-1">
            {record.status === "completado" && (
              <button
                title="Descargar reporte"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              title="Ver detalle"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
