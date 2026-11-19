"use client";

import { useEffect, useState } from "react";

export default function GuardarEnlace({ ficha }: { ficha: string }) {
  const [enlace, setEnlace] = useState("");
  const [vigencia, setVigencia] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const firma = /^#(\d{10})\.[a-f0-9]{64}$/.exec(window.location.hash);
    if (!firma || Number(firma[1]) * 1000 <= Date.now()) return;
    setEnlace(window.location.href);
    setVigencia(new Date(Number(firma[1]) * 1000).toLocaleString("es-CL", {
      dateStyle: "long", timeStyle: "short",
    }));
  }, [ficha]);

  if (!enlace) return null;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(enlace);
      setMensaje("Enlace copiado. Pégalo en tus notas para volver más tarde.");
    } catch {
      setMensaje("Usa «Descargar enlace» para guardarlo en tus archivos.");
    }
  }

  const contenido = `Quiroz Automotriz · Fotos de la ficha #${ficha}\n\n${enlace}\n\nVigente hasta el ${vigencia}.\n`;
  return (
    <aside aria-label="Guardar enlace" className="mb-6 text-left">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <button type="button" onClick={copiar}>Copiar enlace para continuar después</button>
        <a className="inline-flex min-h-12 items-center underline" download={`quiroz-fotos-${ficha}.txt`}
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(contenido)}`}>Descargar enlace</a>
      </div>
      <p className="mt-1 text-sm text-zinc-300">Tu enlace privado vence el {vigencia}.</p>
      <p role="status" className="text-sm">{mensaje}</p>
    </aside>
  );
}
