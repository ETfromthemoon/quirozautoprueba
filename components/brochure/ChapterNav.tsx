"use client";

import { useEffect, useState } from "react";

type Chapter = { id: string; label: string };

type Props = { chapters: Chapter[] };

/**
 * Navegación de capítulos tipo "dots" fija a la derecha (desktop).
 * Resalta la sección activa según scroll y permite salto suave.
 */
export default function ChapterNav({ chapters }: Props) {
  const [active, setActive] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav
      aria-label="Secciones del informe"
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3"
    >
      {chapters.map((c) => {
        const isActive = active === c.id;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="group flex items-center gap-3 justify-end"
          >
            <span
              className={`text-[11px] tracking-wide transition-all duration-300 ${
                isActive
                  ? "text-white opacity-100"
                  : "text-ink-400 opacity-0 group-hover:opacity-100"
              }`}
            >
              {c.label}
            </span>
            <span className={`dot ${isActive ? "active" : ""}`} aria-hidden="true" />
            <span className="sr-only">{c.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
