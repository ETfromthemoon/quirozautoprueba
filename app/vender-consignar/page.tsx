"use client";

import { useState } from "react";
import Link from "next/link";
import InnerNavbar from "@/components/InnerNavbar";
import InnerFooter from "@/components/InnerFooter";
import { CheckIcon } from "@/components/icons";

type FormData = {
  patente: string;
  kilometraje: string;
  servicio: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
};

const INITIAL_FORM: FormData = {
  patente: "",
  kilometraje: "",
  servicio: "Particular",
  nombre: "",
  apellido: "",
  telefono: "",
  correo: "",
};

type Tab = "compra" | "consignacion";

export default function VenderConsignarPage() {
  const [tab, setTab] = useState<Tab>("compra");
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: tab === "compra" ? "compra" : "consignacion",
          datos: {
            Patente: form.patente,
            Kilometraje: form.kilometraje,
            "Servicio": form.servicio,
            Nombre: form.nombre,
            Apellido: form.apellido,
            Teléfono: form.telefono,
            Correo: form.correo,
          },
        }),
      });
      setSent(true);
    } catch {
      setError("Error al enviar. Intenta nuevamente o escríbenos por WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  const STEPS_COMPRA = [
    { number: "01", title: "Nos visitas o te visitamos", description: "Coordinamos una visita para evaluar tu vehículo donde tú prefieras." },
    { number: "02", title: "Evaluamos tu auto", description: "Revisamos el estado de tu vehículo y te hacemos una oferta justa y sin compromiso." },
    { number: "03", title: "Pago al instante", description: "Aceptas la oferta y te pagamos al momento. Sin demoras ni trámites complicados." },
  ];

  const STEPS_CONSIGNACION = [
    { number: "01", title: "Nos visitas o te visitamos", description: "Coordinamos una visita para ver tu vehículo y tomar fotos profesionales." },
    { number: "02", title: "Sacamos fotos y video editado", description: "Creamos contenido profesional de tu vehículo para maximizar su exposición." },
    { number: "03", title: "Publicamos en todas las RRSS", description: "Tu auto se publica en todas nuestras redes sociales y plataformas de venta." },
    { number: "04", title: "Venta y pago antes de entregar", description: "Al existir un interesado, te pagamos el auto antes de entregarlo al nuevo comprador." },
  ];

  const steps = tab === "compra" ? STEPS_COMPRA : STEPS_CONSIGNACION;

  return (
    <>
      <InnerNavbar />

      <main className="bg-[var(--color-ink-950)] min-h-screen text-white">
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
                ¿Quieres vender o consignar tu auto?
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-ink-300)] leading-relaxed max-w-2xl mb-8">
                Fácil, rápido y seguro. No dejes tu auto en vitrina. Recibe tu
                dinero al instante. ¡Hacemos todo por ti!
              </p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="py-6">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex gap-3">
              <button
                onClick={() => { setTab("compra"); setSent(false); setForm(INITIAL_FORM); }}
                className={`btn-base ${tab === "compra" ? "btn-primary" : "btn-ghost border border-white/15"}`}
              >
                Compramos tu auto
              </button>
              <button
                onClick={() => { setTab("consignacion"); setSent(false); setForm(INITIAL_FORM); }}
                className={`btn-base ${tab === "consignacion" ? "btn-primary" : "btn-ghost border border-white/15"}`}
              >
                Consignaciones
              </button>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-10 md:py-16 bg-[var(--color-ink-900)]/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {steps.map((step, i) => (
                <div key={step.number} className="glass-light rounded-2xl p-7 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                  <span className="text-2xl font-light text-[var(--color-ink-400)]" style={{ fontFamily: "var(--font-syne)" }}>
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-white font-medium mb-2" style={{ fontFamily: "var(--font-syne)" }}>
                      {step.title}
                    </h3>
                    <p className="text-[var(--color-ink-400)] text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-2xl px-4 md:px-8">
            <div className="glass-panel rounded-3xl p-7 md:p-9">
              {sent ? (
                <div className="flex flex-col items-center text-center py-8 gap-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-accent-700)]/20 flex items-center justify-center">
                    <CheckIcon className="w-6 h-6 text-[var(--color-accent-500)]" />
                  </div>
                  <p className="text-white text-lg font-medium" style={{ fontFamily: "var(--font-syne)" }}>
                    {tab === "compra"
                      ? "Ya recibimos tu información"
                      : "¡Vehículo registrado!"}
                  </p>
                  <p className="text-[var(--color-ink-400)] text-sm max-w-sm">
                    {tab === "compra"
                      ? "A la brevedad nos comunicaremos para coordinar la evaluación de tu vehículo."
                      : "A la brevedad nos comunicaremos. Su vehículo será gestionado a través de nuestros canales de publicación."}
                  </p>
                  <Link href="/" className="btn-base btn-primary !py-2.5 !px-5 mt-2">
                    Volver al catálogo
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)]">
                    Datos del vehículo
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="vc-patente" className="text-xs text-[var(--color-ink-400)]">Patente *</label>
                      <input
                        id="vc-patente"
                        type="text"
                        required
                        value={form.patente}
                        onChange={(e) => update("patente", e.target.value)}
                        placeholder="Ej: JWBZ64"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors uppercase"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="vc-km" className="text-xs text-[var(--color-ink-400)]">Kilometraje *</label>
                      <input
                        id="vc-km"
                        type="text"
                        required
                        value={form.kilometraje}
                        onChange={(e) => update("kilometraje", e.target.value)}
                        placeholder="Ej: 80.000"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="vc-servicio" className="text-xs text-[var(--color-ink-400)]">Servicio *</label>
                    <select
                      id="vc-servicio"
                      required
                      value={form.servicio}
                      onChange={(e) => update("servicio", e.target.value)}
                      className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                    >
                      <option value="Particular">Particular</option>
                      <option value="Concesionario">Concesionario</option>
                    </select>
                  </div>

                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)] mt-1">
                    Tus datos
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="vc-nombre" className="text-xs text-[var(--color-ink-400)]">Nombre *</label>
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
                      <label htmlFor="vc-apellido" className="text-xs text-[var(--color-ink-400)]">Apellido *</label>
                      <input
                        id="vc-apellido"
                        type="text"
                        required
                        value={form.apellido}
                        onChange={(e) => update("apellido", e.target.value)}
                        placeholder="Tu apellido"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="vc-telefono" className="text-xs text-[var(--color-ink-400)]">Teléfono *</label>
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
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="vc-correo" className="text-xs text-[var(--color-ink-400)]">Correo *</label>
                      <input
                        id="vc-correo"
                        type="email"
                        required
                        value={form.correo}
                        onChange={(e) => update("correo", e.target.value)}
                        placeholder="correo@ejemplo.cl"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg py-2.5 px-4">{error}</p>
                  )}
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
        </section>
      </main>

      <InnerFooter />
    </>
  );
}
