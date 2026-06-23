"use client";

import { useState } from "react";
import Link from "next/link";
import InnerNavbar from "@/components/InnerNavbar";
import InnerFooter from "@/components/InnerFooter";
import { CheckIcon } from "@/components/icons";

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
    description: "Completa el formulario y evaluamos tu perfil al instante.",
  },
  {
    number: "03",
    title: "Conduce tu auto",
    description: "Una vez aprobado, coordinamos la entrega. El trámite es rápido y sin sorpresas.",
  },
];

type FormData = {
  nombre: string;
  apellido: string;
  rut: string;
  empleo: string;
  antiguedad: string;
  renta: string;
  telefono: string;
  correo: string;
};

const INITIAL_FORM: FormData = {
  nombre: "",
  apellido: "",
  rut: "",
  empleo: "Dependiente",
  antiguedad: "",
  renta: "",
  telefono: "",
  correo: "",
};

export default function FinanciamientoPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "financiamiento",
          datos: {
            Nombre: form.nombre,
            Apellido: form.apellido,
            Rut: form.rut,
            Empleo: form.empleo,
            "Antigüedad Laboral": form.antiguedad,
            Renta: form.renta,
            Teléfono: form.telefono,
            Correo: form.correo,
          },
        }),
      });
      setSent(true);
    } catch {
      alert("Error al enviar. Intenta nuevamente.");
    } finally {
      setSending(false);
    }
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
                Conseguimos financiamiento para ti
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-ink-300)] leading-relaxed max-w-2xl">
                Consigue el mejor financiamiento para el auto que quieres comprar
                con solo un par de clics. Déjanos tus datos o escríbenos por
                WhatsApp para comenzar a cotizar tu crédito.
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
            <p className="text-center text-[var(--color-ink-600)] text-xs mt-10">
              Aceptamos pagos con Transbank · Débito · Transferencia bancaria
            </p>
          </div>
        </section>

        {/* ── Formulario ── */}
        <section className="py-20 md:py-28 bg-[var(--color-ink-900)]/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
              <div className="flex flex-col gap-6 lg:pt-4">
                <h2
                  className="text-white leading-tight font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                >
                  Solicita tu<br />financiamiento
                </h2>
                <p className="text-[var(--color-ink-400)] leading-relaxed">
                  Deja tus datos y te ayudamos a encontrar el plan de
                  financiamiento que mejor se adapte a ti. Respuesta en menos
                  de 24 horas hábiles.
                </p>
              </div>

              <div className="glass-panel rounded-3xl p-7 md:p-9">
                {sent ? (
                  <div className="flex flex-col items-center text-center py-8 gap-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-accent-700)]/20 flex items-center justify-center">
                      <CheckIcon className="w-6 h-6 text-[var(--color-accent-500)]" />
                    </div>
                    <p className="text-white text-lg font-medium" style={{ fontFamily: "var(--font-syne)" }}>
                      Ya recibimos tu información
                    </p>
                    <p className="text-[var(--color-ink-400)] text-sm max-w-sm">
                      Te informaremos la respuesta a la brevedad. Gracias por confiar en Quiroz Automotriz.
                    </p>
                    <Link href="/" className="btn-base btn-primary !py-2.5 !px-5 mt-2">
                      Volver al catálogo
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)]">
                      Tus datos
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="f-nombre" className="text-xs text-[var(--color-ink-400)]">Nombre *</label>
                        <input
                          id="f-nombre"
                          type="text"
                          required
                          value={form.nombre}
                          onChange={(e) => update("nombre", e.target.value)}
                          placeholder="Tu nombre"
                          className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="f-apellido" className="text-xs text-[var(--color-ink-400)]">Apellido *</label>
                        <input
                          id="f-apellido"
                          type="text"
                          required
                          value={form.apellido}
                          onChange={(e) => update("apellido", e.target.value)}
                          placeholder="Tu apellido"
                          className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="f-rut" className="text-xs text-[var(--color-ink-400)]">Rut *</label>
                      <input
                        id="f-rut"
                        type="text"
                        required
                        value={form.rut}
                        onChange={(e) => update("rut", e.target.value)}
                        placeholder="12.345.678-9"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="f-empleo" className="text-xs text-[var(--color-ink-400)]">Empleo *</label>
                      <select
                        id="f-empleo"
                        required
                        value={form.empleo}
                        onChange={(e) => update("empleo", e.target.value)}
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      >
                        <option value="Dependiente">Dependiente</option>
                        <option value="Independiente">Independiente</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="f-antiguedad" className="text-xs text-[var(--color-ink-400)]">Antigüedad Laboral</label>
                      <input
                        id="f-antiguedad"
                        type="text"
                        value={form.antiguedad}
                        onChange={(e) => update("antiguedad", e.target.value)}
                        placeholder="Ej: 3 años"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="f-renta" className="text-xs text-[var(--color-ink-400)]">Renta mensual *</label>
                      <input
                        id="f-renta"
                        type="text"
                        required
                        value={form.renta}
                        onChange={(e) => update("renta", e.target.value)}
                        placeholder="Ej: $1.200.000"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="f-telefono" className="text-xs text-[var(--color-ink-400)]">Teléfono *</label>
                        <input
                          id="f-telefono"
                          type="tel"
                          required
                          value={form.telefono}
                          onChange={(e) => update("telefono", e.target.value)}
                          placeholder="+56 9 ..."
                          className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="f-correo" className="text-xs text-[var(--color-ink-400)]">Correo *</label>
                        <input
                          id="f-correo"
                          type="email"
                          required
                          value={form.correo}
                          onChange={(e) => update("correo", e.target.value)}
                          placeholder="correo@ejemplo.cl"
                          className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="btn-base btn-primary w-full !py-3 mt-2 disabled:opacity-50"
                    >
                      {sending ? "Enviando..." : "Enviar solicitud"}
                    </button>
                  </form>
                )}
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
