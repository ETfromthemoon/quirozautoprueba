import Link from "next/link";
import Logo from "../Logo";
import CopyLinkButton from "./CopyLinkButton";
import { EyeIcon, LockIcon, ArrowLeftIcon } from "../icons";

export type AdminRow = {
  carId: string;
  name: string;
  modulos: number;
  /** URL privada completa (con token), armada en el servidor. */
  url: string;
  complete: boolean;
  missing: string[];
};

type Props = { rows: AdminRow[] };

/**
 * Vista del panel interno de informes. Solo se renderiza tras validar
 * la clave de admin en el servidor (app/informe-admin/page.tsx).
 */
export default function BrochureAdmin({ rows }: Props) {
  return (
    <main className="min-h-dvh bg-ink-950 text-ink-50 px-4 py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <Logo variant="horizontal" className="h-8 w-auto" />
          <Link href="/" className="btn-ghost">
            <ArrowLeftIcon className="w-3 h-3" />
            <span>Inicio</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <LockIcon className="w-4 h-4 text-accent-500" />
          <p className="text-overline text-accent-500">Panel interno</p>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Informes privados
        </h1>
        <p className="mt-3 text-sm text-ink-300 font-light max-w-xl">
          Copia el enlace privado de cada vehículo y compártelo por WhatsApp solo
          con compradores autorizados. Quien tenga el enlace verá el informe
          completo.
        </p>

        <div className="glass-light mt-6 rounded-2xl border border-white/10 p-4 text-sm text-ink-200">
          <p className="font-semibold text-white">Cómo compartir un catálogo</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-400">
            Ubica el vehículo, usa <strong className="text-ink-200">Ver</strong> para revisarlo
            y luego <strong className="text-ink-200">Copiar enlace</strong> para enviarlo al comprador.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {rows.map((row) => (
            <div
              key={row.carId}
              className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg text-white font-bold tracking-tight truncate">
                  {row.name}
                </p>
                <p className="text-xs text-ink-400 font-light mt-0.5">
                  <span className="text-ink-200">{row.modulos}</span> de 9 módulos informados
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${row.complete ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-200"}`}>
                    {row.complete ? "Listo para compartir" : "Catálogo en preparación"}
                  </span>
                  {!row.complete && row.missing.length > 0 && (
                    <span className="text-[10px] text-ink-500">
                      Faltan {row.missing.length} elementos obligatorios
                    </span>
                  )}
                </div>
                <p className="mt-3 break-all rounded-lg bg-black/20 px-3 py-2 font-mono text-[10px] leading-relaxed text-ink-400">
                  {row.url}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={row.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-silver !py-2 !px-4 !text-[12px]"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>Ver</span>
                </a>
                <CopyLinkButton url={row.url} />
              </div>
            </div>
          ))}
        </div>

        {rows.length === 0 && (
          <p className="mt-8 text-sm text-ink-400 font-light">
            Aún no hay informes cargados.
          </p>
        )}
      </div>
    </main>
  );
}
