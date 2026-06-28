"use client";

import { useState } from "react";
import Link from "next/link";
import InnerNavbar from "@/components/InnerNavbar";
import InnerFooter from "@/components/InnerFooter";
import { CheckIcon, ArrowRightIcon } from "@/components/icons";

type FormData = {
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  correo: string;
  vehiculo: string;
};

const INITIAL_FORM: FormData = {
  nombre: "",
  apellido: "",
  rut: "",
  telefono: "",
  correo: "",
  vehiculo: "",
};

export default function ReservaPage() {
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
          tipo: "reserva",
          datos: {
            "Vehículo de interés": form.vehiculo || "No especificado",
            Nombre: form.nombre,
            Apellido: form.apellido,
            Rut: form.rut,
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
            className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full opacity-[0.05] blur-[100px]"
            style={{ background: "var(--color-accent-600)" }}
            aria-hidden="true"
          />
          <div className="mx-auto max-w-7xl px-4 md:px-8 relative">
            <div className="max-w-3xl">
              <p className="text-overline text-[var(--color-accent-500)] mb-4">
                Reserva tu auto
              </p>
              <h1
                className="text-white mb-6 font-semibold leading-tight tracking-tight"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
              >
                Asegura tu compra ahora
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-ink-300)] leading-relaxed max-w-2xl">
                Reserva tu vehículo con $200.000 y garantizamos que nadie más
                lo comprará mientras decides.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-[var(--color-ink-900)]/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
              <div className="flex flex-col gap-6 lg:pt-4">
                <h2
                  className="text-white leading-tight font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                >
                  ¿Cómo funciona la reserva?
                </h2>
                <div className="flex flex-col gap-4 text-[var(--color-ink-400)] text-sm leading-relaxed">
                  <p>
                    Al reservar tu vehículo, la publicación se elimina de todas
                    las plataformas y queda apartado a tu nombre.
                  </p>
                  <p>
                    La reserva de <strong className="text-white">$200.000</strong> se
                    descuenta del precio final de compra. Si el vehículo no está en
                    las condiciones informadas, el monto se devuelve en su totalidad.
                  </p>
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-7 md:p-9">
                {sent ? (
                  <div className="flex flex-col items-center text-center py-8 gap-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-accent-700)]/20 flex items-center justify-center">
                      <CheckIcon className="w-6 h-6 text-[var(--color-accent-500)]" />
                    </div>
                    <p className="text-white text-lg font-medium" style={{ fontFamily: "var(--font-syne)" }}>
                      ¡Reserva solicitada!
                    </p>
                    <div className="text-[var(--color-ink-400)] text-sm max-w-sm leading-relaxed">
                      <p className="mb-3">
                        Muchas felicidades, hemos recibido conforme su reserva y con gusto
                        esperamos la fecha que usted nos comunique para la entrega del vehículo.
                      </p>
                      <p className="mb-3">
                        La publicación de venta del vehículo será eliminada de todas las
                        plataformas contratadas y será modificada como reservada a su nombre.
                      </p>
                      <p>
                        Si el vehículo no se encuentra en las condiciones informadas, la reserva
                        de $200.000 se devuelve en su totalidad.
                      </p>
                    </div>
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
                        <label htmlFor="r-nombre" className="text-xs text-[var(--color-ink-400)]">Nombre *</label>
                        <input
                          id="r-nombre"
                          type="text"
                          required
                          value={form.nombre}
                          onChange={(e) => update("nombre", e.target.value)}
                          placeholder="Tu nombre"
                          className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="r-apellido" className="text-xs text-[var(--color-ink-400)]">Apellido *</label>
                        <input
                          id="r-apellido"
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
                      <label htmlFor="r-rut" className="text-xs text-[var(--color-ink-400)]">Rut *</label>
                      <input
                        id="r-rut"
                        type="text"
                        required
                        value={form.rut}
                        onChange={(e) => update("rut", e.target.value)}
                        placeholder="12.345.678-9"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="r-vehiculo" className="text-xs text-[var(--color-ink-400)]">Vehículo de interés</label>
                      <input
                        id="r-vehiculo"
                        type="text"
                        value={form.vehiculo}
                        onChange={(e) => update("vehiculo", e.target.value)}
                        placeholder="Ej: BMW 420 2024"
                        className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="r-telefono" className="text-xs text-[var(--color-ink-400)]">Teléfono *</label>
                        <input
                          id="r-telefono"
                          type="tel"
                          required
                          value={form.telefono}
                          onChange={(e) => update("telefono", e.target.value)}
                          placeholder="+56 9 ..."
                          className="w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="r-correo" className="text-xs text-[var(--color-ink-400)]">Correo *</label>
                        <input
                          id="r-correo"
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
                      {sending ? "Enviando..." : "Solicitar reserva"}
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
              ¿Quieres ver los vehículos disponibles para reservar?
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
