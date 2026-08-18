import Link from "next/link";
import { WhatsAppIcon, PhoneIcon, MapPinIcon, InstagramIcon, MessengerIcon } from "./icons";
import { getWhatsAppUrl, WHATSAPP_CONTACTS } from "@/lib/whatsapp";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "/", label: "Ver disponibles" },
  { href: "/vender-consignar", label: "Vender / Consignar" },
  { href: "/financiamiento", label: "Financiamiento" },
  { href: "/seguros", label: "Seguros" },
  { href: "/reserva", label: "Reserva" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/vendidos", label: "Ver vendidos" },
];

export default function InnerFooter() {
  return (
    <footer className="bg-[var(--color-ink-950)] border-t border-white/8">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 items-center text-center md:grid-cols-3 md:items-start md:text-left gap-12 md:gap-8">

          {/* Brand column */}
          <div className="flex flex-col items-center gap-6 md:items-start">
            <Logo variant="horizontal" className="h-9 w-auto" />
            <p className="mx-auto max-w-xs text-[var(--color-ink-400)] text-sm leading-relaxed md:mx-0">
              Automotora con más de 20 años conectando personas con su próximo
              vehículo. Concón y Valparaíso.
            </p>
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <a
                href="https://www.instagram.com/quirozautomotrizspa/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[var(--color-ink-400)] hover:text-white hover:border-white/40 transition-all"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://m.me/quirozautomotriz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Messenger"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[var(--color-ink-400)] hover:text-white hover:border-white/40 transition-all"
              >
                <MessengerIcon className="w-4 h-4" />
              </a>
              <a
                href="tel:+56959065441"
                aria-label="Llamar"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[var(--color-ink-400)] hover:text-white hover:border-white/40 transition-all"
              >
                <PhoneIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-4 md:items-start">
            <h3 className="text-[var(--color-ink-500)] text-[10px] font-semibold tracking-[0.15em] uppercase">
              Navegación
            </h3>
            <nav className="flex flex-col items-center gap-3 md:items-start">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[var(--color-ink-400)] hover:text-white text-sm transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center gap-4 md:items-start">
            <h3 className="text-[var(--color-ink-500)] text-[10px] font-semibold tracking-[0.15em] uppercase">
              Contacto
            </h3>
            <div className="flex flex-col items-center gap-4 md:items-start">
              {Object.entries(WHATSAPP_CONTACTS).map(([key, contact]) => (
                <a
                  key={key}
                  href={getWhatsAppUrl("Hola, me interesa conocer el catálogo de Quiroz Automotriz.", key as keyof typeof WHATSAPP_CONTACTS)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[var(--color-ink-400)] hover:text-white transition-colors group md:items-start"
                >
                  <WhatsAppIcon className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-ink-500)] group-hover:text-[#25D366] transition-colors" />
                  <span className="text-sm">WhatsApp {contact.name}: {contact.displayNumber}</span>
                </a>
              ))}
              <div className="flex items-center gap-3 text-[var(--color-ink-400)] md:items-start">
                <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-ink-500)]" />
                <div className="flex flex-col gap-1 text-center md:text-left">
                  <span className="text-sm">Av. Bosques de Montemar #65</span>
                  <span className="text-xs text-[var(--color-ink-600)]">Edif. OFC, of. 203 · Concón</span>
                  <span className="text-sm mt-0.5">Hontaneda 2615</span>
                  <span className="text-xs text-[var(--color-ink-600)]">Valparaíso</span>
                </div>
              </div>
              <a
                href={getWhatsAppUrl("Hola, me interesa conocer el catálogo de Quiroz Automotriz.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base btn-primary !py-2.5 !px-4 !text-[11px] gap-2 w-fit mt-2 self-center md:self-start"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Contactar ahora
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--color-ink-600)] text-xs">
            © {new Date().getFullYear()} Quiroz Automotriz. Todos los derechos reservados.
          </p>
          <p className="text-[var(--color-ink-700)] text-xs">
            Automotora de confianza en Concón y Valparaíso
          </p>
        </div>
      </div>
    </footer>
  );
}
