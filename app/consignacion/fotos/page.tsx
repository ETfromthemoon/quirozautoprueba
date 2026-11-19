import type { Metadata } from "next";
import Script from "next/script";
import { cms } from "@/lib/consignaciones";

export const metadata: Metadata = { title: "Fotos de tu vehículo", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function Fotos({ searchParams }: { searchParams: Promise<{ ficha?: string }> }) {
  const { ficha } = await searchParams;
  const assets = new URL("/wp-content/plugins/quiroz-consignaciones/", cms).href;
  if (!ficha || !/^\d{1,12}$/.test(ficha)) {
    return <main className="p-8"><h1>Fotos de tu vehículo</h1><p>Abre el enlace de tu ficha para retomar las fotos.</p><a href="/formulario-vehiculos">Iniciar una consignación</a></main>;
  }
  return (
    <main id="captura" data-api="/api/consignacion/fotos" data-ficha={ficha} data-ref={assets + "referencias/"}
      className="mx-auto min-h-screen max-w-2xl px-5 py-8 text-white [&_button]:min-h-12 [&_button]:cursor-pointer [&_button]:rounded-lg [&_button]:border [&_button]:border-white/30 [&_button]:px-4 [&_button]:py-2 [&_button:disabled]:opacity-50 [&_figure]:my-5 [&_figcaption]:mt-1 [&_img]:max-h-[42vh] [&_img]:w-full [&_img]:rounded-lg [&_img]:object-contain">
      <header className="border-b border-white/20 pb-3">Quiroz Automotriz · Ficha #{ficha}</header>
      <h1 className="mt-6 text-3xl font-semibold">Fotos de tu vehículo</h1>
      <p id="estado" role="status" aria-live="polite" className="my-4 rounded-lg bg-white/10 p-3">Cargando tu consignación…</p>
      <section id="paso" hidden>
        <label htmlFor="indice">Toma </label><select id="indice" className="rounded-md bg-zinc-800 p-2" />
        <h2 id="titulo" className="mt-5 text-2xl font-semibold" /><p id="guia" className="mt-2" />
        <figure><img id="ejemplo" alt="" /><figcaption>Foto de referencia</figcaption></figure>
        <figure id="vista" hidden><img id="preview" alt="Tu fotografía" /><figcaption>Tu fotografía</figcaption></figure>
        <div className="flex flex-wrap gap-2"><button id="camara" className="bg-red-800">Tomar foto</button><button id="galeria">Elegir de la galería</button></div>
        <input hidden id="archivoCamara" type="file" accept="image/*" capture="environment" />
        <input hidden id="archivoGaleria" type="file" accept="image/*" />
        <button id="siguiente" hidden>Siguiente toma</button>
      </section>
      <button id="reintentar" hidden>Reintentar</button><button id="enviar" className="mt-3 bg-red-800" hidden>Finalizar consignación</button>
      <p className="mt-6 text-sm text-zinc-400">Guarda este enlace si quieres continuar más tarde.</p>
      <Script src={assets + "captura.js?v=1.2.0"} strategy="afterInteractive" />
    </main>
  );
}
