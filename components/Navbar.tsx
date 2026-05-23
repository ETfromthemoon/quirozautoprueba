"use client";

import { useEffect, useState } from "react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import Logo from "./Logo";

type Props = {
  totalCars: number;
};

export default function Navbar({ totalCars }: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const container = document.getElementById("showcase-root");
    if (!container) return;

    const handleScroll = () => {
      const sections = container.querySelectorAll<HTMLElement>(".showcase-section");
      const viewportMid = window.innerHeight / 2;
      let current = -1;

      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportMid && rect.bottom > viewportMid) {
          current = i - 1;
        }
      });

      setActiveIndex(current);
      setScrolled(current >= 0);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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

          {/* Right CTA */}
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
            <span className="hidden sm:inline">CONTACTAR</span>
            <span className="sm:hidden">CHAT</span>
          </a>
        </div>
      </div>
    </header>
  );
}
