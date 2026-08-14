"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

export default function VehicleGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const [availableImages, setAvailableImages] = useState(images);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setAvailableImages(images);
    setActive(0);
    setIsLightboxOpen(false);
  }, [images]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLightboxOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isLightboxOpen]);

  if (availableImages.length === 0) return null;

  const removeBrokenImage = (src: string) => {
    setAvailableImages((current) => {
      const brokenIndex = current.indexOf(src);
      const next = current.filter((image) => image !== src);
      setActive((currentActive) => Math.max(0, Math.min(currentActive, next.length - 1)));
      if (brokenIndex === active && next.length === 0) setIsLightboxOpen(false);
      return next;
    });
  };

  const move = (direction: -1 | 1) => {
    setActive((current) => (current + direction + availableImages.length) % availableImages.length);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 42 && availableImages.length > 1) move(delta > 0 ? -1 : 1);
  };

  const thumbnailButton = (src: string, index: number, compact = false) => (
    <button
      key={src}
      type="button"
      role="tab"
      aria-selected={index === active}
      aria-label={`Ver imagen ${index + 1}`}
      onClick={() => setActive(index)}
      className={`relative shrink-0 overflow-hidden transition-all cursor-pointer ${
        compact ? "w-10 h-8 rounded-md" : "w-20 h-16 md:w-24 md:h-[72px] rounded-lg"
      } ${
        index === active
          ? "ring-2 ring-accent-500 opacity-100"
          : "ring-1 ring-white/10 opacity-60 hover:opacity-100"
      }`}
    >
      <Image src={src} alt="" fill className="object-cover" sizes={compact ? "40px" : "96px"} onError={() => removeBrokenImage(src)} />
    </button>
  );

  return (
    <div>
      <div
        className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ink-900 ring-1 ring-white/10"
        onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute inset-0 z-10 cursor-zoom-in focus:outline-none"
          aria-label="Abrir galería a pantalla completa"
        />
        <Image
          key={availableImages[active]}
          src={availableImages[active]}
          alt={`${alt} — imagen ${active + 1}`}
          fill
          className="object-cover animate-fade-in"
          sizes="(max-width: 1024px) 100vw, 66vw"
          onError={() => removeBrokenImage(availableImages[active])}
        />
        {availableImages.length > 1 && (
          <>
            <button type="button" onClick={() => move(-1)} className="hidden sm:flex absolute left-3 top-1/2 z-20 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full glass-dark text-white" aria-label="Imagen anterior">‹</button>
            <button type="button" onClick={() => move(1)} className="hidden sm:flex absolute right-3 top-1/2 z-20 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full glass-dark text-white" aria-label="Imagen siguiente">›</button>
          </>
        )}
        <div className="absolute bottom-3 left-3 z-20 flex gap-1.5 md:hidden" role="tablist" aria-label="Miniaturas del vehículo">
          {availableImages.slice(0, 4).map((src, index) => thumbnailButton(src, index, true))}
          {availableImages.length > 4 && <span className="flex h-8 min-w-8 items-center justify-center rounded-md bg-black/50 px-1 text-[10px] text-white">+{availableImages.length - 4}</span>}
        </div>
        <div className="absolute bottom-3 right-3 z-20">
          <div className="glass-light rounded-full px-3 py-1 flex items-center gap-1.5">
            <span className="font-display text-sm font-bold text-white leading-none">{String(active + 1).padStart(2, "0")}</span>
            <span className="text-ink-400 text-[10px]">/</span>
            <span className="text-ink-300 text-xs">{String(availableImages.length).padStart(2, "0")}</span>
          </div>
        </div>
        {availableImages.length > 1 && <p className="absolute top-3 right-3 z-20 rounded-full bg-black/35 px-2 py-1 text-[10px] text-white/85 sm:hidden">Desliza o toca para ampliar</p>}
      </div>

      {availableImages.length > 1 && (
        <div className="mt-3 hidden gap-2.5 overflow-x-auto pb-1 md:flex" role="tablist" aria-label="Miniaturas del vehículo">
          {availableImages.map((src, index) => thumbnailButton(src, index))}
        </div>
      )}

      {isLightboxOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-ink-950/98 p-4" role="dialog" aria-modal="true" aria-label={`Galería de ${alt}`}>
          <div className="flex items-center justify-between pb-4">
            <p className="text-sm text-ink-200">{active + 1} de {availableImages.length}</p>
            <button type="button" onClick={() => setIsLightboxOpen(false)} className="rounded-full glass-light px-4 py-2 text-sm text-white" aria-label="Cerrar galería">Cerrar ×</button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center" onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }} onTouchEnd={handleTouchEnd}>
            <Image src={availableImages[active]} alt={`${alt} — imagen ${active + 1}`} fill className="object-contain" sizes="100vw" onError={() => removeBrokenImage(availableImages[active])} />
            {availableImages.length > 1 && <><button type="button" onClick={() => move(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full glass-dark px-3 py-2 text-2xl text-white" aria-label="Imagen anterior">‹</button><button type="button" onClick={() => move(1)} className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full glass-dark px-3 py-2 text-2xl text-white" aria-label="Imagen siguiente">›</button></>}
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Miniaturas de pantalla completa">
            {availableImages.map((src, index) => thumbnailButton(src, index))}
          </div>
        </div>
      )}
    </div>
  );
}
