"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Retardo en ms para escalonar apariciones. */
  delay?: number;
  /** Etiqueta HTML a renderizar (default: div). */
  as?: "div" | "section" | "li";
  id?: string;
};

/**
 * Envoltorio que revela su contenido al entrar en viewport.
 * Respeta prefers-reduced-motion (via CSS: .reveal queda visible).
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
  id,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Si el navegador no soporta IntersectionObserver, mostrar directo.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as as ElementType;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      id={id}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
