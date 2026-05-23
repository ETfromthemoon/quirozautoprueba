import Link from "next/link";
import type { Car } from "@/lib/cars";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import VideoEmbed from "./VideoEmbed";
import Logo from "./Logo";

type Props = { car: Car };

export default function VehicleDetail({ car }: Props) {
  const whatsappMsg = `Hola, me interesa el ${car.brand} ${car.model} ${car.variant ?? ""} ${car.year} (${car.price}). ¿Está disponible para ver?`;
  const whatsappUrl = getWhatsAppUrl(whatsappMsg);

  return (
    <main className="min-h-dvh bg-ink-950 text-ink-50">
      {/* Top bar with back navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="glass-dark rounded-full flex items-center justify-between px-4 md:px-6 py-2 md:py-2.5">
            <Link
              href="/"
              className="flex items-center gap-2 text-ink-200 hover:text-white transition-colors group"
              aria-label="Volver al catálogo"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="text-overline">Catálogo</span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="Quiroz Redcar - Inicio"
            >
              <Logo variant="horizontal" className="h-7 md:h-8 w-auto" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-primary !py-2 !px-4 md:!px-5 !text-[11px]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-white animate-pulse-ring" />
                <span className="relative rounded-full bg-white w-1.5 h-1.5" />
              </span>
              <span className="hidden sm:inline">CONSULTAR</span>
              <span className="sm:hidden">CHAT</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero: Video o imagen del vehículo */}
      <section className="relative h-[70dvh] md:h-[85dvh] w-full overflow-hidden">
        <VideoEmbed
          videoUrl={car.videoUrl}
          posterImage={car.image}
          alt={`${car.brand} ${car.model} ${car.year}`}
          priority
        />

        {/* Gradient + overlay info */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent pointer-events-none" />

        {/* Badge */}
        {car.badge && (
          <div className="absolute top-24 left-4 md:top-28 md:left-10 z-20">
            <div className="rounded-full px-3 md:px-4 py-1 md:py-1.5 bg-accent-600 shadow-lg shadow-accent-900/50">
              <span className="text-overline text-white text-[10px] md:text-[11px]">
                {car.badge}
              </span>
            </div>
          </div>
        )}

        {/* Bottom info — brand, model */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <p className="text-overline mb-3">
              <span className="inline-flex items-center gap-2">
                <span className="h-px w-6 md:w-8 bg-accent-600" />
                <span className="text-accent-500">{car.tagline}</span>
              </span>
            </p>
            <h1 className="font-display text-white leading-[0.92] tracking-tighter">
              <span className="block text-sm md:text-2xl lg:text-3xl font-medium text-ink-200 tracking-[0.2em] uppercase">
                {car.brand}
              </span>
              <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mt-1 md:mt-2">
                {car.model}
              </span>
            </h1>
            {car.variant && (
              <p className="mt-3 md:mt-4 text-silver-300 text-xs md:text-base font-medium tracking-[0.15em] uppercase">
                {car.variant}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Body content */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Description + Tech sheet */}
          <div className="lg:col-span-8 space-y-10 md:space-y-14">
            {/* Description */}
            <div>
              <p className="text-overline text-accent-500 mb-3">Sobre este vehículo</p>
              <p className="text-base md:text-xl text-ink-100 font-light leading-relaxed">
                {car.description}
              </p>
            </div>

            {/* Identification */}
            <Section title="Identificación">
              <SpecGrid>
                <SpecItem label="Marca" value={car.brand} />
                <SpecItem label="Modelo" value={car.model} />
                {car.variant && <SpecItem label="Versión" value={car.variant} />}
                <SpecItem label="Año" value={String(car.year)} />
                <SpecItem label="Kilometraje" value={`${car.km} km`} />
                <SpecItem label="Carrocería" value={car.bodyType} />
                {car.documentation?.color && (
                  <SpecItem label="Color" value={car.documentation.color} />
                )}
              </SpecGrid>
            </Section>

            {/* Engine */}
            {car.engine && (
              <Section title="Motor y rendimiento">
                <SpecGrid>
                  <SpecItem label="Combustible" value={car.fuel} />
                  {car.engine.displacement && (
                    <SpecItem label="Cilindrada" value={car.engine.displacement} />
                  )}
                  {car.engine.cylinders && (
                    <SpecItem
                      label="Cilindros"
                      value={String(car.engine.cylinders)}
                    />
                  )}
                  {car.power && <SpecItem label="Potencia" value={car.power} />}
                  <SpecItem label="Transmisión" value={car.transmission} />
                  {car.drivetrain && (
                    <SpecItem label="Tracción" value={car.drivetrain} />
                  )}
                  {car.engine.consumptionCity && (
                    <SpecItem
                      label="Consumo ciudad"
                      value={car.engine.consumptionCity}
                    />
                  )}
                  {car.engine.consumptionRoad && (
                    <SpecItem
                      label="Consumo carretera"
                      value={car.engine.consumptionRoad}
                    />
                  )}
                  {car.engine.emissions && (
                    <SpecItem label="Emisiones" value={car.engine.emissions} />
                  )}
                </SpecGrid>
              </Section>
            )}

            {/* Equipment */}
            {car.equipment && car.equipment.length > 0 && (
              <Section title="Equipamiento">
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {car.equipment.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm md:text-base text-ink-200">
                      <svg
                        className="w-5 h-5 text-accent-500 shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span className="font-light leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Documentation */}
            {car.documentation && (
              <Section title="Documentación y estado">
                <SpecGrid>
                  {car.documentation.ownerType && (
                    <SpecItem label="Propietario" value={car.documentation.ownerType} />
                  )}
                  {car.documentation.permit && (
                    <SpecItem
                      label="Permiso circulación"
                      value={car.documentation.permit}
                    />
                  )}
                  {car.documentation.technicalReview && (
                    <SpecItem
                      label="Revisión técnica"
                      value={car.documentation.technicalReview}
                    />
                  )}
                  {car.documentation.doors && (
                    <SpecItem
                      label="Puertas"
                      value={String(car.documentation.doors)}
                    />
                  )}
                  {car.documentation.seats && (
                    <SpecItem
                      label="Asientos"
                      value={String(car.documentation.seats)}
                    />
                  )}
                </SpecGrid>
              </Section>
            )}
          </div>

          {/* Right: Sticky price card */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="glass-panel rounded-2xl p-6 md:p-7">
                <div className="border-b border-white/15 pb-5 mb-5">
                  <p className="text-overline text-accent-500 mb-2">Precio</p>
                  <p className="text-price text-price-panel text-white">
                    {car.price}
                  </p>
                  <p className="text-xs text-ink-400 mt-2 font-light">
                    Consulta opciones de financiamiento
                  </p>
                </div>

                {/* Quick specs */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-6">
                  <MiniSpec label="Año" value={String(car.year)} />
                  <MiniSpec label="KM" value={car.km} />
                  <MiniSpec label="Combustible" value={car.fuel} />
                  <MiniSpec label="Transmisión" value={car.transmission} />
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-base btn-primary w-full"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>CONSULTAR AHORA</span>
                  </a>
                  <a
                    href="tel:+56993431571"
                    className="btn-base btn-silver w-full"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    <span>LLAMAR</span>
                  </a>
                </div>
              </div>

              {/* Visit info */}
              <div className="glass-light rounded-2xl p-5">
                <p className="text-overline text-accent-500 mb-2">Visítanos</p>
                <p className="text-sm text-white font-medium">
                  Av. Bosques de Montemar #65
                </p>
                <p className="text-xs text-ink-400 mb-2">Edificio OFC, oficina 203</p>
                <p className="text-sm text-white font-medium">Hontaneda 2615</p>
                <p className="text-xs text-ink-400">Valparaíso, Chile</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom: back to catalog */}
        <div className="mt-16 md:mt-24 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="btn-ghost"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Volver al catálogo</span>
          </Link>
          <p className="text-xs text-ink-500 font-light tracking-widest">
            QUIROZ REDCAR · COLECCIÓN PREMIUM
          </p>
        </div>
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl md:text-2xl font-bold text-white mb-5 md:mb-6 tracking-tight">
        <span className="inline-flex items-center gap-3">
          <span className="h-px w-8 bg-accent-600" />
          {title}
        </span>
      </h2>
      {children}
    </div>
  );
}

function SpecGrid({ children }: { children: React.ReactNode }) {
  return (
    <dl className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">{children}</dl>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/10 pb-3">
      <dt className="text-overline text-ink-500 mb-1.5">{label}</dt>
      <dd className="font-display text-base md:text-lg text-white font-semibold tracking-tight">
        {value}
      </dd>
    </div>
  );
}

function MiniSpec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-overline text-ink-500 mb-1">{label}</p>
      <p className="font-display text-sm text-white font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}
