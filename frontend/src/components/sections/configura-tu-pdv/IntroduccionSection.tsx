import UnifiedBreadcrumb from "@/components/ui/UnifiedBreadcrumb";
import Image from "next/image";

interface IntroduccionSectionProps {
  onContinue: () => void;
}

export default function IntroduccionSection({
  onContinue,
}: IntroduccionSectionProps) {
  const steps = [
    {
      number: 1,
      title: "Obtener Certificado ARCA",
      description:
        "Descargar el certificado desde la página de ARCA usando tu clave fiscal nivel 3",
      icon: "1",
    },
    {
      number: 2,
      title: "Generar Key",
      description:
        "Crear el archivo key que actuará como la 'contraseña' del certificado",
      icon: "2",
    },
    {
      number: 3,
      title: "Configurar Punto de Venta",
      description: "Completar la configuración básica de tu punto de venta",
      icon: "3",
    },
    {
      number: 4,
      title: "Conectar con ARCA",
      description:
        "Establecer la conexión automática con los web services de ARCA",
      icon: "4",
    },
  ];

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Mis CUITs y PDVs", href: "/flows/mis-cuits-pdvs" },
    { label: "Configura tu PDV" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20  flex items-center justify-center mx-auto">
          <Image
            src="/logo-celeste.png"
            alt="ARCA"
            className="w-16 h-16"
            width={64}
            height={64}
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Configuración de Facturación Electrónica
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Te guiaremos paso a paso para conectar tu sistema con ARCA y
          automatizar tu facturación electrónica
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-accent-light border border-primary/20 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Introducción
        </h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Para conectar tu sistema con los web services de ARCA necesitamos un{" "}
            <strong>"certificado"</strong> y su correspondiente{" "}
            <strong>"key"</strong>. Este certificado no es ningún trámite
            especial que debamos realizar físicamente en ARCA, es simplemente un
            archivo que nos provee ARCA a través de su página.
          </p>
          <p>
            Lo único que necesitamos para obtenerlo es tener{" "}
            <strong>clave fiscal nivel 3</strong>, y la key es un archivo que
            generamos nosotros. Podemos pensar en la key como la{" "}
            <strong>"contraseña"</strong> del certificado.
          </p>
          <p>
            En algunas partes de la página de ARCA se requiere tener un
            "Computador Fiscal"; en esos casos, este certificado actúa como
            computador fiscal.
          </p>
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
          <h3 className="font-semibold text-gray-900 mb-2">
            ¿Por qué necesitamos un certificado?
          </h3>
          <p className="text-gray-700">
            Con este certificado serán firmadas digitalmente las solicitudes que
            realicemos a los web services de ARCA, confirmando que efectivamente
            somos nosotros quienes realizamos las solicitudes.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Pasos para la Automatización
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg">{step.icon}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-800 mb-3">
          Requisitos Previos
        </h3>
        <ul className="space-y-2 text-amber-700">
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
            <span>Clave fiscal ARCA nivel 3</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
            <span>Acceso a la página web de ARCA</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
            <span>CUIT registrado en ARCA</span>
          </li>
        </ul>
      </div>

      {/* Action Button */}
      <div className="text-center pt-6">
        <button
          onClick={onContinue}
          className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 shadow-soft text-lg font-medium">
          Comenzar Configuración
          <span className="ml-2">→</span>
        </button>
        <p className="text-sm text-gray-500 mt-3">
          El proceso completo toma aproximadamente 10-15 minutos
        </p>
      </div>
    </div>
  );
}
