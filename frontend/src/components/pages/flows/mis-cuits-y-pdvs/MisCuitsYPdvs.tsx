"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PdvData {
  id: string;
  cuit: string;
  puntoVenta: string;
  nombreRazonSocial: string;
  condicionIva: string;
  activo: boolean;
  fechaCreacion: string;
}

export default function MisCuitsYPdvs() {
  const router = useRouter();

  // Mock data - replace with actual data from API
  const [pdvs, setPdvs] = useState<PdvData[]>([
    // Empty array for now - will show empty state
  ]);

  const handleAddNewPdv = () => {
    router.push("/flows/mis-cuits-pdvs/configurar");
  };

  const handleEditPdv = (pdvId: string) => {
    // TODO: Load PDV data for editing
    router.push(`/flows/mis-cuits-pdvs/configurar?edit=${pdvId}`);
  };

  const handleDeletePdv = (pdvId: string) => {
    // TODO: Implement delete logic
    console.log("Delete PDV:", pdvId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mis CUITs y Puntos de Venta
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus CUITs y configura puntos de venta para facturación
            electrónica
          </p>
        </div>
        <button
          onClick={() => router.push("/flows/mis-cuits-pdvs/guia")}
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 shadow-soft font-medium">
          Guía de Configuración
        </button>
      </div>

      {/* Content */}
      {pdvs.length === 0 ? (
        // Empty State
        <div className="bg-white rounded-xl border border-gray-200 p-12">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay datos aún
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Comienza agregando tu primer CUIT y configurando un punto de
                venta para habilitar la facturación electrónica.
              </p>
              <button
                onClick={handleAddNewPdv}
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 shadow-soft font-medium">
                <span className="mr-2">+</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // PDVs List
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total PDVs
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pdvs.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    PDVs Activos
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pdvs.filter((pdv) => pdv.activo).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    CUITs Únicos
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(pdvs.map((pdv) => pdv.cuit)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PDVs Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Puntos de Venta Configurados
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CUIT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PDV
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Razón Social
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Condición IVA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pdvs.map((pdv) => (
                    <tr key={pdv.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pdv.cuit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pdv.puntoVenta}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pdv.nombreRazonSocial}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pdv.condicionIva}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            pdv.activo
                              ? "bg-success/10 text-success"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                          {pdv.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditPdv(pdv.id)}
                          className="text-primary hover:text-primary-dark">
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeletePdv(pdv.id)}
                          className="text-red-600 hover:text-red-900">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
