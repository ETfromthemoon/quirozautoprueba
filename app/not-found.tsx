import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="relative min-h-dvh bg-ink-950 text-ink-50 flex items-center justify-center px-6 overflow-hidden">
      {/* Glow de fondo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(220,38,38,0.15) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10 text-center max-w-lg">
        <div className="flex justify-center mb-8">
          <Logo variant="mark" className="w-16 h-16 opacity-90" />
        </div>

        <p className="text-overline text-accent-500 mb-4">
          <span className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-accent-600" />
            Error 404
            <span className="h-px w-8 bg-accent-600" />
          </span>
        </p>

        <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tighter text-silver-shimmer leading-[0.95]">
          Ruta sin salida
        </h1>

        <p className="mt-5 text-ink-300 text-sm md:text-base font-light leading-relaxed">
          El vehículo o la página que buscas ya no está en el catálogo.
          Volvamos al camino principal.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn-base btn-primary">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M3 12l9-9 9 9M5 10v10h14V10" />
            </svg>
            <span>Ir al catálogo</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
