interface FacturacionArcaSectionProps {
  afipArcaValue: string;
  onAfipArcaChange: (value: string) => void;
}

export default function FacturacionArcaSection({
  afipArcaValue,
  onAfipArcaChange,
}: FacturacionArcaSectionProps) {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving AFIP/ARCA configuration:", afipArcaValue);
    // TODO: Implement save logic
  };

  const handleCancel = () => {
    console.log("Cancelling AFIP/ARCA configuration");
    // TODO: Implement cancel logic
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Habilitá la Facturación electrónica ARCA.
      </h1>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ¿Cómo funciona la facturación electrónica?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Al momento de emitir un comprobante de venta, éste será validado
              en línea contra el servidor de la AFIP/ARCA, el cual generará el
              CAE correspondiente (Código de Autorización electrónica), quedando
              el comprobante registrado en su facturación AFIP/ARCA que podrá
              consultar desde el servicio: Mis comprobantes, que dicho organismo
              posee en su sitio web.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              Los comprobantes emitidos que hayan impactado en AFIP/ARCA, no
              podrán ser eliminados ni modificados, ya que AFIP/ARCA no permite
              dicha operación.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              Ten en cuenta que TusFacturasAPP utiliza únicamente el método de
              facturación AFIP/ARCA, mediante el WEBSERVICE WSFEv1 - factura sin
              detalle. No incluye almacenamiento de duplicados de comprobantes
              electrónicos.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ¿Cómo se realiza el enlace con AFIP/ARCA?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Al guardar tu punto de venta, te enviaremos a tu casilla de correo
              un e-mail con un instructivo que deberás realizar paso a paso en
              la web de AFIP/ARCA, junto con un certificado de seguridad
              (archivo de texto) que deberás cargar tal cual te lo enviamos en
              la web de AFIP/ARCA.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              El proceso para enlazar nuestra plataforma con AFIP/ARCA, se rige
              bajo las normas de seguridad impuestas por AFIP/ARCA. Se realiza
              100% online y puede llevarte alrededor de 10 minutos.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Te gustaría habilitar la facturación electrónica AFIP/ARCA?
            </h3>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="afipArca"
                  value="habilitar"
                  checked={afipArcaValue === "habilitar"}
                  onChange={(e) => onAfipArcaChange(e.target.value)}
                  className="mr-3 text-primary focus:ring-primary"
                />
                <span className="text-success font-medium">✓</span>
                <span className="ml-2">
                  Sí, habilitar la facturación electrónica con AFIP/ARCA
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="afipArca"
                  value="no-habilitar"
                  checked={afipArcaValue === "no-habilitar"}
                  onChange={(e) => onAfipArcaChange(e.target.value)}
                  className="mr-3 text-primary focus:ring-primary"
                />
                <span>No habilitar</span>
              </label>
            </div>
          </div>
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
