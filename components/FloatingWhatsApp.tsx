"use client";

import { useEffect, useState } from "react";
import { getWhatsAppUrl, WHATSAPP_CONTACTS, type WhatsAppContact } from "@/lib/whatsapp";
import { WhatsAppIcon, XIcon } from "./icons";

const defaultMessage = "Hola, me interesa un vehiculo de Quiroz Automotriz.";

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  useEffect(() => {
    const interceptWhatsApp = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href*="wa.me/"]');
      if (!anchor) return;

      event.preventDefault();
      const url = new URL(anchor.href);
      setMessage(url.searchParams.get("text") || defaultMessage);
      setIsOpen(true);
    };

    document.addEventListener("click", interceptWhatsApp, true);
    return () => document.removeEventListener("click", interceptWhatsApp, true);
  }, []);

  const contact = (person: WhatsAppContact) => {
    window.open(getWhatsAppUrl(message, person), "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-4 z-50 md:bottom-8 md:right-8">
      <div
        className={`absolute bottom-16 right-0 w-64 origin-bottom-right transition-all duration-200 md:bottom-[4.5rem] ${
          isOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="border border-white/15 bg-ink-950 p-3 shadow-2xl shadow-black/40">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white">Habla con nuestro equipo</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="grid h-7 w-7 place-items-center text-ink-300 transition-colors hover:text-white"
              aria-label="Cerrar selector de WhatsApp"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-2">
            {(Object.keys(WHATSAPP_CONTACTS) as WhatsAppContact[]).map((person) => (
              <button
                key={person}
                type="button"
                onClick={() => contact(person)}
                className="flex w-full items-center justify-between border border-white/15 px-3 py-3 text-left transition-colors hover:border-[#25D366] hover:bg-white/5"
              >
                <span>
                  <span className="block text-sm font-semibold text-white">{WHATSAPP_CONTACTS[person].name}</span>
                  <span className="block text-xs text-ink-400">{WHATSAPP_CONTACTS[person].displayNumber}</span>
                </span>
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setMessage(defaultMessage);
          setIsOpen((open) => !open);
        }}
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-950/50 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ink-950"
        aria-label={isOpen ? "Cerrar selector de WhatsApp" : "Contactar por WhatsApp"}
        aria-expanded={isOpen}
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <WhatsAppIcon className="h-7 w-7" />}
      </button>
    </div>
  );
}
