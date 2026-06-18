"use client";

import { useState } from "react";
import { CheckIcon } from "./icons";

type FormData = {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
};

const INITIAL: FormData = { nombre: "", email: "", telefono: "", mensaje: "" };

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
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
          tipo: "contacto",
          datos: {
            Nombre: form.nombre,
            Correo: form.email,
            Teléfono: form.telefono,
            Mensaje: form.mensaje,
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

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center py-6 gap-3">
        <div className="w-12 h-12 rounded-full bg-accent-700/20 flex items-center justify-center">
          <CheckIcon className="w-5 h-5 text-accent-500" />
        </div>
        <p className="text-white text-sm font-medium">Mensaje enviado</p>
        <p className="text-ink-400 text-xs max-w-xs">Te responderemos a la brevedad. Gracias por contactarnos.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-nombre" className="text-xs text-ink-400">Nombre *</label>
          <input
            id="c-nombre"
            type="text"
            required
            value={form.nombre}
            onChange={(e) => update("nombre", e.target.value)}
            placeholder="Tu nombre"
            className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-ink-600 focus:outline-none focus:border-accent-600 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-email" className="text-xs text-ink-400">Correo *</label>
          <input
            id="c-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="correo@ejemplo.cl"
            className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-ink-600 focus:outline-none focus:border-accent-600 transition-colors"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="c-telefono" className="text-xs text-ink-400">Teléfono</label>
        <input
          id="c-telefono"
          type="tel"
          value={form.telefono}
          onChange={(e) => update("telefono", e.target.value)}
          placeholder="+56 9 ..."
          className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-ink-600 focus:outline-none focus:border-accent-600 transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="c-mensaje" className="text-xs text-ink-400">Mensaje *</label>
        <textarea
          id="c-mensaje"
          required
          rows={3}
          value={form.mensaje}
          onChange={(e) => update("mensaje", e.target.value)}
          placeholder="¿En qué podemos ayudarte?"
          className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-ink-600 focus:outline-none focus:border-accent-600 transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="btn-base btn-primary w-full !py-2.5 disabled:opacity-50"
      >
        {sending ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
