"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { authService } from "@/services/auth";
import { FaCog, FaChartLine, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { dashboardCards } from "@/data/flows";

export default function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgradeToCustomer = async () => {
    try {
      setIsLoading(true);
      const result = await authService.upgradeToCustomer();
      alert(result.message);
      window.location.reload();
    } catch (error) {
      console.error("Upgrade error:", error);
      alert(
        error instanceof Error ? error.message : "Error al actualizar cuenta"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días!";
    if (hour < 18) return "¡Buenas tardes!";
    return "¡Buenas noches!";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Error al cargar los datos del usuario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary via-primary-light to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-20 py-16">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                {/* <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span> */}
                Dashboard
              </div>
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                {user.name?.split(" ")[0] || "Usuario"},{" "}
                <span className="text-accent-light block">
                  {getCurrentTimeGreeting()}
                </span>
              </h1>
              <p className="text-xl opacity-90 mb-8 max-w-2xl leading-relaxed">
                Configura y automatiza tu facturación electrónica en simples
                pasos.
              </p>
            </div>

            <div className="ml-6 hidden lg:block">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg text-white/80 hover:text-white font-medium transition-all duration-200 flex items-center gap-2 border border-white/10">
                <FaCog className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="group bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 hover:border-gray-300 h-full">
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-all duration-200">
                    <div className="text-gray-600 text-2xl">{card.icon}</div>
                  </div>
                </div>

                <div className="flex-1 mb-6">
                  <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {card.subtitle}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-auto">
                  {card.premium && !user.isVerifiedCustomer ? (
                    <button
                      onClick={handleUpgradeToCustomer}
                      disabled={isLoading}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>
                            {isLoading ? "Actualizando..." : card.buttonText}
                          </span>
                          <FaArrowRight className="text-sm" />
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={card.href}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6  transition-all duration-200 flex items-center justify-center gap-2 group/btn">
                      <span>{card.buttonText}</span>
                      <FaArrowRight className="text-sm group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        {user.isVerifiedCustomer && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <FaChartLine className="text-gray-600 text-lg" />
                </div>
                Resumen de Actividad
              </h3>
              <p className="text-gray-600 mt-2">
                Estado actual de tu sistema de facturación
              </p>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: "Facturas este mes", value: "0" },
                  { label: "Clientes activos", value: "0" },
                  { label: "Facturado este mes", value: "$0" },
                  { label: "Productos cargados", value: "0" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
