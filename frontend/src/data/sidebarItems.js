import { MdDashboard } from "react-icons/md";
import { Shield, BookOpen, Zap } from "lucide-react";

export const sidebarItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <MdDashboard size={18} />,
    requireAuth: true,
  },
  {
    name: "Mis Certificados",
    href: "/flows/mis-certificados",
    icon: <Shield size={18} />,
    requireAuth: true,
  },
  {
    name: "Guía de Configuración",
    href: "/flows/mis-certificados/guia",
    icon: <BookOpen size={18} />,
    requireAuth: true,
  },
  {
    name: "Facturación",
    href: "/flows/facturacion",
    icon: <Zap size={18} />,
    requireAuth: true,
  },
];
