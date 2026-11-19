"use client";

import { useEffect, useRef, useState } from "react";
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
      </section>
      <dialog ref={dialogo} aria-labelledby="guardada-titulo" aria-describedby="guardada-opciones"
        onClose={() => titulo.current?.focus()}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl border border-white/20 bg-zinc-900 p-5 text-left text-white shadow-2xl backdrop:bg-black/75 sm:p-8">
        <p className="mb-2 text-sm text-zinc-300">Ficha #{ficha}</p>
        <h2 id="guardada-titulo" className="text-2xl font-semibold">Los datos de tu consignación ya están guardados</h2>
        <p id="guardada-opciones" className="my-4 text-zinc-200">¿Quieres tomar las fotos ahora o continuar después? Guarda el enlace si vas a volver más tarde o a enviárselo al cliente.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <a href={ruta} className="btn-base btn-primary !whitespace-normal text-center">Tomar fotos ahora</a>
          <button type="button" className="btn-base btn-silver !whitespace-normal" onClick={() => dialogo.current?.close()}>Omitir fotos por ahora</button>
        </div>
        <GuardarEnlace ficha={ficha} />
      </dialog>
    </main>
  );
}
