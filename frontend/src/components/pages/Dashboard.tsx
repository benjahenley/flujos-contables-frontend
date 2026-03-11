"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import {
  FileKey2,
  Settings,
  Zap,
  BarChart3,
  Users,
  ArrowRight,
  Clock,
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Sora:wght@400;500;600;700&display=swap');

  .db-condensed { font-family: 'Barlow Condensed', ui-sans-serif, system-ui, sans-serif; }
  .db-sora      { font-family: 'Sora', ui-sans-serif, system-ui, sans-serif; }

  @keyframes dbFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .db-anim   { opacity: 0; animation: dbFadeUp .5s ease forwards; }
  .db-anim-1 { animation-delay: .05s; }
  .db-anim-2 { animation-delay: .13s; }
  .db-anim-3 { animation-delay: .21s; }
  .db-anim-4 { animation-delay: .29s; }
  .db-anim-5 { animation-delay: .37s; }

  .db-module-card {
    transition: box-shadow .22s ease, transform .22s ease, border-color .22s ease;
    cursor: pointer;
  }
  .db-module-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(39,160,201,.12), 0 2px 6px rgba(0,0,0,.06);
    border-color: #27a0c9 !important;
  }
  .db-module-card:hover .db-arrow {
    color: #27a0c9;
  }
`;

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const modules = [
    {
      id: "certificados",
      title: "Mis Certificados",
      description:
        "Configurá y gestioná tus certificados de homologación y producción.",
      icon: FileKey2,
      href: "/flows/mis-certificados",
      features: ["Homologación", "Producción", "Gestión automática"],
    },
    {
      id: "facturacion",
      title: "Facturación Electrónica",
      description:
        "Emitir comprobantes electrónicos de forma automática vía WSFEv1.",
      icon: Zap,
      href: "/flows/facturacion",
      features: ["Emisión automática", "Validación AFIP", "Reportes"],
    },
  ];

  const comingSoon = [
    { id: "stock", title: "Gestión de Stock", icon: BarChart3 },
    { id: "clientes", title: "Gestión de Clientes", icon: Users },
    { id: "configuracion", title: "Configuración", icon: Settings },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  if (!user) {
    return (
      <div className="db-sora p-8 text-red-600 text-sm">
        Error al cargar los datos del usuario.
      </div>
    );
  }

  return (
    <>
      <style>{STYLES}</style>

      <div className="db-sora max-w-7xl mx-auto py-8">

        {/* ── Greeting ─────────────────────────────────────────── */}
        <div className="db-anim db-anim-1 mb-10">
          <p className="db-sora text-sm text-gray-400 mb-1">{greeting()}</p>
          <h1 className="db-condensed text-5xl font-black text-gray-900 leading-none">
            {user.name || "Usuario"}
          </h1>
        </div>

        {/* ── Stats (verified customers) ───────────────────────── */}
        {user.isVerifiedCustomer && (
          <div className="db-anim db-anim-2 grid grid-cols-4 gap-4 mb-10">
            {[
              { label: "Facturas este mes", value: "0" },
              { label: "Clientes activos", value: "0" },
              { label: "Facturado", value: "$0" },
              { label: "Productos", value: "0" },
            ].map((s, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="db-condensed text-3xl font-black text-gray-900">{s.value}</p>
                <p className="db-sora text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Available modules ─────────────────────────────────── */}
        <p className="db-anim db-anim-2 db-sora text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Módulos disponibles
        </p>
        <div className="grid grid-cols-2 gap-4 mb-10">
          {modules.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => router.push(m.href)}
                className={`db-module-card db-anim db-anim-${i + 3} bg-white border border-gray-200 rounded-xl p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(39,160,201,.1)", color: "#27a0c9" }}>
                    <Icon size={20} />
                  </div>
                  <ArrowRight
                    size={16}
                    className="db-arrow text-gray-300 transition-colors mt-1"
                  />
                </div>
                <h2 className="db-condensed text-2xl font-bold text-gray-900 mb-1 leading-tight">
                  {m.title}
                </h2>
                <p className="db-sora text-sm text-gray-500 leading-relaxed mb-4">
                  {m.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {m.features.map((f, fi) => (
                    <span
                      key={fi}
                      className="db-sora text-xs font-medium px-2.5 py-1 rounded-lg"
                      style={{ background: "rgba(39,160,201,.08)", color: "#1e7a9c" }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Coming soon ───────────────────────────────────────── */}
        <p className="db-anim db-anim-4 db-sora text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Próximamente
        </p>
        <div className="db-anim db-anim-5 grid grid-cols-3 gap-4">
          {comingSoon.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="bg-white border border-gray-100 rounded-xl p-5 opacity-50">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: "rgba(100,116,139,.1)", color: "#94a3b8" }}>
                  <Icon size={17} />
                </div>
                <h3 className="db-condensed text-xl font-bold text-gray-600 mb-2">
                  {m.title}
                </h3>
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-gray-400" />
                  <span className="db-sora text-xs text-gray-400">Próximamente</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}
