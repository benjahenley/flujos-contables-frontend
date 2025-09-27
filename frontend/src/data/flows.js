import {
  FaCog,
  FaLink,
  FaUsers,
  FaFileInvoiceDollar,
  FaBoxOpen,
  FaGlobe,
  FaPlay,
  FaShieldAlt,
} from "react-icons/fa";

export const dashboardCards = [
  {
    title: "Configura tu",
    subtitle: "CUIT y PDV",
    description:
      "Gestiona tus CUITs y configura puntos de venta (PDV) para facturación electrónica.",
    icon: <FaCog className="text-2xl" />,
    buttonText: "GESTIONAR",
    premium: false,
    href: "/flows/mis-cuits-pdvs",
  },
  {
    title: "Conectá",
    subtitle: "ENLAZÁ CON AFIP",
    description:
      "Solicita tu certificado de seguridad para enlazar tu cuenta con AFIP.",
    icon: <FaLink className="text-2xl" />,
    buttonText: "ENLAZAR",
    premium: true,
    href: "/afip",
  },
  {
    title: "Creá o importá tus",
    subtitle: "CLIENTES",
    description: "Crea nuevos clientes o importalos desde tu sistema actual.",
    icon: <FaUsers className="text-2xl" />,
    buttonText: "CREAR",
    premium: false,
    href: "/clientes",
  },
  {
    title: "Subí tu logo",
    subtitle: "FACTURAS PDF",
    description:
      "Configura tu factura. Carga tu logo y elegí el estilo de PDF para que refleje la identidad de tu negocio.",
    icon: <FaFileInvoiceDollar className="text-2xl" />,
    buttonText: "PERSONALIZAR",
    premium: true,
    href: "/facturas/personalizar",
  },
  {
    title: "Cargá desde excel/csv tus",
    subtitle: "PRODUCTOS",
    description:
      "Importa rápidamente tu lista de precios desde un archivo excel/csv.",
    icon: <FaBoxOpen className="text-2xl" />,
    buttonText: "IMPORTAR",
    premium: false,
    href: "/productos/importar",
  },
  {
    title: "Configurá tus",
    subtitle: "MICROSITIOS",
    description:
      "Conecta a tus clientes directamente con tu negocio, creando un canal de comunicación efectivo.",
    icon: <FaGlobe className="text-2xl" />,
    buttonText: "CONFIGURAR",
    premium: true,
    href: "/micrositios",
  },
  {
    title: "Comenzá a",
    subtitle: "FACTURAR",
    description: "Si ya configuraste tu cuenta, podrás comenzar a facturar.",
    icon: <FaPlay className="text-2xl" />,
    buttonText: "NUEVA VENTA",
    premium: true,
    href: "/facturar",
  },
  {
    title: "Configurá",
    subtitle: "PROTEGE TUS CORREOS",
    description:
      "Configura una palabra de seguridad para los correos que se envían a tus clientes",
    icon: <FaShieldAlt className="text-2xl" />,
    buttonText: "CONFIGURAR",
    premium: false,
    href: "/seguridad/correos",
  },
];
