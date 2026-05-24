"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Car } from "@/lib/cars";
import { getWhatsAppUrl, formatPriceShort } from "@/lib/whatsapp";

type Props = {
  car: Car;
  index: number;
  total: number;
};

export default function CarShowcase({ car, index, total }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.intersectionRatio > 0.5;
        setIsVisible(visible);
        if (!visible) setIsExpanded(false);
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when modal is open on mobile
  useEffect(() => {
    if (isExpanded) {
      const root = document.getElementById("showcase-root");
      if (root) root.style.overflow = "hidden";
      return () => {
        if (root) root.style.overflow = "";
      };
    }
  }, [isExpanded]);

  const whatsappMsg = `Hola, me interesa el ${car.brand} ${car.model} ${car.variant ?? ""} ${car.year} (${car.price}). ¿Está disponible?`;
  const whatsappUrl = getWhatsAppUrl(whatsappMsg);
  const priceShort = formatPriceShort(car.price);

  return (
    <section
      ref={sectionRef}
      id={car.id}
      className="showcase-section relative bg-ink-950"
      aria-label={`${car.brand} ${car.model} ${car.year}`}
    >
      {/* Fullscreen image */}
      <div className="absolute inset-0">
        <Image
          src={car.image}
          alt={`${car.brand} ${car.model} ${car.variant ?? ""} ${car.year}`}
          fill
          priority={index < 2}
          className={`object-cover transition-transform duration-[3s] ease-out ${
            isVisible ? "scale-105" : "scale-100"
          }`}
          sizes="100vw"
        />
        {/* Mobile: minimal gradient only at very bottom for pill legibility */}
        <div className="absolute inset-x-0 bottom-0 h-32 md:hidden bg-gradient-to-t from-ink-950/70 to-transparent pointer-events-none" />
        {/* Desktop: subtle gradient on info side */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/10 to-transparent" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-ink-950/20 via-transparent to-ink-950/40" />
      </div>

      {/* Counter (top-right) */}
      <div
        className={`absolute top-20 right-4 md:top-24 md:right-10 z-30 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div className="glass-light rounded-full px-3 md:px-5 py-1 md:py-2 flex items-center gap-1.5 md:gap-2">
          <span className="font-display text-base md:text-2xl font-bold text-white leading-none">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-ink-500 text-[10px] md:text-xs">/</span>
          <span className="text-ink-300 text-xs md:text-sm font-light">
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Badge (top-left) */}
      {car.badge && (
        <div
          className={`absolute top-20 left-4 md:top-24 md:left-10 z-30 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          <div className="rounded-full px-2.5 md:px-4 py-1 md:py-1.5 bg-accent-600 shadow-lg shadow-accent-900/50">
            <span className="text-overline text-white text-[9px] md:text-[11px]">
              {car.badge}
            </span>
          </div>
        </div>
      )}

      {/* Brand watermark (desktop only) */}
      <div
        className={`hidden md:block absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-10 transition-all duration-1000 pointer-events-none ${
          isVisible ? "opacity-[0.07] translate-x-0" : "opacity-0 translate-x-10"
        }`}
      >
        <p className="font-display text-[15vw] md:text-[13vw] leading-none text-white whitespace-nowrap font-bold tracking-tighter">
          {car.brand}
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  DESKTOP LAYOUT — Info izquierda + Panel derecha    */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="hidden md:flex relative z-20 h-full flex-col justify-center px-10 lg:px-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-8 items-center">
          {/* Left: Car info */}
          <div className="col-span-7 lg:col-span-6">
            <p
              className={`text-overline mb-4 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <span className="h-px w-6 bg-accent-600" />
                <span className="text-accent-500">{car.tagline}</span>
              </span>
            </p>

            <div
              className={`transition-all duration-700 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="font-display text-white leading-[0.92] tracking-tighter">
                <span className="block text-3xl lg:text-4xl font-medium text-ink-200 tracking-[0.2em] uppercase">
                  {car.brand}
                </span>
                <span className="block text-7xl lg:text-8xl font-extrabold mt-2">
                  {car.model}
                </span>
              </h2>
              {car.variant && (
                <p className="mt-4 text-silver-300 text-sm md:text-base font-medium tracking-[0.15em] uppercase">
                  {car.variant}
                </p>
              )}
            </div>

            <p
              className={`mt-6 text-ink-300 text-base font-light leading-relaxed max-w-md transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {car.description}
            </p>
          </div>

          {/* Right: Desktop glass spec panel */}
          <div className="col-span-5 lg:col-span-6 flex justify-end">
            <div
              className={`glass-panel rounded-2xl p-6 md:p-7 lg:p-8 w-full max-w-md transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-95"
              }`}
            >
              <div className="border-b border-white/15 pb-5 mb-6">
                <p className="text-overline text-accent-500 mb-2">Precio</p>
                <p className="text-price text-price-panel text-white">
                  {car.price}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <Spec label="Año" value={String(car.year)} />
                <Spec label="Kilometraje" value={`${car.km} km`} />
                <Spec label="Combustible" value={car.fuel} />
                <Spec label="Transmisión" value={car.transmission} />
                {car.power && <Spec label="Potencia" value={car.power} />}
                {car.drivetrain && <Spec label="Tracción" value={car.drivetrain} />}
                <Spec label="Carrocería" value={car.bodyType} />
              </div>

              <div className="mt-7 pt-6 border-t border-white/10 flex flex-col gap-3">
                <Link
                  href={`/vehiculo/${car.id}`}
                  className="btn-base btn-primary w-full"
                >
                  <EyeIcon />
                  <span>Ver vehículo</span>
                  <ArrowRightIcon />
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-silver w-full"
                >
                  <WhatsAppIcon />
                  <span>Consultar disponibilidad</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const next = document.getElementById(
                      index + 1 < total ? "showcase-next" : "contacto"
                    );
                    next?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-ghost mx-auto"
                >
                  <span>
                    {index + 1 < total ? "Siguiente vehículo" : "Ir a contacto"}
                  </span>
                  <ArrowDownIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  MOBILE — Pill compacta abajo                        */}
      {/* ═══════════════════════════════════════════════════ */}
      <div
        className="md:hidden absolute left-0 right-0 bottom-4 z-30 px-4 transition-all duration-500 ease-out"
        style={{
          opacity: isVisible && !isExpanded ? 1 : 0,
          transform: isVisible && !isExpanded ? "translateY(0)" : "translateY(24px)",
          pointerEvents: isVisible && !isExpanded ? "auto" : "none",
        }}
      >
        <div className="glass-panel rounded-full w-full flex items-center pl-5 pr-1.5 py-1.5 gap-2">
          {/* Left: text info — click to expand modal */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex-1 min-w-0 text-left cursor-pointer"
            aria-label={`Ver detalles del ${car.brand} ${car.model}`}
          >
            <p className="text-[10px] font-medium text-ink-300 tracking-[0.2em] uppercase leading-none">
              {car.brand}
            </p>
            <p className="font-display text-base font-bold text-white tracking-tight truncate leading-tight mt-0.5">
              {car.model}
            </p>
          </button>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className="text-[9px] font-medium text-accent-500 tracking-[0.2em] uppercase leading-none">
              Precio
            </p>
            <p className="text-price text-price-chip text-white mt-0.5 leading-none">
              {priceShort}
            </p>
          </div>

          {/* Ver ficha */}
          <Link
            href={`/vehiculo/${car.id}`}
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
            aria-label={`Abrir ficha de ${car.brand} ${car.model}`}
          >
            <EyeIcon />
          </Link>

          {/* Expand modal */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-accent-500 to-accent-700 shadow-lg shadow-accent-900/50 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Expandir detalles"
          >
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  MOBILE — Modal expandido (full bottom sheet)        */}
      {/* ═══════════════════════════════════════════════════ */}
      {/* Backdrop */}
      <div
        className="md:hidden absolute inset-0 z-40 bg-ink-950/40 backdrop-blur-sm transition-opacity duration-300"
        style={{
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? "auto" : "none",
        }}
        onClick={() => setIsExpanded(false)}
        aria-hidden="true"
      />
      {/* Modal sheet */}
      <div
        className="md:hidden absolute left-0 right-0 z-50 transition-[bottom,opacity] duration-500 ease-out"
        style={{
          bottom: isExpanded ? "0" : "-100%",
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? "auto" : "none",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={`Detalles del ${car.brand} ${car.model}`}
      >
        <div className="glass-panel rounded-t-3xl px-5 pt-2 pb-6 max-h-[88vh] overflow-y-auto">
          {/* Drag handle (close) */}
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="w-full py-2 flex justify-center group cursor-pointer"
            aria-label="Cerrar detalles"
          >
            <span className="block w-12 h-1 rounded-full bg-white/40 group-hover:bg-white/70 group-active:bg-white/90 transition-colors" />
          </button>

          {/* Tagline */}
          <p className="text-overline mb-3 mt-1">
            <span className="inline-flex items-center gap-2">
              <span className="h-px w-4 bg-accent-600" />
              <span className="text-accent-500 text-[10px]">{car.tagline}</span>
            </span>
          </p>

          {/* Brand + Model */}
          <div className="mb-5">
            <p className="font-display text-xs font-medium text-ink-300 tracking-[0.2em] uppercase">
              {car.brand}
            </p>
            <h3 className="font-display text-3xl font-extrabold text-white tracking-tighter leading-[0.95] mt-0.5">
              {car.model}
            </h3>
            {car.variant && (
              <p className="text-[11px] text-silver-300 font-medium tracking-[0.1em] uppercase mt-1.5">
                {car.variant}
              </p>
            )}
          </div>

          {/* Price (full format) */}
          <div className="border-b border-white/15 pb-5 mb-5">
            <p className="text-overline text-accent-500 mb-1.5">Precio</p>
            <p className="text-price text-price-modal text-white">
              {car.price}
            </p>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <Spec label="Año" value={String(car.year)} />
            <Spec label="Kilometraje" value={`${car.km} km`} />
            <Spec label="Combustible" value={car.fuel} />
            <Spec label="Transmisión" value={car.transmission} />
            {car.power && <Spec label="Potencia" value={car.power} />}
            {car.drivetrain && <Spec label="Tracción" value={car.drivetrain} />}
            <Spec label="Carrocería" value={car.bodyType} />
          </div>

          {/* Description */}
          <p className="mt-5 text-ink-300 text-sm font-light leading-relaxed">
            {car.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5 mt-6">
            <Link
              href={`/vehiculo/${car.id}`}
              className="btn-base btn-primary w-full"
            >
              <EyeIcon />
              <span>Ver vehículo completo</span>
              <ArrowRightIcon />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-silver w-full"
            >
              <WhatsAppIcon />
              <span>Consultar disponibilidad</span>
            </a>
          </div>
        </div>
      </div>

      <div id="showcase-next" className="absolute bottom-0 left-0 w-0 h-0" />
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-overline text-ink-500 mb-1">{label}</p>
      <p className="font-display text-sm md:text-lg text-white font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
