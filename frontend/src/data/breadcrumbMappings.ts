interface BreadcrumbItem {
  url: string | null;
  title: string;
}

interface BreadcrumbMappings {
  [path: string]: BreadcrumbItem[];
}

export const breadcrumbMappings: BreadcrumbMappings = {
  "/dashboard": [{ url: "/dashboard", title: "Dashboard" }],
  "/flows/mis-cuits-pdvs": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/flows/mis-cuits-pdvs", title: "Mis CUITs y PDVs" },
  ],
  "/flows/mis-cuits-pdvs/configurar": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/flows/mis-cuits-pdvs", title: "Mis CUITs y PDVs" },
    { url: null, title: "Configurar PDV" },
  ],
  "/flows/mis-cuits-pdvs/guia": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/flows/mis-cuits-pdvs", title: "Mis CUITs y PDVs" },
    { url: null, title: "Guía de Configuración" },
  ],
};
