import { getWhatsAppUrl, WHATSAPP_CONTACTS } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

export default function FloatingWhatsApp() {
  const message = "Hola, me interesa un vehículo de Quiroz Automotriz.";

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-2">
      {(Object.keys(WHATSAPP_CONTACTS) as Array<keyof typeof WHATSAPP_CONTACTS>).map((contact) => {
        const person = WHATSAPP_CONTACTS[contact];
        return (
          <a
            key={contact}
            href={getWhatsAppUrl(message, contact)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Escribir a ${person.name} por WhatsApp`}
            title={`WhatsApp ${person.name}: ${person.displayNumber}`}
            className="group flex items-center gap-2"
          >
            <span className="rounded-full bg-ink-950/90 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:opacity-100">
              {person.name}
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-xl shadow-green-900/50 transition-transform group-hover:scale-110 md:h-14 md:w-14">
              <WhatsAppIcon className="h-6 w-6 text-white md:h-7 md:w-7" />
            </span>
          </a>
        );
      })}
    </div>
  );
}
