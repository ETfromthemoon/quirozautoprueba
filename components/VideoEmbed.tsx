"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  videoUrl?: string;
  posterImage: string;
  alt: string;
  priority?: boolean;
};

/**
 * Convierte cualquier URL de YouTube a su versión embed.
 * Soporta: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
 */
function toYouTubeEmbed(url: string): string | null {
  try {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const re of patterns) {
      const match = url.match(re);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=1&rel=0&modestbranding=1`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export default function VideoEmbed({ videoUrl, posterImage, alt, priority }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = videoUrl ? toYouTubeEmbed(videoUrl) : null;

  // Sin video: imagen con efecto Ken Burns
  if (!embedUrl) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-ink-950">
        <div className="absolute inset-0 animate-ken-burns">
          <Image
            src={posterImage}
            alt={alt}
            fill
            priority={priority}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>
    );
  }

  // Con video: poster + click to play
  if (!isPlaying) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-ink-950 group">
        <div className="absolute inset-0 animate-ken-burns">
          <Image
            src={posterImage}
            alt={alt}
            fill
            priority={priority}
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-ink-950/30" />
        {/* Play button */}
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center cursor-pointer focus:outline-none"
          aria-label="Reproducir video del vehículo"
        >
          <span className="relative flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-accent-600 animate-pulse-ring" />
            <span className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-2xl shadow-accent-900/50 group-hover:scale-105 transition-transform">
              <svg
                className="w-8 h-8 md:w-10 md:h-10 text-white translate-x-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
        {/* LIVE indicator */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8">
          <div className="glass-light rounded-full px-3 py-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
            <span className="text-overline text-white text-[10px]">Video disponible</span>
          </div>
        </div>
      </div>
    );
  }

  // Playing video
  return (
    <div className="relative w-full h-full overflow-hidden bg-ink-950">
      <iframe
        src={embedUrl}
        title={alt}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
