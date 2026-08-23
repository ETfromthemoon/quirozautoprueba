"use client";

import { useEffect, useRef, useState } from "react";
import { getWhatsAppUrl, WHATSAPP_CONTACTS, type WhatsAppContact } from "@/lib/whatsapp";
import { WhatsAppIcon, XIcon } from "./icons";

const defaultMessage = "Hola, me interesa conocer el catálogo de Quiroz Automotriz.";

type ContactWhatsAppButtonProps = {
  className: string;
  showIcon?: boolean;
  mobileLabel?: string;
  shine?: boolean;
  message?: string;
  floating?: boolean;
};

export default function ContactWhatsAppButton({
  className,
  showIcon = false,
  mobileLabel = "Contactar",
  shine = false,
  message = defaultMessage,
  floating = false,
}: ContactWhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const contact = (person: WhatsAppContact) => {
    window.open(getWhatsAppUrl(message, person), "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={floating ? "fixed bottom-5 right-5 z-[80] sm:bottom-6 sm:right-6" : "relative"}>
      <button type="button" onClick={() => setIsOpen((open) => !open)} className={className} aria-haspopup="dialog" aria-expanded={isOpen} aria-label={isOpen ? "Cerrar opciones de WhatsApp" : "Abrir opciones de WhatsApp"}>
        {shine && <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine-slow pointer-events-none" />}
        {floating ? <WhatsAppIcon className="relative z-10 h-7 w-7" /> : showIcon ? <WhatsAppIcon className="w-4 h-4 relative z-10" /> : <span className="relative flex h-1.5 w-1.5"><span className="absolute inset-0 rounded-full bg-white animate-pulse-ring" /><span className="relative rounded-full bg-white w-1.5 h-1.5" /></span>}
        {floating ? <span className="sr-only">WhatsApp</span> : <><span className="hidden sm:inline relative z-10">Contactar</span><span className="sm:hidden relative z-10">{mobileLabel}</span></>}
      </button>

      <div role="dialog" aria-label="Opciones de WhatsApp" className={`absolute right-0 z-[90] w-[min(16rem,calc(100vw-2rem))] border border-white/15 bg-ink-950 p-3 shadow-2xl shadow-black/40 transition-all duration-200 ${floating ? "bottom-full mb-3 origin-bottom-right" : "top-full mt-3 origin-top-right"} ${isOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white">Habla con nuestro equipo</p>
          <button type="button" onClick={() => setIsOpen(false)} className="grid h-7 w-7 place-items-center text-ink-300 transition-colors hover:text-white" aria-label="Cerrar opciones de WhatsApp"><XIcon className="h-4 w-4" /></button>
        </div>
        <div className="grid gap-2">
          {(Object.keys(WHATSAPP_CONTACTS) as WhatsAppContact[]).map((person) => (
            <button key={person} type="button" onClick={() => contact(person)} className="flex w-full items-center justify-between border border-white/15 px-3 py-3 text-left transition-colors hover:border-[#25D366] hover:bg-white/5">
              <span><span className="block text-sm font-semibold text-white">{WHATSAPP_CONTACTS[person].name}</span><span className="block text-xs text-ink-400">{WHATSAPP_CONTACTS[person].displayNumber}</span></span>
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
