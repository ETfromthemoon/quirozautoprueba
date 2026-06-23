import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import InnerNavbar from "@/components/InnerNavbar";
import InnerFooter from "@/components/InnerFooter";
import { fetchSoldCars } from "@/lib/wordpress";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon, ArrowRightIcon, CheckIcon } from "@/components/icons";
import type { Car } from "@/lib/cars";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Vendidos — Quiroz Automotriz",
  description:
    "Historial de vehículos vendidos. Más de 20 años conectando familias con su próximo auto.",
};

function SoldCarCard({ car }: { car: Car }) {
  return (
    <div className="glass-light rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_12px_36px_-8px_rgba(0,0,0,0.5)]">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={car.image}
          alt={`${car.brand} ${car.model} ${car.year}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
        />
        {/* VENDIDO badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-[var(--color-ink-950)]/90 backdrop-blur-sm text-white text-[9px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
            <CheckIcon className="w-2.5 h-2.5 text-[var(--color-accent-500)]" />
            VENDIDO
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-[10px] text-[var(--color-ink-500)] uppercase tracking-[0.12em] mb-1">
          {car.bodyType}
        </p>
        <h3
          className="text-white font-medium leading-tight mb-1"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {car.brand} {car.model}
        </h3>
        <p className="text-[var(--color-ink-500)] text-xs mb-3">
          {car.year} · {car.km} km · {car.fuel}
        </p>
        <p className="text-[var(--color-ink-600)] text-xs line-through">
          {car.price}
        </p>
      </div>
    </div>
  );
}

export default async function VendidosPage() {
  const soldCars = await fetchSoldCars();

  return (
    <>
      <InnerNavbar />

      <main className="bg-[var(--color-ink-950)] min-h-screen text-white">
        {/* ── Hero ── */}
        <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full opacity-[0.04] blur-[100px]"
            style={{ background: "var(--color-accent-600)" }}
            aria-hidden="true"
          />
          <div className="mx-auto max-w-7xl px-4 md:px-8 relative">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-overline text-[var(--color-ink-500)] mb-4">
                  Historial
                </p>
                <h1
                  className="text-white mb-4 font-semibold leading-tight tracking-tight"
                  style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
                >
                  Vehículos vendidos
                </h1>
                <p className="text-[var(--color-ink-400)] leading-relaxed max-w-xl">
                  Cada auto aquí representa una familia que encontró su vehículo
                  ideal. Más de 20 años de confianza, vehículo a vehículo.
                </p>
              </div>
              {soldCars.length > 0 && (
                <div className="shrink-0 glass-light rounded-2xl px-6 py-4 text-center">
                  <span
                    className="text-3xl font-semibold text-white block"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {soldCars.length}
                  </span>
                  <span className="text-[var(--color-ink-500)] text-xs">
                    vehículos vendidos
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Grid ── */}
        <section className="py-8 pb-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            {soldCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {soldCars.map((car) => (
                  <SoldCarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-ink-800)] flex items-center justify-center">
                  <CheckIcon className="w-6 h-6 text-[var(--color-ink-600)]" />
                </div>
                <div>
                  <h2 className="text-white text-xl font-medium mb-2" style={{ fontFamily: "var(--font-syne)" }}>
                    Sin vehículos vendidos aún
                  </h2>
                  <p className="text-[var(--color-ink-500)] text-sm max-w-sm">
                    Pronto verás aquí el historial de autos que han encontrado
                    su nuevo hogar.
                  </p>
                </div>
                <Link href="/" className="btn-base btn-primary !py-2.5 !px-5 gap-2">
                  <ArrowRightIcon className="w-4 h-4" />
                  Ver disponibles
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        {soldCars.length > 0 && (
          <section className="py-16 md:py-20 bg-[var(--color-ink-900)]/40">
            <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
              <h2
                className="text-white mb-4 font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
              >
                ¿Buscas tu próximo auto?
              </h2>
              <p className="text-[var(--color-ink-400)] mb-8 max-w-lg mx-auto">
                Tenemos vehículos disponibles esperándote. Contáctanos o
                revisa el catálogo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={getWhatsAppUrl("Hola, vi los vendidos y quiero conocer los disponibles.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-primary !py-3 !px-6 gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Contactar por WhatsApp
                </a>
                <Link href="/" className="btn-base btn-ghost !py-3 !px-6 gap-2">
                  Ver catálogo
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <InnerFooter />
    </>
  );
}
