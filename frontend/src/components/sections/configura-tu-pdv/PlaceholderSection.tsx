interface PlaceholderSectionProps {
  title: string;
  description?: string;
}

export default function PlaceholderSection({
  title,
  description,
}: PlaceholderSectionProps) {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Saving ${title} configuration`);
    // TODO: Implement save logic
  };

  const handleCancel = () => {
    console.log(`Cancelling ${title} configuration`);
    // TODO: Implement cancel logic
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

      <div className="bg-accent-light border border-primary/20 rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl text-primary">🚧</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Sección en desarrollo
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {description ||
              "Esta funcionalidad estará disponible próximamente. Mientras tanto, puedes continuar configurando las otras secciones."}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled
          className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
          Guardar configuración
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200">
          Volver
        </button>
      </div>
    </div>
  );
}
