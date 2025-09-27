import { MdDashboard } from "react-icons/md";

export const sidebarItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <MdDashboard />,
    requireAuth: true,
  },
  // {
  //   name: "AFIP Configuration",
  //   href: "/afip",
  //   icon: "📊",
  //   requirePremium: true,
  // },
  // {
  //   name: "Admin Panel",
  //   href: "/admin",
  //   icon: "👑",
  //   requireAdmin: true,
  // },
];
