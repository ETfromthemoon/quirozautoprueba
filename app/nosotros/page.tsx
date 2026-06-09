import type { Metadata } from "next";
import Link from "next/link";
import InnerNavbar from "@/components/InnerNavbar";
import InnerFooter from "@/components/InnerFooter";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon, CheckIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Nosotros — Quiroz Redcar",
  description:
    "Conoce la historia de Quiroz Redcar, automotora en Concón y Valparaíso. Más de 20 años ayudando a familias a encontrar su vehículo ideal.",
};

const VALUES = [
  {
    title: "Transparencia",
    description:
      "Cada vehículo se muestra tal como es — sin precio inflado, sin letra chica. Preguntas incómodas son bienvenidas.",
  },
  {
    title: "Cercanía",
    description:
      "No somos un megashow. Somos una familia que atiende como familia. El trato es directo, sin intermediarios.",
  },
  {
    title: "Confianza",
    description:
      "Más de veinte años de clientes que vuelven y recomiendan. Ese historial no se compra — se construye día a día.",
  },
  {
    title: "Calidad",
    description:
      "Cada auto que recibimos pasa por una revisión completa. Si no cumpliría con nuestros estándares, no está en catálogo.",
  },
];

const STATS = [
  { value: "+20", label: "años en el mercado" },
  { value: "+500", label: "vehículos vendidos" },
  { value: "100%", label: "recomendados" },
  { value: "1", label: "sucursal familiar" },
];

export default function NosotrosPage() {
  return (
    <>
      <InnerNavbar />

      <main className="bg-[var(--color-ink-950)] min-h-screen text-white">
        {/* ── Hero ── */}
        <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
          {/* Background accent */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full opacity-[0.06] blur-[120px]"
            style={{ background: "var(--color-accent-600)" }}
            aria-hidden="true"
          />

          <div className="mx-auto max-w-7xl px-4 md:px-8 relative">
            <div className="max-w-3xl">
              <p className="text-overline text-[var(--color-accent-500)] mb-4">
                Nuestra historia
              </p>
              <h1
                className="text-white mb-6 font-semibold leading-tight tracking-tight"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
              >
                Quiroz Redcar
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-ink-300)] leading-relaxed max-w-2xl">
                Automotora con presencia en Concón y Valparaíso. Desde 2004
                conectamos a personas y familias con su próximo vehículo —
                siempre con honestidad, atención directa y precios justos.
              </p>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="border-y border-white/8">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center py-10 gap-2 ${
                    i < STATS.length - 1 ? "border-r border-white/8" : ""
                  }`}
                >
                  <span
                    className="text-3xl md:text-4xl font-semibold text-white"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-[var(--color-ink-500)] text-center">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Historia ── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              {/* Text */}
              <div className="flex flex-col gap-6">
                <h2
                  className="text-white leading-tight font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                >
                  Una pasión que se volvió negocio
                </h2>
                <div className="flex flex-col gap-4 text-[var(--color-ink-300)] leading-relaxed">
                  <p>
                    Marco Quiroz lleva más de dos décadas en el mundo automotriz.
                    Lo que empezó como una genuina pasión por los vehículos se
                    transformó en una automotora que hoy es referente de
                    confianza en el sur de Santiago.
                  </p>
                  <p>
                    Desde el primer día, la apuesta fue la misma: mostrar los
                    autos tal como son, atender con la honestidad que uno
                    esperaría de un amigo que sabe de autos y dar el mejor
                    precio posible.
                  </p>
                  <p>
                    El nombre Redcar no es solo una marca — es la promesa de
                    que cada auto en nuestro catálogo está listo para ti y para
                    tu familia.
                  </p>
                </div>
              </div>

              {/* Visual card */}
              <div className="glass-panel rounded-3xl p-8 md:p-10 flex flex-col gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-700)]/20 flex items-center justify-center">
                  <span className="text-2xl">🚗</span>
                </div>
                <div>
                  <h3
                    className="text-xl font-semibold text-white mb-2"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    Marco Quiroz
                  </h3>
                  <p className="text-[var(--color-ink-400)] text-sm mb-4">
                    Fundador — Quiroz Redcar
                  </p>
                  <p className="text-[var(--color-ink-300)] text-sm leading-relaxed">
                    "Más que vender autos, lo que hacemos es ayudar a las
                    familias a tomar una decisión grande con toda la información
                    y confianza que necesitan."
                  </p>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-start gap-2.5 text-[var(--color-ink-400)] text-sm">
                    <MapPinIcon className="w-4 h-4 text-[var(--color-ink-500)] shrink-0 mt-0.5" />
                    <span>Av. Bosques de Montemar #65, Concón<br />Hontaneda 2615, Valparaíso</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[var(--color-ink-400)] text-sm">
                    <PhoneIcon className="w-4 h-4 text-[var(--color-ink-500)] shrink-0" />
                    +56 9 5906 5441
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Valores ── */}
        <section className="py-20 md:py-28 bg-[var(--color-ink-900)]/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="text-center mb-14">
              <h2
                className="text-white font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
              >
                Nuestros valores
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {VALUES.map((value) => (
                <div
                  key={value.title}
                  className="glass-light rounded-2xl p-7 md:p-8 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_12px_36px_-8px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent-700)]/20 flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-[var(--color-accent-500)]" />
                    </div>
                    <h3
                      className="text-white font-semibold"
                      style={{ fontFamily: "var(--font-syne)" }}
                    >
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-[var(--color-ink-400)] text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Misión / Visión ── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel rounded-3xl p-8 md:p-10">
                <p className="text-overline text-[var(--color-accent-500)] mb-4">Misión</p>
                <p className="text-[var(--color-ink-200)] leading-relaxed">
                  Simplificar la compra y venta de vehículos usados para las
                  familias de Chile, con atención personalizada, precios justos
                  y total transparencia en cada operación.
                </p>
              </div>
              <div className="glass-panel rounded-3xl p-8 md:p-10">
                <p className="text-overline text-[var(--color-ink-500)] mb-4">Visión</p>
                <p className="text-[var(--color-ink-200)] leading-relaxed">
                  Ser la automotora familiar de referencia en Santiago, reconocida
                  por la confianza que genera y el acompañamiento que ofrece a
                  cada cliente antes, durante y después de la venta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 md:py-28 bg-[var(--color-ink-900)]/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
            <h2
              className="text-white mb-4 font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
            >
              ¿Listo para encontrar tu auto?
            </h2>
            <p className="text-[var(--color-ink-400)] mb-8 max-w-xl mx-auto">
              Visítanos en San Miguel o contáctanos por WhatsApp. Respondemos
              rápido y con gusto.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={getWhatsAppUrl("Hola, quiero visitar Quiroz Redcar.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base btn-primary !py-3 !px-6 gap-2"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Contactar por WhatsApp
              </a>
              <Link href="/" className="btn-base btn-ghost !py-3 !px-6">
                Ver catálogo disponible
              </Link>
            </div>
          </div>
        </section>
      </main>

      <InnerFooter />
    </>
  );
}
