import Link from "next/link";
import type { Car } from "@/lib/cars";
import { getGalleryImages } from "@/lib/cars";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import VideoEmbed from "./VideoEmbed";
import VehicleGallery from "./VehicleGallery";
import Logo from "./Logo";
import ContactWhatsAppButton from "./ContactWhatsAppButton";
import { WhatsAppIcon, PhoneIcon, ArrowLeftIcon, CheckIcon } from "./icons";

type Props = { car: Car };

export default function VehicleDetail({ car }: Props) {
  const whatsappMsg = `Hola, me interesa el ${car.brand} ${car.model} ${car.variant ?? ""} ${car.year} (${car.price}). ¿Está disponible para ver?`;
  const marcoWhatsAppUrl = getWhatsAppUrl(whatsappMsg, "marco");
  const danielWhatsAppUrl = getWhatsAppUrl(whatsappMsg, "daniel");
  const galleryImages = getGalleryImages(car);

  return (
    <main className="min-h-dvh bg-ink-950 text-ink-50">
      {/* Top bar with back navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="glass-dark flex min-w-0 items-center justify-between gap-1.5 rounded-full px-2 py-2 sm:gap-2 sm:px-3 md:px-6 md:py-2.5">
            <Link
              href="/"
              className="flex min-w-0 max-w-[5.5rem] shrink-0 items-center gap-1.5 text-ink-200 transition-colors group hover:text-white sm:max-w-none sm:gap-2"
              aria-label="Volver al catálogo"
            >
              <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-overline hidden sm:inline">Catálogo</span>
            </Link>

            <Link
              href="/"
              className="flex min-w-0 max-w-[5.5rem] items-center justify-center sm:max-w-[8rem] md:max-w-none"
              aria-label="Quiroz Redcar - Inicio"
            >
              <Logo variant="horizontal" className="h-6 w-auto max-w-full md:h-8 md:max-w-none" />
            </Link>

            <ContactWhatsAppButton
              className="relative flex h-10 max-w-[5.25rem] shrink-0 items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-accent-600 to-accent-500 px-3 text-[11px] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_0_24px_-4px_var(--color-accent-500)] sm:max-w-none md:h-auto md:px-5 md:py-2"
              mobileLabel="Chat"
              message={whatsappMsg}
            />
          </div>
        </div>
      </header>

      {/* Hero: Video o imagen del vehículo */}
      <section className="relative h-[70dvh] md:h-[85dvh] w-full overflow-hidden">
        <VideoEmbed
          videoUrls={car.videoUrls ?? (car.videoUrl ? [car.videoUrl] : [])}
          posterImage={car.videoPoster ?? car.image}
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
              <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mt-1 md:mt-2 break-words overflow-hidden">
                {car.model}
              </span>
            </h1>
            {car.variant && (
              <p className="mt-3 md:mt-4 text-silver-300 text-xs md:text-base font-medium tracking-[0.15em] uppercase break-words">
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
              <p className="whitespace-pre-line text-base md:text-xl text-ink-100 font-light leading-relaxed break-words">
                {car.description}
              </p>
            </div>

            {/* Service banners */}
            <div>
              <p className="text-overline text-accent-500 mb-4">Servicios</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ServiceBanner
                  href={`/financiamiento?vehiculo=${encodeURIComponent(`${car.brand} ${car.model} ${car.year}`)}`}
                  label="Financiamiento"
                  icon="financing"
                />
                <ServiceBanner
                  href={`/seguros?vehiculo=${encodeURIComponent(`${car.brand} ${car.model} ${car.year}`)}`}
                  label="Seguros"
                  icon="insurance"
                />
                <ServiceBanner
                  href={`/reserva?vehiculo=${encodeURIComponent(`${car.brand} ${car.model} ${car.year}`)}`}
                  label="Reservar"
                  icon="reserve"
                />
                <ServiceBanner
                  href="/vender-consignar"
                  label="Vender / Consignar"
                  icon="sell"
                />
              </div>
            </div>

            {/* Galería */}
            <Section title="Galería">
              <VehicleGallery
                images={galleryImages}
                alt={`${car.brand} ${car.model} ${car.year}`}
              />
            </Section>

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

            {/* Categorías editoriales del CMS, visibles sin perder información. */}
            {car.cmsCategories && car.cmsCategories.length > 0 && (
              <Section title="Características informadas">
                <ul className="flex flex-wrap gap-2.5" aria-label="Características publicadas en el CMS">
                  {car.cmsCategories.map((category) => (
                    <li
                      key={category}
                      className="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs md:text-sm text-ink-100"
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

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
                      <CheckIcon className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
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
                    href={marcoWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-base btn-primary w-full"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp Marco</span>
                  </a>
                  <a
                    href={danielWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-base btn-silver w-full"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp Daniel</span>
                  </a>
                  <a
                    href="tel:+56993431571"
                    className="btn-base btn-silver w-full"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    <span>Llamar</span>
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
            <ArrowLeftIcon className="w-3 h-3" />
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
      <dt className="text-overline text-ink-400 mb-1.5">{label}</dt>
      <dd className="font-display text-base md:text-lg text-white font-semibold tracking-tight">
        {value}
      </dd>
    </div>
  );
}

function ServiceBanner({ href, label, icon }: { href: string; label: string; icon: "financing" | "insurance" | "reserve" | "sell" }) {
  const icons: Record<string, string> = {
    financing: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    insurance: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
    reserve: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
    sell: "M17.5 6.5a1 1 0 0 1-1 1h-9a1 1 0 0 1 0-2h9a1 1 0 0 1 1 1zM21 12l-4 4v-3H3v-2h14V8l4 4z",
  };
  return (
    <a
      href={href}
      className="glass-light rounded-xl p-3 md:p-4 flex flex-col items-center gap-2 text-center hover:bg-white/[0.12] hover:-translate-y-0.5 transition-all group"
    >
      <div className="w-8 h-8 rounded-full bg-accent-600/15 flex items-center justify-center">
        <svg className="w-4 h-4 text-accent-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d={icons[icon]} />
        </svg>
      </div>
      <span className="text-[10px] md:text-[11px] text-ink-300 font-medium tracking-wide uppercase group-hover:text-white transition-colors">
        {label}
      </span>
    </a>
  );
}

function MiniSpec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-overline text-ink-400 mb-1">{label}</p>
      <p className="font-display text-sm text-white font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}
