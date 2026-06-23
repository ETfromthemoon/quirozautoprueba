"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import Logo from "./Logo";
import {
  WhatsAppIcon,
  PhoneIcon,
  InstagramIcon,
  MessengerIcon,
  MenuIcon,
  XIcon,
} from "./icons";

const NAV_LINKS = [
  { href: "/", label: "Ver disponibles" },
  { href: "/vender-consignar", label: "Vender / Consignar" },
  { href: "/financiamiento", label: "Financiamiento" },
  { href: "/seguros", label: "Seguros" },
  { href: "/reserva", label: "Reserva" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/vendidos", label: "Ver vendidos" },
];

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

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-lg text-[11px] font-medium tracking-wide uppercase transition-all duration-200 ${
                      isActive
                        ? "text-white bg-white/10"
                        : "text-[var(--color-ink-400)] hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: contact + hamburger */}
            <div className="flex items-center gap-2">
              {/* Social icons (desktop only) */}
              <div className="hidden lg:flex items-center gap-1 mr-1">
                <a
                  href="https://www.instagram.com/quirozautomotrizspa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-ink-500)] hover:text-white hover:bg-white/8 transition-all"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://m.me/quirozautomotriz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Messenger"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-ink-500)] hover:text-white hover:bg-white/8 transition-all"
                >
                  <MessengerIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="tel:+56959065441"
                  aria-label="Llamar"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-ink-500)] hover:text-white hover:bg-white/8 transition-all"
                >
                  <PhoneIcon className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={getWhatsAppUrl("Hola, me interesa conocer el catálogo de Quiroz Automotriz.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base btn-primary !py-2 !px-3.5 md:!px-4 !text-[10px] gap-1.5"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Contactar</span>
                <span className="md:hidden">WA</span>
              </a>

              {/* Hamburger (mobile + tablet) */}
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
        {/* Header row */}
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

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-6 pt-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`py-4 border-b border-white/8 text-2xl font-medium tracking-tight transition-colors duration-200 ${
                  isActive ? "text-white" : "text-[var(--color-ink-300)] hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-syne)" }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-6 border-t border-white/8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/quirozautomotrizspa/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-[var(--color-ink-400)] hover:text-white transition-all"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://m.me/quirozautomotriz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Messenger"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-[var(--color-ink-400)] hover:text-white transition-all"
              >
                <MessengerIcon className="w-4 h-4" />
              </a>
              <a
                href="tel:+56959065441"
                aria-label="Teléfono"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-[var(--color-ink-400)] hover:text-white transition-all"
              >
                <PhoneIcon className="w-4 h-4" />
              </a>
            </div>
            <a
              href={getWhatsAppUrl("Hola, me interesa conocer el catálogo de Quiroz Automotriz.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-primary !py-2.5 !px-4 !text-[11px] gap-2"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
