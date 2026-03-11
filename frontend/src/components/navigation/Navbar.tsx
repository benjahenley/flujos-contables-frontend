"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import Image from "next/image";
import { useAuth } from "../providers/AuthProvider";
import { PanelLeft, PanelLeftClose, LogOut, ChevronDown, ShieldCheck, Hash } from "lucide-react";

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleToggle = () => setIsCollapsed((prev) => !prev);
    window.addEventListener("toggleSidebar", handleToggle);
    return () => window.removeEventListener("toggleSidebar", handleToggle);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      router.push("/auth/sign-in");
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggleSidebar"));
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Sora:wght@400;500;600&display=swap');
        .nb-brand { font-family: 'Fraunces', serif; font-weight: 700; }
        .nb-sora  { font-family: 'Sora', ui-sans-serif, system-ui, sans-serif; }

        @keyframes nbMenuIn {
          from { opacity: 0; transform: translateY(-6px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .nb-menu { animation: nbMenuIn .15s ease forwards; }
      `}</style>

      <header className="w-full h-14 flex items-center bg-white border-b border-gray-100 flex-shrink-0 z-40">

        {/* Logo zone — mirrors sidebar width */}
        <div
          className={`flex items-center flex-shrink-0 h-full border-r border-gray-100 transition-all duration-300 ${
            isCollapsed ? "w-16 justify-center" : "w-56 px-5 gap-2.5"
          }`}>
          <Image
            src="/logo-celeste.png"
            alt="Logo"
            width={24}
            height={24}
            className="flex-shrink-0"
          />
          {!isCollapsed && (
            <span className="nb-brand text-[0.975rem] text-gray-900 tracking-tight whitespace-nowrap">
              Flujos Contables
            </span>
          )}
        </div>

        {/* Sidebar toggle — subtle icon, no border box */}
        <button
          onClick={toggleSidebar}
          title={isCollapsed ? "Expandir panel" : "Colapsar panel"}
          className="ml-3 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0">
          {isCollapsed ? (
            <PanelLeft size={16} />
          ) : (
            <PanelLeftClose size={16} />
          )}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: user controls */}
        <div className="flex items-center px-5">
          {user ? (
            <div className="relative" ref={menuRef}>

              {/* Trigger button */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="nb-sora flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
                  style={{ background: "rgba(39,160,201,.12)", color: "#27a0c9" }}>
                  {initials}
                </div>
                <span className="text-sm text-gray-700 hidden sm:block max-w-[120px] truncate">
                  {user.name || "Usuario"}
                </span>
                <ChevronDown
                  size={13}
                  className={`text-gray-400 transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="nb-menu nb-sora absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-black/[0.07] overflow-hidden z-50">

                  {/* User header */}
                  <div className="px-4 pt-4 pb-3.5 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                        style={{ background: "rgba(39,160,201,.12)", color: "#27a0c9" }}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate leading-snug">
                          {user.name || "Usuario"}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {user.email || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Data rows */}
                  <div className="px-4 py-3 space-y-3 border-b border-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Hash size={11} />
                        <span className="text-[10px] uppercase tracking-wider">CUIT</span>
                      </div>
                      <span className="text-xs font-mono text-gray-600">
                        20-34567890-1
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <ShieldCheck size={11} />
                        <span className="text-[10px] uppercase tracking-wider">Estado</span>
                      </div>
                      {user.isVerifiedCustomer ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold"
                          style={{ color: "#10b981" }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          Verificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                          En revisión
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="py-1.5">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                      <LogOut size={13} className="text-gray-400" />
                      Cerrar sesión
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/auth/sign-in")}
                className="px-4 py-1.5 text-sm font-medium text-[#27a0c9] border border-[#27a0c9] rounded-lg hover:bg-[#27a0c9] hover:text-white transition-all">
                Iniciar sesión
              </button>
              <button
                onClick={() => router.push("/auth/sign-up")}
                className="px-4 py-1.5 text-sm font-medium text-white bg-[#27a0c9] rounded-lg hover:bg-[#1e7a9c] transition-all">
                Registrarse
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
