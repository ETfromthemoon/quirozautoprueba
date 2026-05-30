import { getWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

export default function FloatingWhatsApp() {
  return (
    <a
      href={getWhatsAppUrl("Hola, me interesa un vehículo de Quiroz Automotriz.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse-ring" />
      <span className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-xl shadow-green-900/50 hover:scale-110 transition-transform cursor-pointer">
        <WhatsAppIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
      </span>
    </a>
  );
}
