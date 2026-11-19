"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import GuardarEnlace from "./GuardarEnlace";

export default function ConfirmacionGuardado({ ficha }: { ficha: string }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [ruta, setRuta] = useState("");
  const [vigente, setVigente] = useState<boolean | null>(null);
  const titulo = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const firma = /^#(\d{10})\.[a-f0-9]{64}$/.exec(window.location.hash);
    const valido = !!firma && Number(firma[1]) * 1000 > Date.now();
    setVigente(valido);
    if (valido) {
      setRuta(`/consignacion/fotos?ficha=${ficha}${firma[0]}`);
      dialogo.current?.showModal();
    }
  }, [ficha]);

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 p-4 text-white">
      <section className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8">
        {vigente === true ? (
          <>
            <h1 ref={titulo} tabIndex={-1} className="text-2xl font-semibold">Consignación guardada</h1>
            <p className="mt-3">Ficha #{ficha}. Puedes cerrar esta página y agregar las fotos más adelante con tu enlace privado.</p>
            <GuardarEnlace ficha={ficha} />
            <a href={ruta} className="btn-base btn-primary mt-5">Agregar fotos</a>
          </>
        ) : <p role="status">{vigente === false ? "El enlace está incompleto o vencido. Pide a Quiroz un enlace vigente para tu ficha." : "Abriendo tu ficha…"}</p>}
        <Link href="/" className="mt-3 flex min-h-11 w-fit items-center text-sm underline">Volver al inicio de Quiroz</Link>
      </section>
      <dialog ref={dialogo} aria-labelledby="guardada-titulo" aria-describedby="guardada-opciones"
        onClose={() => titulo.current?.focus()}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-[27rem] overflow-y-auto rounded-[2rem] border border-white/10 bg-linear-to-b from-zinc-800 to-zinc-900 px-6 pt-4 pb-5 text-left text-white shadow-2xl backdrop:bg-black/65 backdrop:backdrop-blur-sm sm:px-8">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-wide text-zinc-400">Ficha #{ficha}</p>
          <button type="button" aria-label="Cerrar" onClick={() => dialogo.current?.close()}
            className="-mr-2 grid size-11 place-items-center rounded-full text-zinc-300 hover:text-white">
            <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-white/10 text-xl leading-none">×</span>
          </button>
        </div>
        <h2 id="guardada-titulo" className="mt-3 text-[1.75rem] leading-tight font-semibold tracking-tight">Consignación guardada</h2>
        <p id="guardada-opciones" className="mt-2 text-[0.95rem] leading-relaxed text-zinc-300">Tus datos están listos. Puedes tomar las fotos ahora o volver más tarde con tu enlace.</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1">
          <a href={ruta} className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">Tomar fotos ahora</a>
          <button type="button" className="min-h-11 rounded-full px-2 text-sm text-zinc-200 hover:text-white" onClick={() => dialogo.current?.close()}>Más tarde</button>
        </div>
        <details className="group mt-5 border-y border-white/10">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium [&::-webkit-details-marker]:hidden">
            Guardar o compartir enlace
            <span aria-hidden="true" className="mr-1 size-2 rotate-45 border-r border-b border-zinc-400 group-open:rotate-[225deg]" />
          </summary>
          <GuardarEnlace ficha={ficha} compacto />
        </details>
        <Link href="/" className="mt-1 inline-flex min-h-11 items-center rounded-md text-xs text-zinc-400 hover:text-white">Volver al inicio de Quiroz</Link>
      </dialog>
    </main>
  );
}
