"use client";

import { useState } from "react";
import Link from "next/link";
import InnerNavbar from "@/components/InnerNavbar";
import InnerFooter from "@/components/InnerFooter";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon, CheckIcon, ArrowRightIcon } from "@/components/icons";

const BENEFITS = [
  {
    title: "Rápido pre-aprobado",
    description: "Evaluamos tu perfil crediticio en minutos. Sin papeleos interminables.",
  },
  {
    title: "Cuotas a tu medida",
    description: "Adaptamos el plan de pago a tu ingreso y presupuesto mensual.",
  },
  {
    title: "Sin pie obligatorio",
    description: "Opciones con y sin pie inicial. Tú decides cómo quieres financiar.",
  },
  {
    title: "Tasa competitiva",
    description: "Trabajamos con entidades de crédito que ofrecen las mejores tasas del mercado.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Elige tu auto",
    description: "Selecciona el vehículo de nuestro catálogo o cuéntanos qué tipo de auto buscas.",
  },
  {
    number: "02",
    title: "Solicita el financiamiento",
    description: "Completa el formulario o contáctanos por WhatsApp. Evaluamos tu perfil al instante.",
  },
  {
    number: "03",
    title: "Conduce tu auto",
    description: "Una vez aprobado, coordinamos la entrega. El trámite es rápido y sin sorpresas.",
  },
];

type FormData = {
  nombre: string;
  telefono: string;
  email: string;
  vehiculo: string;
  ingreso: string;
  mensaje: string;
};

const INITIAL_FORM: FormData = {
  nombre: "",
  telefono: "",
  email: "",
  vehiculo: "",
  ingreso: "",
  mensaje: "",
};

