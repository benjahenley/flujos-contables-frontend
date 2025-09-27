import { useState } from "react";

interface FormData {
  cuit: string;
  puntoVenta: string;
  nombreRazonSocial: string;
  domicilioFiscal: string;
  condicionIva: string;
  tipoFacturacion: string;
  estadoPdv: {
    predeterminado: boolean;
    activo: boolean;
  };
  rubro: string;
  comentarios: string;
}

interface DatosBasicosSectionProps {
  formData: FormData;
  onFormDataChange: (formData: FormData) => void;
}

export default function DatosBasicosSection({
  formData,
  onFormDataChange,
}: DatosBasicosSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  const handleEstadoChange = (field: string, checked: boolean) => {
    onFormDataChange({
      ...formData,
      estadoPdv: {
        ...formData.estadoPdv,
        [field]: checked,
      },
    });
  };

  const obtenerDatosArca = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving basic data:", formData);
    // TODO: Implement save logic
  };

  const handleCancel = () => {
    console.log("Cancelling form");
    // TODO: Implement cancel logic
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Datos básicos del punto de venta
      </h1>

      <form onSubmit={handleSave} className="space-y-8">
        {/* CUIT Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CUIT <span className="text-error">*</span>
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ej: 27040000123"
                value={formData.cuit}
                onChange={(e) => handleInputChange("cuit", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={obtenerDatosArca}
                disabled={isLoading}
                className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-deep disabled:opacity-50 flex items-center gap-2 transition-colors duration-200 shadow-soft">
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                Obtener datos desde ARCA
              </button>
            </div>
          </div>
        </div>

        {/* Point of Sale Number and Business Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nro. de Punto de venta <span className="text-error">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Si facturaras desde ARCA: Creá uno nuevo. Si usabas otra
              plataforma web, el anterior puede servir, ¡pero siempre es
              preferible uno nuevo!
            </p>
            <input
              type="text"
              placeholder="Ej: 2"
              value={formData.puntoVenta}
              onChange={(e) => handleInputChange("puntoVenta", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu Nombre real o Razón social{" "}
              <span className="text-error">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Si el punto de venta es de una empresa, ingresá la razón social.
              Si es de una persona, ingresá tu nombre y apellido.
            </p>
            <input
              type="text"
              placeholder="Ej: Facebook Inc."
              value={formData.nombreRazonSocial}
              onChange={(e) =>
                handleInputChange("nombreRazonSocial", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Tax Address and VAT Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domicilio fiscal <span className="text-error">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Dirección, calle, numero y localidad ℹ️
            </p>
            <input
              type="text"
              placeholder="Ej: Campana 889, castelar."
              value={formData.domicilioFiscal}
              onChange={(e) =>
                handleInputChange("domicilioFiscal", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condición frente al IVA ℹ️ <span className="text-error">*</span>
            </label>
            <select
              value={formData.condicionIva}
              onChange={(e) =>
                handleInputChange("condicionIva", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">Seleccione</option>
              <option value="responsable-inscripto">
                Responsable Inscripto
              </option>
              <option value="monotributo">Monotributo</option>
              <option value="exento">Exento</option>
              <option value="no-responsable">No Responsable</option>
            </select>
          </div>
        </div>

        {/* Billing Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            ¿Qué factura éste punto de venta? ℹ️
          </label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tipoFacturacion"
                value="servicios"
                checked={formData.tipoFacturacion === "servicios"}
                onChange={(e) =>
                  handleInputChange("tipoFacturacion", e.target.value)
                }
                className="mr-2 text-primary focus:ring-primary"
              />
              Servicios
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tipoFacturacion"
                value="productos"
                checked={formData.tipoFacturacion === "productos"}
                onChange={(e) =>
                  handleInputChange("tipoFacturacion", e.target.value)
                }
                className="mr-2 text-primary focus:ring-primary"
              />
              Productos
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tipoFacturacion"
                value="productos-servicios"
                checked={formData.tipoFacturacion === "productos-servicios"}
                onChange={(e) =>
                  handleInputChange("tipoFacturacion", e.target.value)
                }
                className="mr-2 text-primary focus:ring-primary"
              />
              <span className="text-success font-medium">✓</span> Productos y
              servicios
            </label>
          </div>
        </div>

        {/* PDV Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              ¿En qué estado se encuentra el punto de venta?
            </label>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.estadoPdv.predeterminado}
                  onChange={(e) =>
                    handleEstadoChange("predeterminado", e.target.checked)
                  }
                  className="mr-3 text-primary focus:ring-primary rounded"
                />
                <span>Configurar como Predeterminado ℹ️</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.estadoPdv.activo}
                  onChange={(e) =>
                    handleEstadoChange("activo", e.target.checked)
                  }
                  className="mr-3 text-primary focus:ring-primary rounded"
                />
                <span className="text-success font-medium">✓</span> Sí, se
                encuentra activo ℹ️
              </label>
            </div>
          </div>
        </div>

        {/* Business Sector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Queremos conocerte mejor: ¿En qué rubro te encontrás?{" "}
            <span className="text-error">*</span>
          </label>
          <select
            value={formData.rubro}
            onChange={(e) => handleInputChange("rubro", e.target.value)}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
            <option value="">Indicá en que rubro se encuentra este PDV</option>
            <option value="comercio">Comercio</option>
            <option value="servicios">Servicios</option>
            <option value="gastronomia">Gastronomía</option>
            <option value="tecnologia">Tecnología</option>
            <option value="salud">Salud</option>
            <option value="educacion">Educación</option>
            <option value="construccion">Construcción</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* Internal Comments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentarios internos
          </label>
          <textarea
            placeholder="Ej: Usamos este punto de venta para la sucursal C003."
            value={formData.comentarios}
            onChange={(e) => handleInputChange("comentarios", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 shadow-soft">
            Guardar configuración
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
