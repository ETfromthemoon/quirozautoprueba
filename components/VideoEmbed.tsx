"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  videoUrls?: string[];
  posterImage: string;
  alt: string;
  priority?: boolean;
};

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80";

/** Convierte una URL de YouTube (watch, short, embed o shorts) en embed. */
function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed|shorts)\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

function toYouTubeEmbed(url: string): string | null {
  const id = extractYouTubeId(url);
  return id
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1`
    : null;
}

export default function VideoEmbed({ videoUrls = [], posterImage, alt, priority }: Props) {
  const playableUrls = videoUrls.filter((url) => toYouTubeEmbed(url));
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [posterSrc, setPosterSrc] = useState(posterImage);
  const embedUrl = playableUrls[activeVideo]
    ? toYouTubeEmbed(playableUrls[activeVideo])
    : null;

  useEffect(() => {
    setActiveVideo(0);
    setIsPlaying(false);
    setPosterSrc(posterImage);
  }, [posterImage, videoUrls]);

  const selectVideo = (index: number) => {
    setActiveVideo(index);
    setIsPlaying(false);
  };

  const poster = (
    <Image
      src={posterSrc}
      alt={alt}
      fill
      priority={priority}
      className="object-cover"
      sizes="100vw"
      onError={() => setPosterSrc(FALLBACK_POSTER)}
    />
  );

  if (!embedUrl) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-ink-950">
        <div className="absolute inset-0 animate-ken-burns">{poster}</div>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-ink-950 group">
        <div className="absolute inset-0 animate-ken-burns">{poster}</div>
        <div className="absolute inset-0 bg-ink-950/35" />
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center cursor-pointer focus:outline-none"
          aria-label={`Reproducir video ${activeVideo + 1} del vehículo`}
        >
          <span className="relative flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-accent-600 animate-pulse-ring" />
            <span className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-2xl shadow-accent-900/50 group-hover:scale-105 transition-transform">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-white translate-x-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
        <div className="absolute top-6 left-6 md:top-8 md:left-8">
          <div className="glass-light rounded-full px-3 py-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
            <span className="text-overline text-white text-[10px]">Video disponible</span>
          </div>
        </div>
        {playableUrls.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {playableUrls.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectVideo(index)}
                aria-pressed={index === activeVideo}
                className={`rounded-full px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] uppercase transition-colors ${
                  index === activeVideo
                    ? "bg-white text-ink-950"
                    : "glass-light text-white hover:bg-white/20"
                }`}
              >
                Video {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-ink-950">
      <iframe
        src={embedUrl}
        title={`${alt} — video ${activeVideo + 1}`}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      {playableUrls.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {playableUrls.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => selectVideo(index)}
              aria-pressed={index === activeVideo}
              className={`rounded-full px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] uppercase transition-colors ${
                index === activeVideo
                  ? "bg-white text-ink-950"
                  : "glass-dark text-white hover:bg-white/20"
              }`}
            >
              Video {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
