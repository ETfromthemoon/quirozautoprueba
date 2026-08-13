"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function VehicleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    const key = `vehicle-retry:${window.location.pathname}`;
    const attempts = Number(window.sessionStorage.getItem(key) ?? "0");
    if (attempts >= 3) return;
    const nextAttempt = attempts + 1;
    window.sessionStorage.setItem(key, String(nextAttempt));
    const timer = window.setTimeout(() => reset(), nextAttempt * 1200);
    return () => window.clearTimeout(timer);
  }, [reset]);

  return (
    <main className="grid min-h-screen place-items-center bg-ink-950 px-6 text-center text-white">
      <div className="max-w-md">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent-500">Actualizando información</p>
        <h1 className="font-display text-3xl font-bold">Estamos cargando este vehículo</h1>
        <p className="mt-4 text-sm leading-6 text-ink-300">
          La ficha se volverá a intentar automáticamente. No necesitas regresar al catálogo.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn-base btn-primary justify-center">
            Reintentar ahora
          </button>
          <Link href="/" className="btn-base btn-silver justify-center">
            Ver otros vehículos
          </Link>
        </div>
      </div>
    </main>
  );
}
