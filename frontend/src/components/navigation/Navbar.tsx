"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import Image from "next/image";
import Link from "next/link";
import { FaBuffer } from "react-icons/fa";
import { useAuth } from "../providers/AuthProvider";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiMenuFold2Fill } from "react-icons/ri";
import { RiMenuFoldFill } from "react-icons/ri";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Listen for toggle events to sync with sidebar
  useEffect(() => {
    const handleToggle = () => {
      setIsCollapsed((prev) => !prev);
    };

    window.addEventListener("toggleSidebar", handleToggle);
    return () => window.removeEventListener("toggleSidebar", handleToggle);
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <header className="w-full h-16 flex items-center justify-between bg-white border-b border-gray-100 shadow-soft">
      <div
        className={`flex items-center transition-all duration-300 overflow-hidden ${
          isCollapsed ? "w-21 justify-center" : "w-91 gap-3 px-8"
        }`}>
        <Image src="/logo-celeste.png" alt="Logo" width={32} height={32} />
        {!isCollapsed && (
          <span className="text-xl font-semibold text-black tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
            Flujos Contables
          </span>
        )}
      </div>
      <div
        className="w-20 h-full bg flex items-center justify-center cursor-pointer border-l border-r border-gray-200"
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
          // Send signal to sidebar
          window.dispatchEvent(new CustomEvent("toggleSidebar"));
        }}>
        {isCollapsed ? (
          <RiMenuFold2Fill className="text-black text-2xl h-5 w-5" />
        ) : (
          <RiMenuFoldFill className="text-black text-2xl h-5 w-5" />
        )}
      </div>
      <div
        id="wrapper"
        className={`w-full flex items-center justify-between transition-all duration-300 overflow-hidden ${
          isCollapsed ? "px-4" : "px-8"
        }`}>
        <div className="flex items-center gap-3">
          <ul
            className={`flex items-center font-bold text-sm transition-all duration-300 ${
              isCollapsed ? "gap-6" : "gap-10"
            }`}>
            <li className="whitespace-nowrap overflow-hidden">
              <Link href="/" className="block truncate">
                Inicio
              </Link>
            </li>
            <li className="whitespace-nowrap overflow-hidden">
              <Link href="/" className="block truncate">
                Ayuda
              </Link>
            </li>
            <li className="whitespace-nowrap overflow-hidden">
              <Link href="/" className="block truncate">
                Reportes
              </Link>
            </li>
            <li className="whitespace-nowrap overflow-hidden">
              <Link href="/" className="block truncate">
                Configuración
              </Link>
            </li>
            <li className="whitespace-nowrap overflow-hidden">
              <Link href="/" className="block truncate">
                Contacto
              </Link>
            </li>
          </ul>
        </div>
        {user ? (
          <div className="flex items-center gap-3 relative">
            {!isCollapsed && (
              <span className="text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                CUIT: 20-34567890-1
              </span>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-300 transition-colors">
                U
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 relative">
            <div
              className={`flex flex-row items-center transition-all duration-300 ${
                isCollapsed ? "gap-2" : "gap-3"
              }`}>
              <button
                onClick={() => router.push("/auth/sign-in")}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-brand-primary border border-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-all duration-200 ease-in-out whitespace-nowrap">
                Iniciar Sesión
              </button>
              <button
                onClick={() => router.push("/auth/sign-up")}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-tertiary hover:shadow-lg transform transition-all duration-200 ease-in-out whitespace-nowrap">
                Registrarse
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
