"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

export default function VehicleGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div>
      {/* Imagen principal */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ink-900 ring-1 ring-white/10">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${alt} — imagen ${active + 1}`}
          fill
          className="object-cover animate-fade-in"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        {/* Contador */}
        <div className="absolute bottom-3 right-3">
          <div className="glass-light rounded-full px-3 py-1 flex items-center gap-1.5">
            <span className="font-display text-sm font-bold text-white leading-none">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="text-ink-400 text-[10px]">/</span>
            <span className="text-ink-300 text-xs">
              {String(images.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div
          className="mt-3 flex gap-2.5 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Miniaturas del vehículo"
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Ver imagen ${i + 1}`}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-20 h-16 md:w-24 md:h-[72px] rounded-lg overflow-hidden transition-all cursor-pointer ${
                i === active
                  ? "ring-2 ring-accent-500 opacity-100"
                  : "ring-1 ring-white/10 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
