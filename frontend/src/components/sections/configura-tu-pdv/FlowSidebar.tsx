interface FlowSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function FlowSidebar({
  activeSection = "datos-basicos",
  onSectionChange,
}: FlowSidebarProps) {
  const menuItems = [
    { id: "datos-basicos", label: "Datos básicos" },
    { id: "facturacion-arca", label: "Facturación ARCA" },
    { id: "usuarios", label: "Usuarios" },
    { id: "agentes", label: "Agentes de Ret./Percep." },
    { id: "diseno-pdf", label: "Diseño PDF" },
    { id: "envios-email", label: "Envíos por e-mail" },
    { id: "recordatorios", label: "Recordatorios de pago" },
    { id: "reportes", label: "Reportes automáticos" },
  ];

  const handleSectionClick = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  return (
    <div className="w-64 bg-accent-light border-r border-gray-200 p-4">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSectionClick(item.id)}
            className={`flex items-center p-3 rounded cursor-pointer transition-colors duration-200 ${
              activeSection === item.id
                ? "bg-primary text-white border-l-4 border-primary-dark rounded-r shadow-soft"
                : "hover:bg-accent hover:text-primary-dark"
            }`}>
            <span
              className={`text-sm ${
                activeSection === item.id ? "font-medium" : "text-gray-700"
              }`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
