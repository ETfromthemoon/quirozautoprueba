import type { Metadata } from "next";
import Link from "next/link";
import InnerNavbar from "@/components/InnerNavbar";
import InnerFooter from "@/components/InnerFooter";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon, CheckIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Nosotros — Quiroz Automotriz",
  description:
    "Conoce la historia de Quiroz Automotriz. Más de 10 años en el rubro automotriz ofreciendo compra, venta y consignación de vehículos con proceso 100% transparente y seguro.",
};

const STATS = [
  { value: "+10", label: "años en el mercado" },
  { value: "+500", label: "vehículos vendidos" },
  { value: "100%", label: "transparencia" },
  { value: "0", label: "preocupaciones para ti" },
];

const SERVICIOS = [
  {
    title: "Compramos y vendemos autos",
    description: "Seleccionamos los mejores vehículos para ofrecerte solo opciones de calidad.",
  },
  {
    title: "Consignación",
    description: "Te ayudamos a vender tu auto al mejor precio, gestionando todo el proceso.",
  },
  {
    title: "Acceso a financiamiento",
    description: "Coordinamos el crédito directamente para que nada te detenga.",
  },
  {
    title: "Aseguramos tu auto",
    description: "Te conectamos con las mejores opciones de seguro para tu vehículo.",
  },
  {
    title: "Entregamos en todo Chile",
    description: "No importa dónde estés, coordinamos la entrega de tu vehículo a cualquier región.",
  },
  {
    title: "TAG",
    description: "Gestionamos tu TAG para que circules sin preocupaciones desde el primer día.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <InnerNavbar />

      <main className="bg-[var(--color-ink-950)] min-h-screen text-white">
        {/* ── Hero ── */}
        <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
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
                Quiroz Automotriz
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-ink-300)] leading-relaxed max-w-2xl">
                Donde el cliente es la pieza más importante. Si el cliente está
                bien con nuestro servicio, nosotros estamos bien también.
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

        {/* ── Historia y fundador ── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="flex flex-col gap-6">
                <h2
                  className="text-white leading-tight font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                >
                  De gerente a emprendedor
                </h2>
                <div className="flex flex-col gap-4 text-[var(--color-ink-300)] leading-relaxed">
                  <p>
                    Soy Marco Quiroz y trabajé muchos años en el rubro automotriz,
                    llegando a ser gerente. Ahí me di cuenta de todos los errores
                    que se cometen, y también de las innovaciones que se podían
                    realizar en este rubro.
                  </p>
                  <p>
                    Por eso decidí crear mi propia empresa, Quiroz Automotriz.
                    Acá, el cliente es la pieza más importante de la empresa. Si
                    el cliente está bien con nuestro servicio, nosotros estamos
                    bien también.
                  </p>
                </div>
              </div>

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
                    Fundador — Quiroz Automotriz
                  </p>
                  <p className="text-[var(--color-ink-300)] text-sm leading-relaxed">
                    &ldquo;Más que vender autos, lo que hacemos es quitarle las
                    preocupaciones al cliente. Nosotros hacemos todos los trámites
                    para que comprar o vender un vehículo sea rápido, seguro y sin
                    moverte de tu casa.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Modelo de negocios innovador ── */}
        <section className="py-20 md:py-28 bg-[var(--color-ink-900)]/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2
                className="text-white font-semibold tracking-tight mb-6"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
              >
                Un modelo de negocios innovador
              </h2>
              <p className="text-[var(--color-ink-300)] leading-relaxed text-lg">
                La experiencia abrió mis ojos para darme cuenta de que, en toda
                empresa, su núcleo es el cliente. Sin los clientes, las empresas
                no existen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="glass-light rounded-2xl p-7 md:p-8 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent-700)]/20 flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-[var(--color-accent-500)]" />
                  </div>
                  <h3 className="text-white font-semibold" style={{ fontFamily: "var(--font-syne)" }}>
                    Proceso 100% transparente y seguro
                  </h3>
                </div>
                <p className="text-[var(--color-ink-400)] text-sm leading-relaxed">
                  Hacemos todo por el cliente. Lo eximimos de responsabilidades a la
                  hora de comprar o vender vehículos, ya que nosotros hacemos todos
                  los trámites que esto conlleva.
                </p>
              </div>

              <div className="glass-light rounded-2xl p-7 md:p-8 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent-700)]/20 flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-[var(--color-accent-500)]" />
                  </div>
                  <h3 className="text-white font-semibold" style={{ fontFamily: "var(--font-syne)" }}>
                    Sin moverte de tu hogar
                  </h3>
                </div>
                <p className="text-[var(--color-ink-400)] text-sm leading-relaxed">
                  Nuestros clientes reciben la mejor atención sin la necesidad de
                  moverse de su casa. Tenemos convenio con la notaría Gervasio en
                  Viña del Mar para realizar todos los trámites sin preocupaciones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Servicios ── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="text-center mb-14">
              <h2
                className="text-white font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
              >
                Nuestros servicios
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {SERVICIOS.map((servicio) => (
                <div
                  key={servicio.title}
                  className="glass-panel rounded-2xl p-7 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)]"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent-700)]/20 flex items-center justify-center mb-1">
                    <CheckIcon className="w-4 h-4 text-[var(--color-accent-500)]" />
                  </div>
                  <h3 className="text-white font-semibold" style={{ fontFamily: "var(--font-syne)" }}>
                    {servicio.title}
                  </h3>
                  <p className="text-[var(--color-ink-400)] text-sm leading-relaxed">
                    {servicio.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Misión / Visión ── */}
        <section className="py-20 md:py-28 bg-[var(--color-ink-900)]/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel rounded-3xl p-8 md:p-10 flex flex-col gap-4">
                <p className="text-overline text-[var(--color-accent-500)]">Visión</p>
                <p className="text-[var(--color-ink-200)] leading-relaxed">
                  Pretendemos ser reconocidos como una empresa destacada del rubro
                  automotriz, a nivel local y nacional, por nuestro compromiso con
                  hacerle fácil, rápido y seguro el proceso de compra o venta de
                  vehículos a sus clientes.
                </p>
              </div>
              <div className="glass-panel rounded-3xl p-8 md:p-10 flex flex-col gap-4">
                <p className="text-overline text-[var(--color-ink-500)]">Misión</p>
                <p className="text-[var(--color-ink-200)] leading-relaxed">
                  Trabajamos día a día en simplificarle la vida al cliente. Ya que
                  estamos 100% preocupados de realizar todos los trámites y gestiones
                  que correspondan para que los clientes puedan comprar o vender sus
                  vehículos sin la necesidad de moverse de su hogar, resolviendo sus
                  dudas y asesorándolos en los procesos de compra y venta de vehículos,
                  para que este proceso sea rápido, amigable y eximir de responsabilidades
                  al cliente, ya que hacemos todos los trámites por ellos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Direcciones ── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="text-center mb-14">
              <h2
                className="text-white font-semibold tracking-tight mb-4"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
              >
                Ven a conocernos
              </h2>
              <p className="text-[var(--color-ink-400)] max-w-xl mx-auto">
                Visítanos en cualquiera de nuestras direcciones. Estaremos encantados de atenderte.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <a
                href="https://goo.gl/maps/oKDZa635eksq8RgM6"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-light rounded-2xl p-7 flex items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 group"
              >
                <MapPinIcon className="w-5 h-5 text-[var(--color-accent-500)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-1" style={{ fontFamily: "var(--font-syne)" }}>
                    Concón
                  </h3>
                  <p className="text-[var(--color-ink-400)] text-sm leading-relaxed">
                    Av. Bosques de Montemar #65, edificio OFC, oficina 203
                  </p>
                </div>
              </a>

              <a
                href="https://maps.app.goo.gl/r2SLAKdARYcKYRSN9"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-light rounded-2xl p-7 flex items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 group"
              >
                <MapPinIcon className="w-5 h-5 text-[var(--color-accent-500)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-1" style={{ fontFamily: "var(--font-syne)" }}>
                    Valparaíso
                  </h3>
                  <p className="text-[var(--color-ink-400)] text-sm leading-relaxed">
                    Hontaneda 2615, Valparaíso
                  </p>
                </div>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <div className="flex items-center gap-2 text-[var(--color-ink-400)] text-sm">
                <PhoneIcon className="w-4 h-4 text-[var(--color-ink-500)]" />
                +56 9 9343 1571
              </div>
              <div className="flex items-center gap-2 text-[var(--color-ink-400)] text-sm">
                <PhoneIcon className="w-4 h-4 text-[var(--color-ink-500)]" />
                +56 9 5906 5441
              </div>
            </div>
          </div>
        </section>

        {/* ── Transbank ── */}
        <section className="pb-16 md:pb-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
            <p className="text-[var(--color-ink-500)] text-xs mb-4">
              Aceptamos todos los medios de pago
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-[var(--color-ink-600)] text-xs font-medium tracking-wider uppercase">Transbank</span>
              <span className="text-[var(--color-ink-600)] text-xs">·</span>
              <span className="text-[var(--color-ink-600)] text-xs font-medium tracking-wider uppercase">Débito</span>
              <span className="text-[var(--color-ink-600)] text-xs">·</span>
              <span className="text-[var(--color-ink-600)] text-xs font-medium tracking-wider uppercase">Transferencia bancaria</span>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 md:py-24 bg-[var(--color-ink-900)]/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
            <h2
              className="text-white mb-4 font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
            >
              ¿Listo para encontrar tu auto?
            </h2>
            <p className="text-[var(--color-ink-400)] mb-8 max-w-xl mx-auto">
              Visítanos en Concón o Valparaíso, o contáctanos por WhatsApp.
              Respondemos rápido y con gusto.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={getWhatsAppUrl("Hola, me interesa conocer el catálogo de Quiroz Automotriz.")}
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
