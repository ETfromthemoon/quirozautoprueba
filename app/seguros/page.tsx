"use client";

import { useState } from "react";
import Link from "next/link";
import InnerNavbar from "@/components/InnerNavbar";
import InnerFooter from "@/components/InnerFooter";
import { CheckIcon, ArrowRightIcon } from "@/components/icons";

type FormData = {
  anio: string;
  marca: string;
  modelo: string;
  tipo: string;
  nombre: string;
  apellido: string;
  rut: string;
  fechaNac: string;
  telefono: string;
  correo: string;
};

const INITIAL_FORM: FormData = {
  anio: "",
  marca: "",
  modelo: "",
  tipo: "Particular",
  nombre: "",
  apellido: "",
  rut: "",
  fechaNac: "",
  telefono: "",
  correo: "",
};

const ANIOS = Array.from({ length: 20 }, (_, i) => String(2007 + i));

const BENEFITS = [
  {
    title: "Cobertura completa",
    description: "Protege tu vehículo contra todo riesgo, robo, incendio y daños a terceros.",
  },
  {
    title: "Asesoría personalizada",
    description: "Te ayudamos a elegir el seguro que mejor se adapta a tu vehículo y presupuesto.",
  },
  {
    title: "Gestión de siniestros",
    description: "Te acompañamos en todo el proceso ante cualquier eventualidad.",
  },
];

export default function SegurosPage() {
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
          tipo: "seguros",
          datos: {
            "Año vehículo": form.anio,
            Marca: form.marca,
            Modelo: form.modelo,
            "Tipo": form.tipo,
            Nombre: form.nombre,
            Apellido: form.apellido,
            Rut: form.rut,
            "Fecha Nacimiento": form.fechaNac,
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
        <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
          <div
            className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full opacity-[0.05] blur-[100px]"
            style={{ background: "var(--color-accent-600)" }}
            aria-hidden="true"
          />
          <div className="mx-auto max-w-7xl px-4 md:px-8 relative">
            <div className="max-w-3xl">
              <p className="text-overline text-[var(--color-accent-500)] mb-4">
                Seguros automotrices
              </p>
              <h1
                className="text-white mb-6 font-semibold leading-tight tracking-tight"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
              >
                Protege tu vehículo con el mejor seguro
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-ink-300)] leading-relaxed max-w-2xl">
                Cotizamos y contratamos el seguro ideal para tu auto.
                Cobertura en las mejores aseguradoras del mercado.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-[var(--color-ink-900)]/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="text-center mb-14">
              <h2
                className="text-white font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
              >
                ¿Por qué asegurar con nosotros?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {BENEFITS.map((b) => (
                <div key={b.title} className="glass-light rounded-2xl p-7 flex items-start gap-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                  <div className="w-9 h-9 rounded-full bg-[var(--color-accent-700)]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckIcon className="w-4 h-4 text-[var(--color-accent-500)]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1.5" style={{ fontFamily: "var(--font-syne)" }}>
                      {b.title}
                    </h3>
                    <p className="text-[var(--color-ink-400)] text-sm leading-relaxed">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
              <div className="flex flex-col gap-6 lg:pt-4">
                <h2
                  className="text-white leading-tight font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                >
                  Solicita tu cotización
                </h2>
                <p className="text-[var(--color-ink-400)] leading-relaxed">
                  Completa el formulario y te contactaremos con las mejores opciones
                  de seguro para tu vehículo. Respuesta en menos de 24 horas hábiles.
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
                      A la brevedad nos comunicaremos. Gracias por confiar en Quiroz Redcar.
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
                        <label htmlFor="s-anio" className="text-xs text-[var(--color-ink-400)]">Año *</label>
                        <select
                          id="s-anio"
                          required
                          value={form.anio}
                          onChange={(e) => update("anio", e.target.value)}
                          className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                        >
                          <option value="">Seleccionar</option>
                          {ANIOS.map((a) => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="s-tipo" className="text-xs text-[var(--color-ink-400)]">Tipo *</label>
                        <select
                          id="s-tipo"
                          required
                          value={form.tipo}
                          onChange={(e) => update("tipo", e.target.value)}
                          className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                        >
                          <option value="Particular">Particular</option>
                          <option value="Comercial">Comercial</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="s-marca" className="text-xs text-[var(--color-ink-400)]">Marca *</label>
                        <input
                          id="s-marca"
                          type="text"
                          required
                          value={form.marca}
                          onChange={(e) => update("marca", e.target.value)}
                          placeholder="Ej: Toyota"
                          className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="s-modelo" className="text-xs text-[var(--color-ink-400)]">Modelo *</label>
                        <input
                          id="s-modelo"
                          type="text"
                          required
                          value={form.modelo}
                          onChange={(e) => update("modelo", e.target.value)}
                          placeholder="Ej: Yaris"
                          className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                        />
                      </div>
                    </div>

                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)] mt-1">
                      Datos del asegurado
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="s-nombre" className="text-xs text-[var(--color-ink-400)]">Nombre *</label>
                        <input
                          id="s-nombre"
                          type="text"
                          required
                          value={form.nombre}
                          onChange={(e) => update("nombre", e.target.value)}
                          placeholder="Tu nombre"
                          className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="s-apellido" className="text-xs text-[var(--color-ink-400)]">Apellido *</label>
                        <input
                          id="s-apellido"
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
                      <label htmlFor="s-rut" className="text-xs text-[var(--color-ink-400)]">Rut *</label>
                      <input
                        id="s-rut"
                        type="text"
                        required
                        value={form.rut}
                        onChange={(e) => update("rut", e.target.value)}
                        placeholder="12.345.678-9"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="s-fecha" className="text-xs text-[var(--color-ink-400)]">Fecha de nacimiento *</label>
                      <input
                        id="s-fecha"
                        type="date"
                        required
                        value={form.fechaNac}
                        onChange={(e) => update("fechaNac", e.target.value)}
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="s-telefono" className="text-xs text-[var(--color-ink-400)]">Teléfono *</label>
                        <input
                          id="s-telefono"
                          type="tel"
                          required
                          value={form.telefono}
                          onChange={(e) => update("telefono", e.target.value)}
                          placeholder="+56 9 ..."
                          className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="s-correo" className="text-xs text-[var(--color-ink-400)]">Correo *</label>
                        <input
                          id="s-correo"
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

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
            <p className="text-[var(--color-ink-500)] text-sm mb-4">
              ¿Ya tienes un vehículo en vista?
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
