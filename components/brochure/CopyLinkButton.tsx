"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon, AlertTriangleIcon } from "../icons";

type Props = { url: string };

type CopyState = "idle" | "copied" | "error";

const FEEDBACK_MS = 2000;

/** Botón que copia la URL privada al portapapeles, con feedback visible. */
export default function CopyLinkButton({ url }: Props) {
  const [state, setState] = useState<CopyState>("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      // Clipboard no disponible (permiso o contexto no seguro): avisar.
      setState("error");
    }
    setTimeout(() => setState("idle"), FEEDBACK_MS);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="btn-base btn-primary !py-2 !px-4 !text-[12px]"
    >
      {state === "copied" && (
        <>
          <CheckIcon className="w-4 h-4" />
          <span>Copiado</span>
        </>
      )}
      {state === "error" && (
        <>
          <AlertTriangleIcon className="w-4 h-4" />
          <span>No se pudo copiar</span>
        </>
      )}
      {state === "idle" && (
        <>
          <CopyIcon className="w-4 h-4" />
          <span>Copiar link</span>
        </>
      )}
    </button>
  );
}
