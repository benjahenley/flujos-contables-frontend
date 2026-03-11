"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavbarPublic() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');
        .navbar-font-body { font-family: 'DM Sans', sans-serif; }
        .navbar-font-display { font-family: 'Fraunces', serif; }

        .navbar-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          transition: background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
        }
        .navbar-root.solid {
          background: rgba(255,255,255,0.97);
          box-shadow: 0 1px 0 rgba(0,0,0,0.06);
          backdrop-filter: blur(12px);
        }
        .navbar-root.transparent {
          background: rgba(4,20,35,0.25);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .nav-link-light {
          color: rgba(255,255,255,0.75);
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .nav-link-light:hover { color: #fff; }

        .nav-link-dark {
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .nav-link-dark:hover { color: #27a0c9; }

        .nav-link-active-dark {
          color: #27a0c9 !important;
        }

        .btn-ghost-light {
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          border: 1px solid rgba(255,255,255,0.22);
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .btn-ghost-light:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }

        .btn-ghost-dark {
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #27a0c9;
          border: 1px solid #27a0c9;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .btn-ghost-dark:hover {
          background: #27a0c9;
          color: #fff;
        }

        .btn-primary-nav {
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          background: #27a0c9;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .btn-primary-nav:hover {
          background: #1e7a9c;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(39,160,201,0.35);
        }

        .brand-name-light { color: #fff; }
        .brand-name-dark  { color: #0f172a; }
      `}</style>

      <header className={`navbar-root navbar-font-body ${transparent ? "transparent" : "solid"}`}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/logo-celeste.png" alt="Logo" width={30} height={30} className="drop-shadow-sm" />
            <span className={`navbar-font-display text-lg font-bold tracking-tight ${transparent ? "brand-name-light" : "brand-name-dark"}`}>
              Flujos Contables
            </span>
          </Link>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Inicio", href: "/" },
              { label: "Funcionalidades", href: "/#funcionalidades" },
              { label: "Precios", href: "/pricing" },
              { label: "Contacto", href: "/" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={transparent ? "nav-link-light" : `nav-link-dark ${pathname === href ? "nav-link-active-dark" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/auth/sign-in")}
              className={transparent ? "btn-ghost-light" : "btn-ghost-dark"}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => router.push("/auth/sign-up")}
              className="btn-primary-nav"
            >
              Registrarse
            </button>
          </div>

        </div>
      </header>

      {/* Spacer so content doesn't hide under fixed navbar (only on non-home pages) */}
      {!isHome && <div className="h-14" />}
    </>
  );
}
