"use client";

import { useEffect, useState } from "react";

export default function GuardarEnlace({ ficha }: { ficha: string }) {
  const [enlace, setEnlace] = useState("");
  const [vigencia, setVigencia] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const firma = /^#(\d{10})\.[a-f0-9]{64}$/.exec(window.location.hash);
    if (!firma || Number(firma[1]) * 1000 <= Date.now()) return;
    setEnlace(new URL(`/consignacion/fotos?ficha=${ficha}${firma[0]}`, window.location.origin).href);
    setVigencia(new Date(Number(firma[1]) * 1000).toLocaleString("es-CL", {
      dateStyle: "long", timeStyle: "short",
    }));
  }, [ficha]);

  if (!enlace) return null;

  async function compartir() {
    try {
      await navigator.share({ title: `Fotos de la ficha #${ficha}`, url: enlace });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setMensaje("Puedes copiar el enlace para enviárselo al cliente.");
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(enlace);
      setMensaje("Enlace copiado. Puedes guardarlo o enviárselo al cliente.");
    } catch {
      setMensaje("Usa «Descargar enlace» para guardarlo en tus archivos.");
    }
  }

  const contenido = `Quiroz Automotriz · Fotos de la ficha #${ficha}\n\n${enlace}\n\nVigente hasta el ${vigencia}.\n`;
  return (
    <aside aria-label="Guardar enlace" className="mt-5 rounded-xl border border-white/15 bg-white/5 p-4 text-left">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <button type="button" className="btn-base btn-silver !whitespace-normal" onClick={copiar}>Copiar enlace para continuar después</button>
        {typeof navigator.share === "function" && (
          <button type="button" className="btn-base btn-silver" onClick={compartir}>Compartir enlace</button>
        )}
        <a className="inline-flex min-h-12 items-center underline" download={`quiroz-fotos-${ficha}.txt`}
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(contenido)}`}>Descargar enlace</a>
      </div>
      <p className="mt-1 text-sm text-zinc-300">Tu enlace privado vence el {vigencia}.</p>
      <p role="status" className="text-sm">{mensaje}</p>
    </aside>
  );
}
