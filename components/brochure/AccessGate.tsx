import Link from "next/link";
import Logo from "../Logo";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { LockIcon, WhatsAppIcon, ArrowLeftIcon } from "../icons";

type Props = {
  /** Nombre del auto si se conoce, para personalizar el mensaje. */
  carName?: string;
};

/**
 * Pantalla mostrada cuando falta el token o es inválido.
 * No revela ningún dato privado del vehículo.
 */
export default function AccessGate({ carName }: Props) {
  const msg = carName
    ? `Hola, quiero acceder al informe privado del ${carName}. ¿Me compartes el enlace?`
    : "Hola, quiero acceder al informe privado de un vehículo. ¿Me compartes el enlace?";
  const whatsappUrl = getWhatsAppUrl(msg);

  return (
    <main className="relative min-h-dvh bg-ink-950 text-ink-50 flex items-center justify-center overflow-hidden px-4">
      {/* Fondo cinematográfico sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid-overlay" />
        <div className="grain-overlay" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-accent-800/20 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-panel rounded-3xl p-8 md:p-10 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent-600/15 ring-1 ring-accent-500/30">
            <LockIcon className="h-6 w-6 text-accent-500" />
          </div>

          <p className="text-overline text-accent-500 mb-3">Informe privado</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
            Acceso restringido
          </h1>
          <p className="text-sm md:text-base text-ink-300 font-light leading-relaxed mb-8">
            Este informe de peritaje es confidencial y se comparte solo con
            compradores autorizados mediante un enlace personal. Solicítalo a tu
            asesor Quiroz.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-primary w-full"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Solicitar acceso</span>
            </a>
            <Link href="/" className="btn-base btn-silver w-full">
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Volver al catálogo</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 flex justify-center opacity-70">
          <Logo variant="horizontal" className="h-6 w-auto" />
        </div>
      </div>
    </main>
  );
}
