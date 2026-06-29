"use client";

import { useState } from "react";
import Link from "next/link";
import InnerNavbar from "@/components/InnerNavbar";
import InnerFooter from "@/components/InnerFooter";
import { CheckIcon } from "@/components/icons";

// ── Tipos ──────────────────────────────────────────────
const SEGMENTOS_VEHICULO = [
  "Sedan", "Hatchback", "City Car", "SUV", "Camioneta", "Jeep", "Furgón",
] as const;

const PASOS = [
  { num: "01", label: "Operación" },
  { num: "02", label: "Datos personales" },
  { num: "03", label: "Vehículo" },
];

// ── Form data ──────────────────────────────────────────
type FormData = {
  // Paso 1
  tipoOperacion: "Consignación" | "Compra";
  segmentoVehiculo: string;
  participante: string;
  // Paso 2
  fechaIngreso: string;
  nombre: string;
  apellido: string;
  direccion: string;
  comuna: string;
  telefono: string;
  correo: string;
  esPropietario: "" | "Si" | "No";
  nombrePropietario: string;
  // Paso 3
  patente: string;
  segmento: string;
  marca: string;
  modelo: string;
  version: string;
  anio: string;
  cilindrada: string;
  transmision: string;
  color: string;
  combustible: string;
  kilometraje: string;
  servicios: string;
};

const INITIAL: FormData = {
  tipoOperacion: "Consignación",
  segmentoVehiculo: "",
  participante: "",
  fechaIngreso: "",
  nombre: "",
  apellido: "",
  direccion: "",
  comuna: "",
  telefono: "",
  correo: "",
  esPropietario: "",
  nombrePropietario: "",
  patente: "",
  segmento: "",
  marca: "",
  modelo: "",
  version: "",
  anio: "",
  cilindrada: "",
  transmision: "",
  color: "",
  combustible: "",
  kilometraje: "",
  servicios: "",
};

// ── Input classes ──────────────────────────────────────
const inputCls =
  "w-full bg-[var(--color-ink-800)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-ink-600)] focus:outline-none focus:border-[var(--color-accent-600)] transition-colors";
const labelCls = "text-xs text-[var(--color-ink-400)]";

