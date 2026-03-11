"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  X,
  ZoomIn,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────── */
interface ZoomedImage {
  src: string;
  alt: string;
}

/* ── Page ───────────────────────────────────────────────────── */
export default function HabilitarAdministradorTesting() {
  const [zoomed, setZoomed] = useState<ZoomedImage | null>(null);

  /* ESC to close */
  useEffect(() => {
    if (!zoomed) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zoomed]);

  /* Lock body scroll while lightbox is open */
  useEffect(() => {
    document.body.style.overflow = zoomed ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [zoomed]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Sora:wght@400;500;600;700&display=swap');

        .g-condensed { font-family: 'Barlow Condensed', ui-sans-serif, system-ui, sans-serif; }
        .g-sora      { font-family: 'Sora', ui-sans-serif, system-ui, sans-serif; }

        .g-img-card {
          box-shadow: 0 2px 16px rgba(39,160,201,.10), 0 1px 3px rgba(0,0,0,.06);
          transition: box-shadow .25s ease, transform .25s ease;
          cursor: zoom-in;
        }
        .g-img-card:hover {
          box-shadow: 0 8px 36px rgba(39,160,201,.18), 0 2px 6px rgba(0,0,0,.08);
          transform: translateY(-2px);
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .g-anim { opacity:0; animation: fadeUp .55s ease forwards; }
        .g-anim-1 { animation-delay:.05s; }
        .g-anim-2 { animation-delay:.15s; }
        .g-anim-3 { animation-delay:.25s; }
        .g-anim-4 { animation-delay:.35s; }
        .g-anim-5 { animation-delay:.45s; }
        .g-anim-6 { animation-delay:.55s; }

        .g-dot-grid {
          background-image: radial-gradient(circle, #27a0c9 1px, transparent 1px);
          background-size: 22px 22px;
        }

        @keyframes lbFadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes lbScaleIn {
          from { opacity:0; transform:scale(.92); }
          to   { opacity:1; transform:scale(1); }
        }
        .lb-backdrop {
          animation: lbFadeIn .2s ease forwards;
        }
        .lb-img {
          animation: lbScaleIn .22s ease forwards;
        }
      `}</style>

      {/* ── Lightbox ─────────────────────────────────────── */}
      {zoomed && (
        <div
          className="lb-backdrop fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
          style={{
            background: "rgba(10,15,25,.88)",
            backdropFilter: "blur(6px)",
          }}
          onClick={() => setZoomed(null)}>
          {/* Close button */}
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            style={{ background: "rgba(255,255,255,.12)", color: "white" }}
            onClick={() => setZoomed(null)}
            aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>

          {/* Image */}
          <div
            className="lb-img relative max-w-[92vw] max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}>
            <img
              src={zoomed.src}
              alt={zoomed.alt}
              className="rounded-xl object-contain max-w-[92vw] max-h-[88vh] w-auto h-auto"
              style={{ boxShadow: "0 24px 80px rgba(0,0,0,.6)" }}
            />
            {/* Caption */}
            <p
              className="g-sora text-center text-xs mt-3"
              style={{ color: "rgba(255,255,255,.45)" }}>
              {zoomed.alt} ·{" "}
              <span style={{ color: "rgba(255,255,255,.3)" }}>
                ESC para cerrar
              </span>
            </p>
          </div>
        </div>
      )}

      <div>
        {/* ── Hero Header ──────────────────────────────── */}
        <header className="relative bg-white border-b border-gray-100 py-14 overflow-hidden  px-6 md:px-8">
          <div className="g-dot-grid absolute inset-0 opacity-[0.04] pointer-events-none" />
          <div
            className="absolute pointer-events-none"
            style={{
              right: "-80px",
              top: "-80px",
              width: "380px",
              height: "380px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(39,160,201,.12) 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-3xl mx-auto">
            <div
              className="g-anim g-anim-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 g-sora text-xs font-semibold tracking-wide uppercase"
              style={{ background: "rgba(39,160,201,.1)", color: "#1e7a9c" }}>
              <ShieldCheck className="h-3.5 w-3.5" />
              Certificado de Homologación · ARCA
            </div>

            <h1 className="g-anim g-anim-2 g-sora text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
              Habilitá el certificado
              <br />
              <span style={{ color: "#27a0c9" }}>de testing en ARCA</span>
            </h1>

            <p className="g-anim g-anim-3 g-sora text-gray-500 text-lg leading-relaxed max-w-xl">
              Seguí estos pasos para activar el servicio WSASS y poder gestionar
              certificados de homologación desde tu cuenta ARCA.
            </p>
          </div>
        </header>

        {/* ── Content ──────────────────────────────────── */}
        <div className="max-w-3xl mx-auto py-10 space-y-14  px-6 md:px-8">
          {/* Prerequisites */}
          <div
            className="g-anim g-anim-4 rounded-r-xl px-6 py-5 g-sora"
            style={{
              borderLeft: "4px solid #27a0c9",
              background: "rgba(39,160,201,.05)",
            }}>
            <div className="flex gap-3 items-start">
              <Info
                className="h-5 w-5 flex-shrink-0 mt-0.5"
                style={{ color: "#27a0c9" }}
              />
              <div>
                <p className="font-semibold text-gray-800 mb-2">
                  Requisitos previos
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• CUIT + Clave Fiscal activos</li>
                  <li>
                    • Nivel de seguridad habilitado para el Administrador de
                    Relaciones
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Step 1 ─────────────────────────────────── */}
          <Step
            number="01"
            title="Ingresar al Administrador de Relaciones"
            accentColor="#27a0c9"
            showConnector
            animClass="g-anim-4">
            <p className="g-sora text-gray-600 leading-relaxed mb-6">
              Ingresá a ARCA con tu CUIT y Clave Fiscal. Luego seleccioná{" "}
              <strong className="text-gray-800">
                "Administrador de Relaciones de Clave Fiscal"
              </strong>
              . Si administrás relaciones de otros contribuyentes, elegí a quién
              gestionar.
            </p>
            <StepImage
              src="/afip/arca-habilitar-testing.webp"
              alt="Administrador de Relaciones de Clave Fiscal"
              onZoom={setZoomed}
            />
          </Step>

          {/* ── Step 2 ─────────────────────────────────── */}
          <Step
            number="02"
            title="Adherir el servicio WSASS de Homologación"
            accentColor="#27a0c9"
            showConnector
            animClass="g-anim-5">
            <p className="g-sora text-gray-600 leading-relaxed mb-5">
              Dentro del Administrador de Relaciones, navegá a:
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              {[
                "ARCA",
                "Servicios interactivos",
                "WSASS - Autogestión Certificados Homologación",
              ].map((item, i, arr) => (
                <span key={i} className="flex items-center gap-2">
                  <span
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold g-sora"
                    style={{
                      background: "rgba(39,160,201,.1)",
                      color: "#1e7a9c",
                    }}>
                    {item}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="text-gray-300 font-light">›</span>
                  )}
                </span>
              ))}
            </div>

            <p className="g-sora text-gray-600 leading-relaxed mb-6">
              Este servicio te permitirá gestionar certificados de
              testing/homologación.
            </p>

            <div className="space-y-4">
              <StepImage
                src="/afip/arca-habilitar-testing-2.webp"
                alt="Adherir servicio WSASS"
                onZoom={setZoomed}
              />
              <StepImage
                src="/afip/arca-habilitar-testing-3.webp"
                alt="Seleccionar WSASS - Autogestión Certificados Homologación"
                onZoom={setZoomed}
              />
            </div>
          </Step>

          {/* ── Step 3 ─────────────────────────────────── */}
          <Step
            number="03"
            title="Confirmar acceso y verificar en el escritorio"
            accentColor="#10b981"
            showConnector={false}
            animClass="g-anim-6">
            <p className="g-sora text-gray-600 leading-relaxed mb-5">
              Revisá los datos y hacé clic en{" "}
              <strong className="text-gray-800">"Confirmar"</strong> para
              completar la adhesión. Luego volvé al buscador de servicios de
              ARCA y verificá que aparezca el servicio.
            </p>

            <div
              className="flex items-start gap-3 px-4 py-4 rounded-xl mb-6"
              style={{
                background: "rgba(16,185,129,.07)",
                border: "1px solid rgba(16,185,129,.2)",
              }}>
              <CheckCircle2
                className="h-5 w-5 flex-shrink-0 mt-0.5"
                style={{ color: "#10b981" }}
              />
              <div>
                <p
                  className="g-sora font-semibold text-sm"
                  style={{ color: "#059669" }}>
                  WSASS - Autogestión Certificados Homologación
                </p>
                <p className="g-sora text-xs text-gray-500 mt-1">
                  Si ves esta app en tu escritorio de ARCA, este paso ya está
                  completo.
                </p>
              </div>
            </div>

            <StepImage
              src="/afip/arca-habilitar-testing-4.webp"
              alt="WSASS visible en ARCA"
              onZoom={setZoomed}
            />
          </Step>

          {/* ── CTA Card ───────────────────────────────── */}
          <div
            className="g-anim g-anim-6 relative rounded-2xl overflow-hidden p-8 md:p-10"
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            }}>
            <div
              className="g-dot-grid absolute inset-0 pointer-events-none"
              style={{ opacity: 0.04 }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                right: "-60px",
                top: "-60px",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(39,160,201,.35) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: "-30px",
                bottom: "-30px",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(16,185,129,.2) 0%, transparent 70%)",
              }}
            />

            <div className="relative">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full g-sora text-xs font-medium mb-5"
                style={{
                  background: "rgba(255,255,255,.1)",
                  color: "rgba(255,255,255,.65)",
                }}>
                Siguiente paso
              </div>
              <h3 className="g-sora text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">
                Generar el CSR desde
                <br />
                Flujos Contables
              </h3>
              <p
                className="g-sora text-sm leading-relaxed mb-8 max-w-md"
                style={{ color: "rgba(255,255,255,.55)" }}>
                En la siguiente sección completás un formulario para generar el{" "}
                <strong style={{ color: "rgba(255,255,255,.8)" }}>
                  Certificate Signing Request (CSR)
                </strong>{" "}
                sin usar consola. Luego lo subís en ARCA para obtener tu
                certificado.
              </p>
              <Link
                href="/flows/mis-certificados/configurar"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl g-sora font-semibold text-sm text-white transition-all duration-200 hover:gap-4 hover:brightness-110"
                style={{
                  background: "#27a0c9",
                  boxShadow: "0 0 28px rgba(39,160,201,.45)",
                }}>
                Ir a Configurar Certificado
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

interface StepProps {
  number: string;
  title: string;
  accentColor: string;
  showConnector: boolean;
  animClass: string;
  children: React.ReactNode;
}

function Step({
  number,
  title,
  accentColor,
  showConnector,
  animClass,
  children,
}: StepProps) {
  return (
    <div className={`g-anim ${animClass} flex gap-6 md:gap-8`}>
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="g-condensed w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl font-black flex-shrink-0"
          style={{
            background: `linear-gradient(145deg, ${accentColor} 0%, ${darken(accentColor)} 100%)`,
            boxShadow: `0 4px 20px ${accentColor}44`,
          }}>
          {number}
        </div>
        {showConnector && (
          <div
            className="flex-1 w-px mt-4"
            style={{
              background: `linear-gradient(to bottom, ${accentColor}50, transparent)`,
              minHeight: "40px",
            }}
          />
        )}
      </div>

      <div className="flex-1 min-w-0 pb-2">
        <h2 className="g-sora text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-snug">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

interface StepImageProps {
  src: string;
  alt: string;
  onZoom: (img: ZoomedImage) => void;
}

function StepImage({ src, alt, onZoom }: StepImageProps) {
  return (
    <div
      className="g-img-card group relative rounded-xl overflow-hidden border border-gray-100"
      onClick={() => onZoom({ src, alt })}>
      <Image
        src={src}
        alt={alt}
        width={1400}
        height={900}
        className="w-full h-auto object-contain bg-white"
      />
      {/* Zoom hint overlay on hover */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: "rgba(39,160,201,.08)" }}>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-full g-sora text-xs font-semibold"
          style={{
            background: "rgba(15,23,42,.75)",
            color: "white",
            backdropFilter: "blur(4px)",
          }}>
          <ZoomIn className="h-3.5 w-3.5" />
          Ampliar imagen
        </div>
      </div>
    </div>
  );
}

function darken(hex: string): string {
  const map: Record<string, string> = {
    "#27a0c9": "#1e7a9c",
    "#10b981": "#059669",
  };
  return map[hex] ?? hex;
}
