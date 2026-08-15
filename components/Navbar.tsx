"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { MenuIcon, XIcon, ArrowDownIcon } from "./icons";
import ContactWhatsAppButton from "./ContactWhatsAppButton";

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
        className={`flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide uppercase transition-all duration-200 ${
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
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
        <div className="mx-auto max-w-6xl px-4">
          <div
            className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 rounded-full px-2 py-2 sm:gap-2 sm:px-3 md:flex md:px-5 md:py-2.5 transition-all duration-500 border ${
              scrolled
                ? "glass-dark border-white/10"
                : "bg-transparent border-transparent"
            }`}
          >
            {/* Col 1: Logo */}
            <div className="min-w-0 flex justify-start md:flex-1">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("showcase-root")?.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="flex min-w-0 max-w-[7.25rem] items-center gap-2.5 cursor-pointer group shrink-0 min-[360px]:max-w-[8.75rem] sm:max-w-[10rem] md:max-w-none"
                aria-label="Quiroz Redcar - Inicio"
              >
                <Logo variant="horizontal" className="h-8 w-auto max-w-full md:h-[52px]" />
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
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide uppercase transition-all duration-200 ${
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
            <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 md:flex-1">
              <ContactWhatsAppButton
                className="btn-shine relative flex h-10 max-w-[5.25rem] shrink-0 items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-accent-600 to-accent-500 px-3 text-sm font-semibold text-white !py-0 transition-all duration-300 hover:-translate-y-px hover:shadow-[0_0_24px_-4px_var(--color-accent-500)] sm:max-w-none sm:!px-4 md:h-auto md:!px-6 md:!py-2.5"
                shine
                mobileLabel="Chat"
              />

              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Abrir menú"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold uppercase tracking-wide transition-all duration-300 md:h-11 md:w-auto md:gap-2 md:px-3.5 ${
                  scrolled
                    ? "border-white/10 text-[var(--color-ink-200)] hover:text-white hover:bg-white/10"
                    : "border-white/20 text-white bg-white/8 hover:bg-white/14"
                }`}
              >
                <span className="hidden md:inline">Menú</span>
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
          <Logo variant="horizontal" className="h-12 w-auto opacity-80" />
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar menú"
            className="flex items-center justify-center w-10 h-10 rounded-full text-[var(--color-ink-300)] hover:text-white hover:bg-white/10 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <MobileNavLinks pathname={pathname} onClose={() => setIsMenuOpen(false)} />

      </div>
    </>
  );
}
