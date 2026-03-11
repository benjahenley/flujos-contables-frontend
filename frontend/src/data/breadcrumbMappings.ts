interface BreadcrumbItem {
  url: string | null;
  title: string;
}

interface BreadcrumbMappings {
  [path: string]: BreadcrumbItem[];
}

export const breadcrumbMappings: BreadcrumbMappings = {
  "/dashboard": [{ url: "/dashboard", title: "Dashboard" }],
  "/flows/mis-certificados": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/flows/mis-certificados", title: "Mis Certificados" },
  ],
  "/flows/mis-certificados/configurar": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/flows/mis-certificados", title: "Mis Certificados" },
    { url: null, title: "Configurar CSR" },
  ],
  "/flows/mis-certificados/guia": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/flows/mis-certificados", title: "Mis Certificados" },
    { url: null, title: "Guía de Configuración" },
  ],
  "/flows/facturacion": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/flows/facturacion", title: "Facturación Electrónica" },
  ],
  "/flows/facturacion/preview": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/flows/facturacion", title: "Facturación Electrónica" },
    { url: null, title: "Revisar y Generar" },
  ],
  "/pricing": [{ url: "/pricing", title: "Precios" }],
};
