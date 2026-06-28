"use client";

import { useState } from "react";
import Link from "next/link";
import InnerNavbar from "@/components/InnerNavbar";
import InnerFooter from "@/components/InnerFooter";
import { CheckIcon } from "@/components/icons";

type FormData = {
  marca: string;
  modelo: string;
  anio: string;
  patente: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
};

const INITIAL_FORM: FormData = {
  marca: "",
  modelo: "",
  anio: "",
  patente: "",
  nombre: "",
  apellido: "",
  telefono: "",
  correo: "",
};

export default function FormularioVehiculosPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [tipo, setTipo] = useState<"compra" | "consignacion">("consignacion");

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
          tipo: "formulario-vehiculos",
          datos: {
            Tipo: tipo === "compra" ? "Compra directa" : "Consignación",
            Marca: form.marca,
            Modelo: form.modelo,
            Año: form.anio,
            Patente: form.patente,
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
          <div className="mx-auto max-w-3xl px-4 md:px-8 relative text-center">
            <p className="text-overline text-[var(--color-accent-500)] mb-4">
              Compra o consignación
            </p>
            <h1
              className="text-white mb-6 font-semibold leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
            >
              Formulario de vehículo
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-ink-300)] leading-relaxed max-w-xl mx-auto">
              Vende tu auto de forma segura o consigna tu vehículo con nosotros.
              Respuesta rápida y pago al instante.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="mx-auto max-w-2xl px-4 md:px-8">
            <div className="glass-panel rounded-3xl p-7 md:p-9">
              {sent ? (
                <div className="flex flex-col items-center text-center py-8 gap-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-accent-700)]/20 flex items-center justify-center">
                    <CheckIcon className="w-6 h-6 text-[var(--color-accent-500)]" />
                  </div>
                  <p className="text-white text-lg font-medium" style={{ fontFamily: "var(--font-syne)" }}>
                    ¡Información recibida!
                  </p>
                  <div className="text-[var(--color-ink-400)] text-sm max-w-sm leading-relaxed">
                    <p>Estimado, agradecemos su preferencia con Quiroz Automotriz.</p>
                    <p className="mt-2">
                      Su vehículo será gestionado a través de nuestros canales de
                      publicación y redes sociales. Nos comunicaremos a la brevedad.
                    </p>
                  </div>
                  <Link href="/" className="btn-base btn-primary !py-2.5 !px-5 mt-2">
                    Volver al catálogo
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)]">
                    Tipo de operación
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTipo("consignacion")}
                      className={`btn-base w-full !py-3 ${tipo === "consignacion" ? "btn-primary" : "btn-ghost border border-white/15"}`}
                    >
                      Consignar
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipo("compra")}
                      className={`btn-base w-full !py-3 ${tipo === "compra" ? "btn-primary" : "btn-ghost border border-white/15"}`}
                    >
                      Comprar
                    </button>
                  </div>

                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)] mt-1">
                    Datos del vehículo
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fv-marca" className="text-xs text-[var(--color-ink-400)]">Marca *</label>
                      <input
                        id="fv-marca"
                        type="text"
                        required
                        value={form.marca}
                        onChange={(e) => update("marca", e.target.value)}
                        placeholder="Ej: Toyota"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fv-modelo" className="text-xs text-[var(--color-ink-400)]">Modelo *</label>
                      <input
                        id="fv-modelo"
                        type="text"
                        required
                        value={form.modelo}
                        onChange={(e) => update("modelo", e.target.value)}
                        placeholder="Ej: Yaris"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fv-anio" className="text-xs text-[var(--color-ink-400)]">Año *</label>
                      <input
                        id="fv-anio"
                        type="text"
                        required
                        value={form.anio}
                        onChange={(e) => update("anio", e.target.value)}
                        placeholder="Ej: 2019"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fv-patente" className="text-xs text-[var(--color-ink-400)]">Patente *</label>
                      <input
                        id="fv-patente"
                        type="text"
                        required
                        value={form.patente}
                        onChange={(e) => update("patente", e.target.value)}
                        placeholder="Ej: JWBZ64"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors uppercase"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)] mt-1">
                    Tus datos
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fv-nombre" className="text-xs text-[var(--color-ink-400)]">Nombre *</label>
                      <input
                        id="fv-nombre"
                        type="text"
                        required
                        value={form.nombre}
                        onChange={(e) => update("nombre", e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fv-apellido" className="text-xs text-[var(--color-ink-400)]">Apellido *</label>
                      <input
                        id="fv-apellido"
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
                      <label htmlFor="fv-telefono" className="text-xs text-[var(--color-ink-400)]">Teléfono *</label>
                      <input
                        id="fv-telefono"
                        type="tel"
                        required
                        value={form.telefono}
                        onChange={(e) => update("telefono", e.target.value)}
                        placeholder="+56 9 ..."
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fv-correo" className="text-xs text-[var(--color-ink-400)]">Correo *</label>
                      <input
                        id="fv-correo"
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
                    {sending ? "Enviando..." : "Enviar vehículo"}
                  </button>

                  <p className="text-[10px] text-[var(--color-ink-600)] text-center">
                    Al enviar aceptas los términos y condiciones de consignación.
                  </p>
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
