"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "../icons";

type Props = { url: string; title: string };

/** Abre el menú nativo de compartir y usa el portapapeles como respaldo. */
export default function ShareLinkButton({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Brochure privado · ${title}`,
          text: `Revisa el brochure privado de ${title}`,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Cancelar el menú nativo no es un error para el usuario.
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="btn-base btn-secondary !py-2 !px-4 !text-[12px]"
    >
      {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
      <span>{copied ? "Enlace copiado" : "Compartir"}</span>
    </button>
  );
}
