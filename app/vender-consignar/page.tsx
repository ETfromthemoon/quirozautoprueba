"use client";

import { useState } from "react";
import Link from "next/link";
import InnerNavbar from "@/components/InnerNavbar";
import InnerFooter from "@/components/InnerFooter";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon, CheckIcon, ArrowRightIcon } from "@/components/icons";

const STEPS = [
  {
    number: "01",
    title: "Trae tu vehículo",
    description:
      "Agenda una visita o acércate a nuestro local en San Miguel. No necesitas cita previa.",
  },
  {
    number: "02",
    title: "Evaluamos juntos",
    description:
      "Revisamos el estado mecánico y estético de tu auto de forma transparente, frente a ti.",
  },
  {
    number: "03",
    title: "Acordamos el precio",
    description:
      "Te ofrecemos el precio más justo del mercado. Sin regateo sin fin — precio directo y claro.",
  },
  {
    number: "04",
    title: "Cerramos y pagamos",
    description:
      "Gestionamos los papeles y el pago se hace en el momento. Sin demoras ni trámites complicados.",
  },
];

const BENEFITS = [
  "Pago inmediato al cerrar el trato",
  "Sin costo de publicación ni comisiones ocultas",
  "Asesoría gratuita de tasación",
  "Trámites de transferencia incluidos",
  "Opción de consignación con tu precio",
];

type FormData = {
  nombre: string;
  telefono: string;
  email: string;
  marca: string;
  modelo: string;
  anio: string;
  km: string;
  mensaje: string;
};

const INITIAL_FORM: FormData = {
  nombre: "",
  telefono: "",
  email: "",
  marca: "",
  modelo: "",
  anio: "",
  km: "",
  mensaje: "",
};

export default function VenderConsignarPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildWhatsAppMessage(): string {
    const lines = [
      "Hola, quiero consultar sobre *Vender / Consignar* mi vehículo.",
      "",
    ];
    if (form.marca || form.modelo) {
      lines.push(`Vehículo: ${[form.marca, form.modelo, form.anio].filter(Boolean).join(" ")}`);
    }
    if (form.km) lines.push(`Kilómetros: ${form.km}`);
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
    window.open("https://www.quirozautomotriz.cl/vender-consignar/", "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <InnerNavbar />

      <main className="bg-[var(--color-ink-950)] min-h-screen text-white">
        {/* ── Hero ── */}
        <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px]"
            style={{ background: "var(--color-accent-600)" }}
            aria-hidden="true"
          />
          <div className="mx-auto max-w-7xl px-4 md:px-8 relative">
            <div className="max-w-3xl">
              <p className="text-overline text-[var(--color-accent-500)] mb-4">
                Vende o consigna
              </p>
              <h1
                className="text-white mb-6 font-semibold leading-tight tracking-tight"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
              >
                Transforma tu auto en dinero hoy
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-ink-300)] leading-relaxed max-w-2xl mb-8">
                Compramos tu vehículo de forma directa o lo consignamos a tu
                precio. Trámites incluidos, pago inmediato, sin complicaciones.
              </p>
              <div className="flex flex-wrap gap-3">
                {BENEFITS.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm text-[var(--color-ink-300)]">
                    <CheckIcon className="w-4 h-4 text-[var(--color-accent-500)] shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Proceso ── */}
        <section className="py-20 md:py-28 bg-[var(--color-ink-900)]/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="text-center mb-14">
              <h2
                className="text-white font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
              >
                El proceso en 4 pasos
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step, i) => (
                <div key={step.number} className="flex flex-col gap-4 relative">
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-[calc(100%_-_8px)] w-[calc(100%_-_32px)] h-px bg-white/8 z-0" />
                  )}
                  <div className="glass-light rounded-2xl p-7 flex flex-col gap-4 relative z-10 h-full transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_12px_36px_-8px_rgba(0,0,0,0.5)]">
                    <span
                      className="text-2xl font-light text-[var(--color-ink-400)]"
                      style={{ fontFamily: "var(--font-syne)" }}
                    >
                      {step.number}
                    </span>
                    <div>
                      <h3
                        className="text-white font-medium mb-2"
                        style={{ fontFamily: "var(--font-syne)" }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-[var(--color-ink-400)] text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Formulario ── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
              {/* Left: context */}
              <div className="flex flex-col gap-6 lg:pt-4">
                <h2
                  className="text-white leading-tight font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                >
                  Cuéntanos sobre<br />tu vehículo
                </h2>
                <p className="text-[var(--color-ink-400)] leading-relaxed">
                  Completa el formulario y elige cómo prefieres continuar —
                  directamente por WhatsApp o por el formulario web de nuestro
                  sitio anterior.
                </p>

                {/* Option boxes */}
                <div className="flex flex-col gap-3 mt-2">
                  <div className="glass-light rounded-xl p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-[#25D366]/15 flex items-center justify-center shrink-0">
                      <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium mb-1">WhatsApp</h4>
                      <p className="text-[var(--color-ink-500)] text-xs leading-relaxed">
                        Envía tu consulta pre-rellenada al instante. Respuesta
                        rápida y atención directa.
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
                        Abre el formulario de nuestro sitio. El equipo recibe
                        tu consulta por email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: form */}
              <div className="glass-panel rounded-3xl p-7 md:p-9">
                <form onSubmit={handleWhatsApp} className="flex flex-col gap-5">
                  {/* Tu info */}
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)]">
                    Tus datos
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="vc-nombre" className="text-xs text-[var(--color-ink-400)]">
                        Nombre *
                      </label>
                      <input
                        id="vc-nombre"
                        type="text"
                        required
                        value={form.nombre}
                        onChange={(e) => update("nombre", e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="vc-telefono" className="text-xs text-[var(--color-ink-400)]">
                        Teléfono *
                      </label>
                      <input
                        id="vc-telefono"
                        type="tel"
                        required
                        value={form.telefono}
                        onChange={(e) => update("telefono", e.target.value)}
                        placeholder="+56 9 ..."
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Tu auto */}
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)] mt-1">
                    Tu vehículo
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="vc-marca" className="text-xs text-[var(--color-ink-400)]">
                        Marca
                      </label>
                      <input
                        id="vc-marca"
                        type="text"
                        value={form.marca}
                        onChange={(e) => update("marca", e.target.value)}
                        placeholder="Toyota"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="vc-modelo" className="text-xs text-[var(--color-ink-400)]">
                        Modelo
                      </label>
                      <input
                        id="vc-modelo"
                        type="text"
                        value={form.modelo}
                        onChange={(e) => update("modelo", e.target.value)}
                        placeholder="Yaris"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="vc-anio" className="text-xs text-[var(--color-ink-400)]">
                        Año
                      </label>
                      <input
                        id="vc-anio"
                        type="text"
                        value={form.anio}
                        onChange={(e) => update("anio", e.target.value)}
                        placeholder="2019"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="vc-km" className="text-xs text-[var(--color-ink-400)]">
                      Kilómetros aproximados
                    </label>
                    <input
                      id="vc-km"
                      type="text"
                      value={form.km}
                      onChange={(e) => update("km", e.target.value)}
                      placeholder="ej: 80.000"
                      className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="vc-mensaje" className="text-xs text-[var(--color-ink-400)]">
                      Comentario adicional
                    </label>
                    <textarea
                      id="vc-mensaje"
                      rows={3}
                      value={form.mensaje}
                      onChange={(e) => update("mensaje", e.target.value)}
                      placeholder="Estado del auto, precio esperado..."
                      className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors resize-none"
                    />
                  </div>

                  {/* Actions */}
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
      </main>

      <InnerFooter />
    </>
  );
}
