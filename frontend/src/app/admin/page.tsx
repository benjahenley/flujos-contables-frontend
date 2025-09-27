"use client";

import { RequirePermission } from "@/components/providers/AuthProvider";
import Layout from "@/components/layouts/Home";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";

export default function AdminPage() {
  return (
    <RequirePermission requireAdmin>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <Layout>
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-3">👑</span>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Panel de Administración
                  </h1>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Acceso de Super Administrador
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>
                            Esta área está restringida exclusivamente para super
                            administradores del sistema.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Gestión de Usuarios
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Administrar cuentas de usuario, permisos y
                        suscripciones.
                      </p>
                      <button className="bg-gray-700 text-white px-4 py-2 text-sm rounded">
                        Ver Usuarios
                      </button>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">
                        Configuración del Sistema
                      </h3>
                      <p className="text-sm text-blue-700 mb-3">
                        Modificar configuraciones globales y parámetros del
                        sistema.
                      </p>
                      <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded">
                        Configurar
                      </button>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-medium text-green-900 mb-2">
                        Reportes y Analytics
                      </h3>
                      <p className="text-sm text-green-700 mb-3">
                        Acceder a métricas de uso y reportes del sistema.
                      </p>
                      <button className="bg-green-600 text-white px-4 py-2 text-sm rounded">
                        Ver Reportes
                      </button>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-medium text-purple-900 mb-2">
                        AFIP Configuration
                      </h3>
                      <p className="text-sm text-purple-700 mb-3">
                        Configuraciones globales de integración con AFIP.
                      </p>
                      <button className="bg-purple-600 text-white px-4 py-2 text-sm rounded">
                        AFIP Settings
                      </button>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-medium text-orange-900 mb-2">
                        Logs del Sistema
                      </h3>
                      <p className="text-sm text-orange-700 mb-3">
                        Revisar logs de actividad y errores del sistema.
                      </p>
                      <button className="bg-orange-600 text-white px-4 py-2 text-sm rounded">
                        Ver Logs
                      </button>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-medium text-red-900 mb-2">
                        Mantenimiento
                      </h3>
                      <p className="text-sm text-red-700 mb-3">
                        Herramientas de mantenimiento y backup del sistema.
                      </p>
                      <button className="bg-red-600 text-white px-4 py-2 text-sm rounded">
                        Mantenimiento
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Layout>
        </div>
      </div>
    </RequirePermission>
  );
}
