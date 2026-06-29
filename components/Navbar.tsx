"use client";

import { useEffect, useState } from "react";
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
  scrolled,
}: {
  label: string;
  links: { href: string; label: string }[];
  pathname: string;
  scrolled: boolean;
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
          !scrolled
            ? isActive
              ? "text-white bg-white/15"
              : "text-white/70 hover:text-white hover:bg-white/12"
            : isActive
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

// ── Mobile nav ─────────────────────────────────────────
function MobileNavLinks({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 px-6 md:px-10 pt-8">
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
type Props = {
  totalCars: number;
};

export default function Navbar({ totalCars }: Props) {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const container = document.getElementById("showcase-root");
    if (!container) return;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>(".showcase-section")
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.5) {
            const sectionIndex = sections.indexOf(entry.target as HTMLElement);
            const current = sectionIndex - 1;
            setActiveIndex(current);
            setScrolled(current >= 0);
          }
        });
      },
      { root: container, threshold: [0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="mx-auto max-w-5xl px-4">
          <div
            className={`flex items-center rounded-full px-5 py-2 md:py-2.5 transition-all duration-500 border ${
              scrolled
                ? "glass-dark border-white/10"
                : "bg-transparent border-transparent"
            }`}
          >
            {/* Col 1: Logo */}
            <div className="flex-1 flex justify-start">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("showcase-root")?.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="flex items-center gap-2.5 cursor-pointer group shrink-0"
                aria-label="Quiroz Redcar - Inicio"
              >
                <Logo variant="horizontal" className="h-9 md:h-10 w-auto" />
              </a>
            </div>

            {/* Col 2: Nav centrado */}
            <div className="hidden md:flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                {NAV_GROUPS.map((group) => (
                  <NavDropdown
                    key={group.label}
                    label={group.label}
                    links={group.links}
                    pathname={pathname}
                    scrolled={scrolled}
                  />
                ))}
                <Link
                  href="/nosotros"
                  className={`px-3.5 py-2 rounded-lg text-[11px] font-medium tracking-wide uppercase transition-all duration-200 ${
                    !scrolled
                      ? pathname === "/nosotros"
                        ? "text-white bg-white/15"
                        : "text-white/70 hover:text-white hover:bg-white/12"
                      : pathname === "/nosotros"
                      ? "text-white bg-white/10"
                      : "text-[var(--color-ink-400)] hover:text-white hover:bg-white/8"
                  }`}
                >
                  Nosotros
                </Link>
              </div>
              {/* Progress bar fina */}
              {totalCars > 0 && (
                <div
                  className={`w-full max-w-[200px] transition-all duration-500 ${
                    scrolled ? "opacity-100 max-h-2" : "opacity-0 max-h-0"
                  } overflow-hidden`}
                  aria-hidden="true"
                >
                  <div className="h-0.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white/60 transition-all duration-300"
                      style={{ width: `${totalCars > 1 ? ((activeIndex + 1) / totalCars) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Col 3: CTA + hamburger */}
            <div className="flex-1 flex justify-end items-center gap-2">
              <a
                href={getWhatsAppUrl(
                  "Hola, me interesa conocer el catálogo de Quiroz Automotriz."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine relative overflow-hidden flex items-center gap-1.5 bg-gradient-to-r from-accent-600 to-accent-500 text-white !py-2 !px-4 md:!px-5 !text-[11px] font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_24px_-4px_var(--color-accent-500)] hover:-translate-y-px"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine-slow pointer-events-none" />
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-white animate-pulse-ring" />
                  <span className="relative rounded-full bg-white w-1.5 h-1.5" />
                </span>
                <span className="hidden sm:inline relative z-10">Contactar</span>
                <span className="sm:hidden relative z-10">Chat</span>
              </a>

              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Abrir menú"
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ${
                  scrolled
                    ? "text-[var(--color-ink-200)] hover:text-white hover:bg-white/10"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <MenuIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-500 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "var(--color-ink-950)" }}
      >
        <div className="flex items-center justify-between px-6 md:px-10 pt-6 pb-4">
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

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8 pt-6 border-t border-white/8">
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
