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
                <p className="text-[11px] text-ink-500 font-mono mt-2 truncate">
                  /informe/{row.carId}
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
