"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { reports } from "@/lib/brochures";
import { cars } from "@/lib/cars";
import Logo from "../Logo";
import { CopyIcon, CheckIcon, EyeIcon, LockIcon, ArrowLeftIcon } from "../icons";

type Row = {
  carId: string;
  name: string;
  token: string;
  estado: string;
};

export default function BrochureAdmin() {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const rows: Row[] = Object.values(reports).map((r) => {
    const car = cars.find((c) => c.id === r.carId);
    return {
      carId: r.carId,
      name: car ? `${car.brand} ${car.model} ${car.year}` : r.carId,
      token: r.accessToken,
      estado: r.verdict.estado,
    };
  });

  const linkFor = (row: Row) =>
    `${origin || ""}/informe/${row.carId}?k=${row.token}`;

  async function copy(row: Row) {
    try {
      await navigator.clipboard.writeText(linkFor(row));
      setCopied(row.carId);
      setTimeout(() => setCopied((c) => (c === row.carId ? null : c)), 2000);
    } catch {
      // Fallback silencioso: seleccionar no disponible → no romper la UI.
      setCopied(null);
    }
  }

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
                  Estado: <span className="text-ink-200">{row.estado}</span>
                </p>
                <p className="text-[11px] text-ink-500 font-mono mt-2 truncate">
                  /informe/{row.carId}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/informe/${row.carId}?k=${row.token}`}
                  target="_blank"
                  className="btn-base btn-silver !py-2 !px-4 !text-[12px]"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>Ver</span>
                </Link>
                <button
                  type="button"
                  onClick={() => copy(row)}
                  className="btn-base btn-primary !py-2 !px-4 !text-[12px]"
                >
                  {copied === row.carId ? (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-4 h-4" />
                      <span>Copiar link</span>
                    </>
                  )}
                </button>
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
