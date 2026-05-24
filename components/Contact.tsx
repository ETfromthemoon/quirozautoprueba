import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import Logo from "./Logo";

export default function Contact() {
  const whatsappUrl = getWhatsAppUrl(
    "Hola, me gustaría agendar una visita o recibir más información del catálogo."
  );

  return (
    <section
      id="contacto"
      className="showcase-section relative bg-ink-950"
      aria-label="Contacto"
    >
      {/* Subtle background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=2400&q=90"
          alt=""
          fill
          className="object-cover opacity-25"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/85 to-ink-950" />
      </div>

      {/* Red glow accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 h-full overflow-y-auto md:overflow-visible flex items-center justify-center px-4 sm:px-6 py-10 md:py-0">
        <div className="max-w-5xl w-full">
          {/* Logo top */}
          <div className="flex justify-center mb-5 md:mb-10">
            <Logo variant="mark" className="w-12 h-12 md:w-16 md:h-16 opacity-90" />
          </div>

          <div className="text-center overflow-hidden">
            <p className="text-overline text-accent-500 mb-3 md:mb-6">
              <span className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-accent-600" />
                Visítanos
                <span className="h-px w-8 bg-accent-600" />
              </span>
            </p>
            <h2 className="font-display leading-[0.92] tracking-tighter">
              <span className="block font-medium text-ink-200 text-[11px] sm:text-sm tracking-[0.2em] uppercase mb-2 md:mb-4">
                ¿Listo para
              </span>
              <span className="block text-[1.6rem] xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-silver-shimmer break-words">
                TU PRÓXIMO VEHÍCULO?
              </span>
            </h2>
            <p className="mt-3 md:mt-6 text-ink-300 text-sm md:text-lg font-light max-w-xl mx-auto leading-relaxed">
              Agenda una visita personalizada o conversa con nuestros asesores.
              Más de 20 años de experiencia.
            </p>
          </div>

          {/* Contact grid */}
          <div className="mt-6 md:mt-14 grid grid-cols-3 sm:grid-cols-3 gap-2 md:gap-4">
            <ContactCard
              label="WhatsApp"
              value="+56 9 5906 5441"
              href={whatsappUrl}
              external
              highlight
              icon="whatsapp"
            />
            <ContactCard
              label="Teléfono"
              value="+56 9 9343 1571"
              href="tel:+56993431571"
              icon="phone"
            />
            <ContactCard
              label="Ubicación"
              value="Valparaíso · Concón"
              href="https://maps.google.com/?q=Hontaneda+2615+Valparaíso"
              external
              icon="map"
            />
          </div>

          {/* Primary CTAs */}
          <div className="mt-5 md:mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-2 md:gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-primary"
            >
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>AGENDAR VISITA</span>
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="tel:+56993431571"
              className="btn-base btn-silver"
            >
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span>LLAMAR AHORA</span>
            </a>
          </div>

          {/* Footer info */}
          <div className="mt-8 md:mt-20 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8 text-center sm:text-left">
              <div>
                <p className="text-overline text-accent-500 mb-2">Sucursales</p>
                <p className="text-sm text-white font-medium leading-relaxed">
                  Av. Bosques de Montemar #65
                </p>
                <p className="text-xs text-ink-400 mb-2">
                  Edificio OFC, oficina 203, Concón
                </p>
                <p className="text-sm text-white font-medium leading-relaxed">
                  Hontaneda 2615
                </p>
                <p className="text-xs text-ink-400">Valparaíso</p>
              </div>

              <div>
                <p className="text-overline text-accent-500 mb-2">Síguenos</p>
                <div className="flex flex-col gap-2 items-center sm:items-start">
                  <SocialLink href="https://instagram.com/quirozautomotrizspa" label="Instagram">
                    @quirozautomotrizspa
                  </SocialLink>
                  <SocialLink href="https://tiktok.com/@quiroz.automotriz" label="TikTok">
                    @quiroz.automotriz
                  </SocialLink>
                  <SocialLink href="https://youtube.com/channel/UC11dE4tkZPT358WO5RLHtcg" label="YouTube">
                    Quiroz Automotriz
                  </SocialLink>
                </div>
              </div>

              <div>
                <p className="text-overline text-accent-500 mb-2">Servicios</p>
                <ul className="space-y-1 text-sm text-ink-300">
                  <li>Compra y venta</li>
                  <li>Consignación</li>
                  <li>Financiamiento</li>
                  <li>Seguros automotrices</li>
                  <li>Despacho a todo Chile</li>
                  <li>Gestión de TAG</li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-500">
              <p className="font-light tracking-widest">
                QUIROZ REDCAR · DESDE 2004
              </p>
              <p className="font-light">© 2026 · Todos los derechos reservados</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  label,
  value,
  href,
  external,
  highlight,
  icon,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
  highlight?: boolean;
  icon?: "whatsapp" | "phone" | "map";
}) {
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={`group glass-light rounded-2xl p-3 md:p-5 cursor-pointer hover:bg-white/[0.12] transition-all ${
        highlight ? "ring-1 ring-accent-600/50" : ""
      }`}
    >
      {/* Mobile: centered icon + label */}
      <div className="flex flex-col items-center gap-1.5 sm:hidden">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            highlight
              ? "bg-accent-600/20 text-accent-500"
              : "bg-white/10 text-ink-200"
          }`}
        >
          <ContactIcon icon={icon} />
        </div>
        <p className="text-overline text-ink-400 text-center leading-tight">{label}</p>
      </div>

      {/* Tablet+: icon + label + value horizontal */}
      <div className="hidden sm:flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            highlight
              ? "bg-accent-600/20 text-accent-500"
              : "bg-white/10 text-ink-200"
          }`}
        >
          <ContactIcon icon={icon} />
        </div>
        <div className="text-left min-w-0">
          <p className="text-overline text-ink-400 mb-1">{label}</p>
          <p
            className={`font-display text-sm md:text-base font-semibold truncate ${
              highlight ? "text-accent-400" : "text-white"
            } group-hover:translate-x-1 transition-transform`}
          >
            {value}
          </p>
        </div>
      </div>
    </a>
  );
}

function ContactIcon({ icon }: { icon?: "whatsapp" | "phone" | "map" }) {
  if (icon === "whatsapp") return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
    </svg>
  );
  if (icon === "phone") return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
  if (icon === "map") return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
  return null;
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-sm text-ink-300 hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}