export default function FinanciamientoPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildWhatsAppMessage(): string {
    const lines = [
      "Hola, me interesa el servicio de *Financiamiento*.",
      "",
    ];
    if (form.vehiculo) lines.push(`Vehículo de interés: ${form.vehiculo}`);
    if (form.ingreso) lines.push(`Ingreso aproximado: ${form.ingreso}`);
    if (form.nombre) lines.push(`Mi nombre: ${form.nombre}`);
    if (form.telefono) lines.push(`Teléfono: ${form.telefono}`);
    if (form.mensaje) lines.push(`\nMensaje: ${form.mensaje}`);
    return lines.join("\n");
  }

  function handleWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    window.open(getWhatsAppUrl(buildWhatsAppMessage()), "_blank", "noopener,noreferrer");
  }

  function handleWebForm() {
    window.open("https://www.quirozautomotriz.cl/financiamiento/", "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <InnerNavbar />

      <main className="bg-[var(--color-ink-950)] min-h-screen text-white">
        {/* ── Hero ── */}
        <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
          <div
            className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full opacity-[0.05] blur-[100px]"
            style={{ background: "var(--color-accent-600)" }}
            aria-hidden="true"
          />
          <div className="mx-auto max-w-7xl px-4 md:px-8 relative">
            <div className="max-w-3xl">
              <p className="text-overline text-[var(--color-accent-500)] mb-4">
                Financia tu auto
              </p>
              <h1
                className="text-white mb-6 font-semibold leading-tight tracking-tight"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
              >
                Tu próximo auto, al alcance de tu bolsillo
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-ink-300)] leading-relaxed max-w-2xl">
                Ofrecemos opciones de financiamiento flexibles para que nada te
                detenga. Evaluamos tu perfil y coordinamos el crédito directamente.
              </p>
            </div>
          </div>
        </section>

        {/* ── Beneficios ── */}
        <section className="py-20 md:py-28 bg-[var(--color-ink-900)]/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="text-center mb-14">
              <h2
                className="text-white font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
              >
                Ventajas del financiamiento Quiroz
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {BENEFITS.map((benefit) => (
                <div key={benefit.title} className="glass-light rounded-2xl p-7 flex items-start gap-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_12px_36px_-8px_rgba(0,0,0,0.5)]">
                  <div className="w-9 h-9 rounded-full bg-[var(--color-accent-700)]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckIcon className="w-4 h-4 text-[var(--color-accent-500)]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1.5" style={{ fontFamily: "var(--font-syne)" }}>
                      {benefit.title}
                    </h3>
                    <p className="text-[var(--color-ink-400)] text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Proceso ── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="text-center mb-14">
              <h2
                className="text-white font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
              >
                Solo 3 pasos
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step) => (
                <div key={step.number} className="glass-panel rounded-2xl p-8 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)]">
                  <span
                    className="text-2xl font-light text-[var(--color-ink-400)]"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-white font-medium mb-2" style={{ fontFamily: "var(--font-syne)" }}>
                      {step.title}
                    </h3>
                    <p className="text-[var(--color-ink-400)] text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Transbank mention */}
            <p className="text-center text-[var(--color-ink-600)] text-xs mt-10">
              Aceptamos pagos con Transbank · Débito · Transferencia bancaria
            </p>
          </div>
        </section>

        {/* ── Formulario ── */}
        <section className="py-20 md:py-28 bg-[var(--color-ink-900)]/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
              {/* Left */}
              <div className="flex flex-col gap-6 lg:pt-4">
                <h2
                  className="text-white leading-tight font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                >
                  Cuéntanos qué<br />auto te interesa
                </h2>
                <p className="text-[var(--color-ink-400)] leading-relaxed">
                  Deja tus datos y te ayudamos a encontrar el plan de
                  financiamiento que mejor se adapte a ti. Respuesta en menos
                  de 24 horas hábiles.
                </p>

                <div className="flex flex-col gap-3 mt-2">
                  <div className="glass-light rounded-xl p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-[#25D366]/15 flex items-center justify-center shrink-0">
                      <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium mb-1">WhatsApp directo</h4>
                      <p className="text-[var(--color-ink-500)] text-xs leading-relaxed">
                        Pre-rellena tu consulta y envíala al instante. El equipo responde rápido.
                      </p>
                    </div>
                  </div>
                  <div className="glass-light rounded-xl p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-[var(--color-ink-700)] flex items-center justify-center shrink-0">
                      <ArrowRightIcon className="w-4 h-4 text-[var(--color-ink-300)]" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium mb-1">Formulario web</h4>
                      <p className="text-[var(--color-ink-500)] text-xs leading-relaxed">
                        Abre el formulario oficial. Quedamos en contacto por email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: form */}
              <div className="glass-panel rounded-3xl p-7 md:p-9">
                <form onSubmit={handleWhatsApp} className="flex flex-col gap-5">
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)]">
                    Tus datos
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fi-nombre" className="text-xs text-[var(--color-ink-400)]">
                        Nombre *
                      </label>
                      <input
                        id="fi-nombre"
                        type="text"
                        required
                        value={form.nombre}
                        onChange={(e) => update("nombre", e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fi-telefono" className="text-xs text-[var(--color-ink-400)]">
                        Teléfono *
                      </label>
                      <input
                        id="fi-telefono"
                        type="tel"
                        required
                        value={form.telefono}
                        onChange={(e) => update("telefono", e.target.value)}
                        placeholder="+56 9 ..."
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)] mt-1">
                    Tu consulta
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fi-vehiculo" className="text-xs text-[var(--color-ink-400)]">
                      Vehículo de interés
                    </label>
                    <input
                      id="fi-vehiculo"
                      type="text"
                      value={form.vehiculo}
                      onChange={(e) => update("vehiculo", e.target.value)}
                      placeholder="Ej: Toyota Yaris 2021 o el que viste en el catálogo"
                      className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fi-ingreso" className="text-xs text-[var(--color-ink-400)]">
                      Ingreso mensual aproximado
                    </label>
                    <input
                      id="fi-ingreso"
                      type="text"
                      value={form.ingreso}
                      onChange={(e) => update("ingreso", e.target.value)}
                      placeholder="Ej: $800.000 — $1.200.000"
                      className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fi-mensaje" className="text-xs text-[var(--color-ink-400)]">
                      Mensaje (opcional)
                    </label>
                    <textarea
                      id="fi-mensaje"
                      rows={3}
                      value={form.mensaje}
                      onChange={(e) => update("mensaje", e.target.value)}
                      placeholder="Cuéntanos algo más sobre lo que necesitas..."
                      className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      className="btn-base btn-primary flex-1 !py-3 gap-2"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      Enviar por WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={handleWebForm}
                      className="btn-base btn-ghost flex-1 !py-3 gap-2"
                    >
                      Formulario web
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-[var(--color-ink-600)] text-center">
                    Tu información no se almacena en este sitio. Solo se usa para pre-rellenar el mensaje.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
            <p className="text-[var(--color-ink-500)] text-sm mb-4">
              ¿Ya sabes qué auto quieres?
            </p>
            <Link href="/" className="btn-base btn-secondary !py-3 !px-6">
              Ver catálogo disponible
            </Link>
          </div>
        </section>
      </main>

      <InnerFooter />
    </>
  );
}