// ── Componente ─────────────────────────────────────────
export default function FormularioVehiculosPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [paso, setPaso] = useState(0);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  // ── Validación por paso ──────────────────────────────
  function validarPaso(p: number): boolean {
    const f = form;
    if (p === 0) {
      if (!f.tipoOperacion || !f.segmentoVehiculo) { setError("Completa todos los campos requeridos."); return false; }
    }
    if (p === 1) {
      if (!f.nombre || !f.apellido || !f.direccion || !f.comuna || !f.telefono || !f.correo || !f.esPropietario) {
        setError("Completa todos los campos requeridos.");
        return false;
      }
      if (f.esPropietario === "No" && !f.nombrePropietario) {
        setError("Indica el nombre del propietario.");
        return false;
      }
    }
    if (p === 2) {
      if (!f.patente || !f.marca || !f.modelo || !f.version || !f.anio || !f.cilindrada || !f.transmision || !f.color || !f.combustible || !f.kilometraje) {
        setError("Completa todos los campos requeridos.");
        return false;
      }
    }
    return true;
  }

  function siguiente() {
    if (validarPaso(paso)) setPaso((p) => Math.min(p + 1, 2));
  }
  function anterior() {
    setError("");
    setPaso((p) => Math.max(p - 1, 0));
  }

  // ── Envío ────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validarPaso(2)) return;
    setSending(true);
    setError("");
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "formulario-vehiculos",
          datos: {
            "Tipo de Operación": form.tipoOperacion,
            "Segmento Vehículo": form.segmentoVehiculo,
            Participante: form.participante,
            "Fecha Ingreso": form.fechaIngreso,
            Nombre: form.nombre,
            Apellido: form.apellido,
            Dirección: form.direccion,
            Comuna: form.comuna,
            Teléfono: form.telefono,
            Correo: form.correo,
            "¿Es propietario?": form.esPropietario,
            "Nombre propietario": form.nombrePropietario,
            Patente: form.patente,
            Segmento: form.segmento,
            Marca: form.marca,
            Modelo: form.modelo,
            Versión: form.version,
            Año: form.anio,
            Cilindrada: form.cilindrada,
            Transmisión: form.transmision,
            Color: form.color,
            Combustible: form.combustible,
            Kilometraje: form.kilometraje,
            "Servicios realizados o requeridos": form.servicios,
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

  // ── Render ───────────────────────────────────────────
  return (
    <>
      <InnerNavbar />

      <main className="bg-[var(--color-ink-950)] min-h-screen text-white">
        {/* ── Hero ── */}
        <section className="relative pt-36 pb-14 md:pt-44 md:pb-18 overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px]"
            style={{ background: "var(--color-accent-600)" }}
            aria-hidden="true"
          />
          <div className="mx-auto max-w-3xl px-4 md:px-8 relative text-center">
            <p className="text-overline text-[var(--color-accent-500)] mb-4">
              {form.tipoOperacion === "Consignación" ? "Consigna tu auto" : "Vende tu auto"}
            </p>
            <h1
              className="text-white mb-4 font-semibold leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
            >
              Ficha de vehículo
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-ink-300)] leading-relaxed max-w-xl mx-auto">
              Completa los datos y te contactaremos para coordinar la visita, fotos y publicación.
            </p>
          </div>
        </section>

        {/* ── Formulario ── */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-2xl px-4 md:px-8">
            <div className="glass-panel rounded-3xl p-7 md:p-9">
              {sent ? (
                /* ── Success ── */
                <div className="flex flex-col items-center text-center py-8 gap-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-accent-700)]/20 flex items-center justify-center">
                    <CheckIcon className="w-6 h-6 text-[var(--color-accent-500)]" />
                  </div>
                  <p className="text-white text-lg font-medium" style={{ fontFamily: "var(--font-syne)" }}>
                    ¡Ficha recibida!
                  </p>
                  <div className="text-[var(--color-ink-400)] text-sm max-w-sm leading-relaxed">
                    <p>
                      {form.tipoOperacion === "Consignación"
                        ? "Estimado, agradecemos su preferencia con Quiroz Automotriz. Su vehículo será gestionado a través de nuestros canales de publicación y redes sociales."
                        : "Gracias por tu interés en vender tu vehículo. Nos comunicaremos a la brevedad para coordinar la visita."}
                    </p>
                    {form.tipoOperacion === "Consignación" && (
                      <p className="mt-3">
                        Al momento de la venta el auto se le pagará mediante transferencia electrónica
                        según el valor acordado entre las partes.
                      </p>
                    )}
                  </div>
                  <Link href="/" className="btn-base btn-primary !py-2.5 !px-5 mt-2">
                    Volver al catálogo
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* ── Progress bar ── */}
                  <div className="flex items-center gap-2 mb-8">
                    {PASOS.map((s, i) => (
                      <div key={s.num} className="flex items-center gap-2 flex-1 last:flex-none">
                        <button
                          type="button"
                          onClick={() => i < paso && setPaso(i)}
                          disabled={i > paso}
                          className={`flex items-center gap-2 text-xs font-semibold tracking-wider uppercase transition-colors ${
                            i === paso
                              ? "text-[var(--color-accent-500)]"
                              : i < paso
                              ? "text-[var(--color-ink-400)] hover:text-white cursor-pointer"
                              : "text-[var(--color-ink-600)]"
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                              i < paso
                                ? "bg-[var(--color-accent-600)] text-white"
                                : i === paso
                                ? "bg-[var(--color-accent-600)] text-white"
                                : "bg-[var(--color-ink-800)] text-[var(--color-ink-500)]"
                            }`}
                          >
                            {i < paso ? "✓" : s.num}
                          </span>
                          <span className="hidden sm:inline">{s.label}</span>
                        </button>
                        {i < 2 && (
                          <div
                            className={`flex-1 h-0.5 rounded ${
                              i < paso ? "bg-[var(--color-accent-600)]" : "bg-[var(--color-ink-800)]"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ── PASO 0: Operación ── */}
                  {paso === 0 && (
                    <div className="flex flex-col gap-5">
                      <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)]">
                        Tipo de operación
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => update("tipoOperacion", "Consignación")}
                          className={`btn-base w-full !py-3 ${
                            form.tipoOperacion === "Consignación" ? "btn-primary" : "btn-ghost border border-white/15"
                          }`}
                        >
                          Consignar
                        </button>
                        <button
                          type="button"
                          onClick={() => update("tipoOperacion", "Compra")}
                          className={`btn-base w-full !py-3 ${
                            form.tipoOperacion === "Compra" ? "btn-primary" : "btn-ghost border border-white/15"
                          }`}
                        >
                          Vender (compra directa)
                        </button>
                      </div>

                      <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)] mt-2">
                        Datos iniciales
                      </p>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="fv-segmento" className={labelCls}>Segmento Vehículo *</label>
                        <select
                          id="fv-segmento"
                          required
                          value={form.segmentoVehiculo}
                          onChange={(e) => update("segmentoVehiculo", e.target.value)}
                          className={`${inputCls} appearance-none`}
                        >
                          <option value="">Seleccionar</option>
                          {SEGMENTOS_VEHICULO.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="fv-participante" className={labelCls}>Participante</label>
                        <input
                          id="fv-participante"
                          type="text"
                          value={form.participante}
                          onChange={(e) => update("participante", e.target.value)}
                          placeholder="Nombre de quien coordina la visita"
                          className={inputCls}
                        />
                      </div>
                    </div>
                  )}

                  {/* ── PASO 1: Datos personales ── */}
                  {paso === 1 && (
                    <div className="flex flex-col gap-4">
                      <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)]">
                        Información personal
                      </p>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="fv-fecha" className={labelCls}>Fecha Ingreso *</label>
                        <input id="fv-fecha" type="date" required value={form.fechaIngreso} onChange={(e) => update("fechaIngreso", e.target.value)} className={inputCls} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-nombre" className={labelCls}>Nombre *</label>
                          <input id="fv-nombre" type="text" required value={form.nombre} onChange={(e) => update("nombre", e.target.value)} placeholder="Tu nombre" className={inputCls} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-apellido" className={labelCls}>Apellido *</label>
                          <input id="fv-apellido" type="text" required value={form.apellido} onChange={(e) => update("apellido", e.target.value)} placeholder="Tu apellido" className={inputCls} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="fv-direccion" className={labelCls}>Dirección *</label>
                        <input id="fv-direccion" type="text" required value={form.direccion} onChange={(e) => update("direccion", e.target.value)} placeholder="Calle, número, depto" className={inputCls} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="fv-comuna" className={labelCls}>Comuna *</label>
                        <input id="fv-comuna" type="text" required value={form.comuna} onChange={(e) => update("comuna", e.target.value)} placeholder="Ej: Viña del Mar" className={inputCls} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-telefono" className={labelCls}>Teléfono *</label>
                          <input id="fv-telefono" type="tel" required value={form.telefono} onChange={(e) => update("telefono", e.target.value)} placeholder="+56 9 ..." className={inputCls} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-correo" className={labelCls}>Correo electrónico *</label>
                          <input id="fv-correo" type="email" required value={form.correo} onChange={(e) => update("correo", e.target.value)} placeholder="correo@ejemplo.cl" className={inputCls} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>¿Es propietario? *</label>
                        <div className="flex gap-3">
                          {["Si", "No"].map((op) => (
                            <button
                              key={op}
                              type="button"
                              onClick={() => update("esPropietario", op)}
                              className={`btn-base flex-1 !py-2.5 ${
                                form.esPropietario === op ? "btn-primary" : "btn-ghost border border-white/15"
                              }`}
                            >
                              {op}
                            </button>
                          ))}
                        </div>
                      </div>
                      {form.esPropietario === "No" && (
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-propietario" className={labelCls}>Nombre propietario *</label>
                          <input id="fv-propietario" type="text" required value={form.nombrePropietario} onChange={(e) => update("nombrePropietario", e.target.value)} placeholder="Nombre completo del propietario" className={inputCls} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── PASO 2: Vehículo ── */}
                  {paso === 2 && (
                    <div className="flex flex-col gap-4">
                      <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink-500)]">
                        Información del vehículo
                      </p>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="fv-patente" className={labelCls}>Patente *</label>
                        <input id="fv-patente" type="text" required value={form.patente} onChange={(e) => update("patente", e.target.value)} placeholder="Ej: JWBZ64" className={`${inputCls} uppercase`} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-s" className={labelCls}>Segmento *</label>
                          <input id="fv-s" type="text" required value={form.segmento} onChange={(e) => update("segmento", e.target.value)} placeholder="Ej: SUV" className={inputCls} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-marca" className={labelCls}>Marca *</label>
                          <input id="fv-marca" type="text" required value={form.marca} onChange={(e) => update("marca", e.target.value)} placeholder="Ej: Toyota" className={inputCls} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-modelo" className={labelCls}>Modelo *</label>
                          <input id="fv-modelo" type="text" required value={form.modelo} onChange={(e) => update("modelo", e.target.value)} placeholder="Ej: Corolla" className={inputCls} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-version" className={labelCls}>Versión *</label>
                          <input id="fv-version" type="text" required value={form.version} onChange={(e) => update("version", e.target.value)} placeholder="Ej: XEI 1.8" className={inputCls} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-anio" className={labelCls}>Año *</label>
                          <input id="fv-anio" type="text" required value={form.anio} onChange={(e) => update("anio", e.target.value)} placeholder="Ej: 2020" className={inputCls} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-cilindrada" className={labelCls}>Cilindrada *</label>
                          <input id="fv-cilindrada" type="text" required value={form.cilindrada} onChange={(e) => update("cilindrada", e.target.value)} placeholder="Ej: 1.8" className={inputCls} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-transmision" className={labelCls}>Transmisión *</label>
                          <input id="fv-transmision" type="text" required value={form.transmision} onChange={(e) => update("transmision", e.target.value)} placeholder="Ej: Automático" className={inputCls} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-color" className={labelCls}>Color *</label>
                          <input id="fv-color" type="text" required value={form.color} onChange={(e) => update("color", e.target.value)} placeholder="Ej: Blanco" className={inputCls} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="fv-combustible" className={labelCls}>Combustible *</label>
                          <input id="fv-combustible" type="text" required value={form.combustible} onChange={(e) => update("combustible", e.target.value)} placeholder="Ej: Bencina" className={inputCls} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="fv-kilometraje" className={labelCls}>Kilometraje *</label>
                        <input id="fv-kilometraje" type="text" required value={form.kilometraje} onChange={(e) => update("kilometraje", e.target.value)} placeholder="Ej: 45.000" className={inputCls} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="fv-servicios" className={labelCls}>Servicios realizados o requeridos</label>
                        <textarea
                          id="fv-servicios"
                          rows={2}
                          value={form.servicios}
                          onChange={(e) => update("servicios", e.target.value)}
                          placeholder="Ej: Cambio de aceite reciente, revisión técnica al día..."
                          className={`${inputCls} resize-none`}
                        />
                      </div>
                    </div>
                  )}

                  {/* ── Error ── */}
                  {error && (
                    <p className="mt-4 text-red-400 text-sm text-center bg-red-400/10 rounded-lg py-2.5 px-4">
                      {error}
                    </p>
                  )}

                  {/* ── Navigation buttons ── */}
                  <div className={`flex gap-3 ${paso === 0 ? "justify-end" : "justify-between"} mt-6`}>
                    {paso > 0 && (
                      <button type="button" onClick={anterior} className="btn-base btn-ghost border border-white/15 !py-3 !px-5">
                        Anterior
                      </button>
                    )}
                    {paso < 2 ? (
                      <button type="button" onClick={siguiente} className="btn-base btn-primary !py-3 !px-8">
                        Siguiente
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={sending}
                        className="btn-base btn-primary w-full !py-3 disabled:opacity-50"
                      >
                        {sending ? "Enviando..." : "Enviar ficha"}
                      </button>
                    )}
                  </div>

                  {paso === 2 && (
                    <p className="text-[10px] text-[var(--color-ink-600)] text-center mt-4">
                      Al enviar aceptas los términos y condiciones de {form.tipoOperacion === "Consignación" ? "consignación" : "compra directa"}.
                    </p>
                  )}
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
