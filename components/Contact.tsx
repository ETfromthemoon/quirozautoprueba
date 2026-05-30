import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import Logo from "./Logo";
import { WhatsAppIcon, PhoneIcon, MapPinIcon, ArrowRightIcon } from "./icons";

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
          src="https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=1600&q=80"
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
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span>AGENDAR VISITA</span>
              <ArrowRightIcon className="w-4 h-4 shrink-0" />
            </a>
            <a
              href="tel:+56993431571"
              className="btn-base btn-silver"
            >
              <PhoneIcon className="w-4 h-4 shrink-0" />
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
  if (icon === "whatsapp") return <WhatsAppIcon />;
  if (icon === "phone") return <PhoneIcon />;
  if (icon === "map") return <MapPinIcon />;
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
