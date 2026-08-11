"use client";

import { useEffect, useState } from "react";
import { getWhatsAppUrl, WHATSAPP_CONTACTS, type WhatsAppContact } from "@/lib/whatsapp";
import { WhatsAppIcon, XIcon } from "./icons";

const defaultMessage = "Hola, me interesa un vehiculo de Quiroz Automotriz.";
const panelWidth = 256;

type SelectorPosition = { left: number; top: number; opensUp: boolean };

function getPosition(anchor: HTMLAnchorElement): SelectorPosition {
  const rect = anchor.getBoundingClientRect();
  const opensUp = rect.top > 250;

  return {
    left: Math.min(Math.max(16, rect.left), window.innerWidth - panelWidth - 16),
    top: opensUp ? rect.top - 8 : rect.bottom + 8,
    opensUp,
  };
}

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(defaultMessage);
  const [position, setPosition] = useState<SelectorPosition>({ left: 16, top: 0, opensUp: true });

  const openFromAnchor = (anchor: HTMLAnchorElement) => {
    const url = new URL(anchor.href);
    setMessage(url.searchParams.get("text") || defaultMessage);
    setPosition(getPosition(anchor));
    setIsOpen(true);
  };

  useEffect(() => {
    const interceptWhatsApp = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href*="wa.me/"]');
      if (!anchor) return;

      event.preventDefault();
      openFromAnchor(anchor);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("click", interceptWhatsApp, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("click", interceptWhatsApp, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const contact = (person: WhatsAppContact) => {
    window.open(getWhatsAppUrl(message, person), "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const toggleFloatingSelector = () => {
    setMessage(defaultMessage);
    setPosition({ left: window.innerWidth - panelWidth - 16, top: window.innerHeight - 80, opensUp: true });
    setIsOpen((open) => !open);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[80]">
      <div
        className="pointer-events-auto fixed w-64"
        style={{
          left: position.left,
          top: position.top,
          transform: position.opensUp ? "translateY(-100%)" : undefined,
        }}
        aria-hidden={!isOpen}
      >
        <div
          className={`border border-white/15 bg-ink-950 p-3 shadow-2xl shadow-black/40 transition-all duration-200 ${
            position.opensUp ? "origin-bottom-left" : "origin-top-left"
          } ${isOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white">Habla con nuestro equipo</p>
            <button type="button" onClick={() => setIsOpen(false)} className="grid h-7 w-7 place-items-center text-ink-300 transition-colors hover:text-white" aria-label="Cerrar selector de WhatsApp">
              <XIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-2">
            {(Object.keys(WHATSAPP_CONTACTS) as WhatsAppContact[]).map((person) => (
              <button key={person} type="button" onClick={() => contact(person)} className="flex w-full items-center justify-between border border-white/15 px-3 py-3 text-left transition-colors hover:border-[#25D366] hover:bg-white/5">
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
        onClick={toggleFloatingSelector}
        className="pointer-events-auto fixed bottom-5 right-4 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-950/50 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ink-950 md:bottom-8 md:right-8"
        aria-label={isOpen ? "Cerrar selector de WhatsApp" : "Contactar por WhatsApp"}
        aria-expanded={isOpen}
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <WhatsAppIcon className="h-7 w-7" />}
      </button>
    </div>
  );
}
