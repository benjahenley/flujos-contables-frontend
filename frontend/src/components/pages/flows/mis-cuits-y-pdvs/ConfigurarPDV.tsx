"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FlowSidebar from "@/components/sections/configura-tu-pdv/FlowSidebar";
import DatosBasicosSection from "@/components/sections/configura-tu-pdv/DatosBasicosSection";
import FacturacionArcaSection from "@/components/sections/configura-tu-pdv/FacturacionArcaSection";
import PlaceholderSection from "@/components/sections/configura-tu-pdv/PlaceholderSection";

export default function ConfigurarPDV() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("datos-basicos");
  const [formData, setFormData] = useState({
    cuit: "",
    puntoVenta: "",
    nombreRazonSocial: "",
    domicilioFiscal: "",
    condicionIva: "",
    tipoFacturacion: "productos-servicios",
    estadoPdv: {
      predeterminado: false,
      activo: true,
    },
    rubro: "",
    comentarios: "",
    afipArca: "habilitar",
  });

  // Configuration functions
  const handleFormDataChange = (newFormData: any) => {
    setFormData(newFormData);
  };

  const handleAfipArcaChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      afipArca: value,
    }));
  };

  const handleBackToList = () => {
    router.push("/flows/mis-cuits-pdvs");
  };

  const getSectionTitle = (sectionId: string) => {
    const titles: { [key: string]: string } = {
      "datos-basicos": "Datos básicos",
      "facturacion-arca": "Facturación ARCA",
      usuarios: "Usuarios",
      agentes: "Agentes de Retención/Percepción",
      "diseno-pdf": "Diseño PDF",
      "envios-email": "Envíos por e-mail",
      recordatorios: "Recordatorios de pago",
      reportes: "Reportes automáticos",
    };
    return titles[sectionId] || sectionId;
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "datos-basicos":
        return (
          <DatosBasicosSection
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );

      case "facturacion-arca":
        return (
          <FacturacionArcaSection
            afipArcaValue={formData.afipArca}
            onAfipArcaChange={handleAfipArcaChange}
          />
        );

      case "usuarios":
        return (
          <PlaceholderSection
            title="Usuarios"
            description="Aquí podrás gestionar los usuarios que tendrán acceso a este punto de venta y configurar sus permisos."
          />
        );

      case "agentes":
        return (
          <PlaceholderSection
            title="Agentes de Retención/Percepción"
            description="Configura los agentes de retención y percepción para el cumplimiento de obligaciones fiscales."
          />
        );

      case "diseno-pdf":
        return (
          <PlaceholderSection
            title="Diseño PDF"
            description="Personaliza el diseño y formato de tus comprobantes PDF con tu logo y información empresarial."
          />
        );

      case "envios-email":
        return (
          <PlaceholderSection
            title="Envíos por e-mail"
            description="Configura el envío automático de comprobantes por correo electrónico a tus clientes."
          />
        );

      case "recordatorios":
        return (
          <PlaceholderSection
            title="Recordatorios de pago"
            description="Automatiza el envío de recordatorios de pago a clientes con facturas pendientes."
          />
        );

      case "reportes":
        return (
          <PlaceholderSection
            title="Reportes automáticos"
            description="Configura la generación y envío automático de reportes de ventas y facturación."
          />
        );

      default:
        return <PlaceholderSection title={getSectionTitle(activeSection)} />;
    }
  };

  return (
    <div className="flex h-full">
      <FlowSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 p-8">
        <div className="mb-6">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors duration-200">
            ← Volver a mis PDVs
          </button>
        </div>
        {renderActiveSection()}
      </div>
    </div>
  );
}
