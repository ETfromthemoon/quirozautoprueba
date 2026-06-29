"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import Logo from "./Logo";
import { WhatsAppIcon, MenuIcon, XIcon, ArrowDownIcon } from "./icons";

// ── Grupos de navegación ──────────────────────────────
const NAV_GROUPS = [
  {
    label: "Vehículos",
    links: [
      { href: "/", label: "Ver disponibles" },
      { href: "/vendidos", label: "Ver vendidos" },
    ],
  },
  {
    label: "Servicios",
    links: [
      { href: "/financiamiento", label: "Financiamiento" },
      { href: "/seguros", label: "Seguros" },
      { href: "/reserva", label: "Reserva" },
      { href: "/vender-consignar", label: "Vender / Consignar" },
    ],
  },
];

// ── Dropdown component ─────────────────────────────────
function NavDropdown({
  label,
  links,
  pathname,
}: {
  label: string;
  links: { href: string; label: string }[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const isActive = links.some((l) => pathname === l.href);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-[11px] font-medium tracking-wide uppercase transition-all duration-200 ${
          isActive
            ? "text-white bg-white/10"
            : "text-[var(--color-ink-400)] hover:text-white hover:bg-white/8"
        }`}
      >
        {label}
        <ArrowDownIcon
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-52 py-2 rounded-xl border border-white/10 bg-[var(--color-ink-900)]/95 backdrop-blur-xl shadow-2xl">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-sm transition-colors ${
                pathname === link.href
                  ? "text-white bg-white/8"
                  : "text-[var(--color-ink-300)] hover:text-white hover:bg-white/6"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Mobile nav groups (flat list with sub-sections) ─────
function MobileNavLinks({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 px-6 pt-8">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-2">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)] mb-2 px-1">
            {group.label}
          </p>
          {group.links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`py-3 px-1 text-lg font-medium tracking-tight transition-colors duration-200 block ${
                  isActive ? "text-white" : "text-[var(--color-ink-300)] hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-syne)" }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      ))}

      <div className="mb-2 mt-2">
        <Link
          href="/nosotros"
          onClick={onClose}
          className={`py-3 px-1 text-lg font-medium tracking-tight transition-colors duration-200 block border-t border-white/8 ${
            pathname === "/nosotros" ? "text-white" : "text-[var(--color-ink-300)] hover:text-white"
          }`}
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Nosotros
        </Link>
      </div>
    </nav>
  );
}

// ── Main component ─────────────────────────────────────
export default function InnerNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div
            className={`flex items-center justify-between rounded-2xl px-4 md:px-6 py-2.5 transition-all duration-300 ${
              scrolled ? "glass-dark" : "bg-[var(--color-ink-950)]/80 backdrop-blur-md"
            }`}
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0"
              aria-label="Quiroz Redcar - Inicio"
            >
              <Logo variant="horizontal" className="h-8 md:h-9 w-auto" />
            </Link>

            {/* Desktop nav: dropdowns + Nosotros */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
              {NAV_GROUPS.map((group) => (
                <NavDropdown
                  key={group.label}
                  label={group.label}
                  links={group.links}
                  pathname={pathname}
                />
              ))}
              <Link
                href="/nosotros"
                className={`px-3.5 py-2 rounded-lg text-[11px] font-medium tracking-wide uppercase transition-all duration-200 ${
                  pathname === "/nosotros"
                    ? "text-white bg-white/10"
                    : "text-[var(--color-ink-400)] hover:text-white hover:bg-white/8"
                }`}
              >
                Nosotros
              </Link>
            </nav>

            {/* Right: WhatsApp CTA + hamburger */}
            <div className="flex items-center gap-2">
              <a
                href={getWhatsAppUrl(
                  "Hola, me interesa conocer el catálogo de Quiroz Automotriz."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base btn-primary !py-2 !px-3.5 md:!px-4 !text-[10px] gap-1.5"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Contactar</span>
                <span className="md:hidden">WA</span>
              </a>

              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Abrir menú"
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-[var(--color-ink-300)] hover:text-white hover:bg-white/10 transition-all"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-400 lg:hidden ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "var(--color-ink-950)" }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <Logo variant="horizontal" className="h-9 w-auto opacity-80" />
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar menú"
            className="flex items-center justify-center w-10 h-10 rounded-full text-[var(--color-ink-300)] hover:text-white hover:bg-white/10 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <MobileNavLinks pathname={pathname} onClose={() => setIsMenuOpen(false)} />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-6 border-t border-white/8">
          <a
            href={getWhatsAppUrl(
              "Hola, me interesa conocer el catálogo de Quiroz Automotriz."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-base btn-primary w-full !py-3 !text-sm gap-2 justify-center"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
