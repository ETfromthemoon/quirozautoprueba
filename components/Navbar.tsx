"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import Logo from "./Logo";
import {
  WhatsAppIcon,
  PhoneIcon,
  InstagramIcon,
  YouTubeIcon,
  TikTokIcon,
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

type Props = {
  totalCars: number;
};

export default function Navbar({ totalCars }: Props) {
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

    // IntersectionObserver evita leer el layout en cada evento de scroll.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.5) {
            const sectionIndex = sections.indexOf(entry.target as HTMLElement);
            // El índice 0 es el Hero; los autos arrancan en 0 tras restar 1.
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

  // Bloquear scroll del body cuando el menú está abierto.
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
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div
            className={`flex items-center justify-between rounded-full px-4 md:px-6 py-2 md:py-2.5 transition-all duration-500 ${
              scrolled ? "glass-dark" : "bg-transparent"
            }`}
          >
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("showcase-root")?.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
              aria-label="Quiroz Redcar - Inicio"
            >
              <Logo variant="horizontal" className="h-9 md:h-10 w-auto" />
            </a>

            {/* Progress dots */}
            <div
              className={`hidden md:flex items-center gap-1.5 transition-all duration-500 ${
                scrolled ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            >
              {Array.from({ length: totalCars }).map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === activeIndex ? "active" : ""}`}
                />
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Social icons */}
              <div className="hidden md:flex items-center gap-1">
                <a
                  href="https://www.instagram.com/quirozautomotrizspa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-ink-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.youtube.com/channel/UC11dE4tkZPT358WO5RLHtcg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-ink-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <YouTubeIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.tiktok.com/@quiroz.automotriz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-ink-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                </a>
              </div>

              <a
                href={getWhatsAppUrl(
                  "Hola, me interesa conocer el catálogo de Quiroz Redcar."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base btn-primary !py-2 !px-4 md:!px-5 !text-[11px]"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-white animate-pulse-ring" />
                  <span className="relative rounded-full bg-white w-1.5 h-1.5" />
                </span>
                <span className="hidden sm:inline">Contactar</span>
                <span className="sm:hidden">Chat</span>
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

      {/* Full-screen navigation overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-500 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "var(--color-ink-950)" }}
      >
        {/* Header row */}
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

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-6 md:px-10 pt-8">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="group flex items-center justify-between py-4 border-b border-white/8 text-[var(--color-ink-200)] hover:text-white transition-colors duration-200"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-2xl md:text-3xl font-medium tracking-tight" style={{ fontFamily: "var(--font-syne)" }}>
                {link.label}
              </span>
              <span className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2.5 9.5l7-7M9.5 2.5H3.5M9.5 2.5v6" />
                </svg>
              </span>
            </Link>
          ))}
        </nav>

        {/* Bottom: social + contact */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8 pt-6 border-t border-white/8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/quirozautomotriz/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-[var(--color-ink-400)] hover:text-white hover:border-white/40 transition-all"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://m.me/quirozautomotriz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Messenger"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-[var(--color-ink-400)] hover:text-white hover:border-white/40 transition-all"
              >
                <MessengerIcon className="w-4 h-4" />
              </a>
              <a
                href="tel:+56959065441"
                aria-label="Teléfono"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-[var(--color-ink-400)] hover:text-white hover:border-white/40 transition-all"
              >
                <PhoneIcon className="w-4 h-4" />
              </a>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={getWhatsAppUrl("Hola, me interesa conocer el catálogo de Quiroz Redcar.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-primary !py-2.5 !px-5 !text-[11px] gap-2"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
