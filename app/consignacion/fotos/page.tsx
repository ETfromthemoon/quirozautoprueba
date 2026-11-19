import type { Metadata } from "next";
import Script from "next/script";
import { cms } from "@/lib/consignaciones";
import GuardarEnlace from "./GuardarEnlace";
import Logo from "@/components/Logo";
import styles from "./captura.module.css";

export const metadata: Metadata = { title: "Fotos de tu vehículo", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function Fotos({ searchParams }: { searchParams: Promise<{ ficha?: string }> }) {
  const { ficha } = await searchParams;
  const assets = new URL("/wp-content/plugins/quiroz-consignaciones/", cms).href;
  if (!ficha || !/^\d{1,12}$/.test(ficha)) {
    return <main className="p-8"><h1>Fotos de tu vehículo</h1><p>Abre el enlace de tu ficha para retomar las fotos.</p><a href="/formulario-vehiculos">Iniciar una consignación</a></main>;
  }
  return (
    <main id="captura" data-api="/api/consignacion/fotos" data-ficha={ficha} data-ref={assets + "referencias/"}
      className={styles.screen}>
      <div className="mx-auto max-w-2xl">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-3">
          <Logo variant="horizontal" className="h-12 w-auto max-w-full" />
          <span className="text-sm tabular-nums text-zinc-300">Ficha #{ficha}</span>
        </header>
        <h1 className={styles.title}>Fotos de tu vehículo</h1>
        <p id="estado" role="status" aria-live="polite" className={styles.status}>Cargando tu consignación…</p>
        <section id="paso" className={styles.panel} hidden>
          <label htmlFor="indice" className="mr-2 font-semibold">Toma</label><select id="indice" className="min-h-11 max-w-full rounded-lg border border-white/20 bg-zinc-900 px-3" />
          <h2 id="titulo" className="mt-4 text-2xl font-semibold" /><p id="guia" className="mt-1 text-zinc-300" />
          <figure><img id="ejemplo" alt="" /><figcaption>Foto de referencia</figcaption></figure>
          <figure id="vista" hidden><img id="preview" alt="Tu fotografía" /><figcaption>Tu fotografía</figcaption></figure>
          <div className="flex flex-wrap gap-2"><button id="camara" className="btn-base btn-primary">Tomar foto</button><button id="galeria" className="btn-base btn-silver">Elegir de la galería</button></div>
          <input hidden id="archivoCamara" type="file" accept="image/*" capture="environment" />
          <input hidden id="archivoGaleria" type="file" accept="image/*" />
          <button id="siguiente" className="btn-base btn-silver mt-3" hidden>Siguiente toma</button>
        </section>
        <button id="reintentar" className="btn-base btn-silver mt-3" hidden>Reintentar</button><button id="enviar" className="btn-base btn-primary mt-3" hidden>Finalizar consignación</button>
        <GuardarEnlace key={ficha} ficha={ficha} />
      </div>
      <Script src={assets + "captura.js?v=1.2.0"} strategy="afterInteractive" />
    </main>
  );
}
