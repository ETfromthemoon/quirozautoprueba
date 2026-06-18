import Image from "next/image";
import Logo from "./Logo";

type Props = {
  totalCars: number;
};

export default function Hero({ totalCars }: Props) {
  return (
    <section className="showcase-section relative bg-ink-950 overflow-hidden">
      {/* Layer 1: Background image with Ken Burns zoom */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 animate-ken-burns">
          <Image
            src="https://images.unsplash.com/photo-1774979300787-bd3563a085b8?w=1920&q=80"
            alt="Quiroz Redcar - Colección Premium"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        {/* Darkening gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/50 to-ink-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
      </div>

      {/* Layer 2: Animated grid */}
      <div className="grid-overlay" />

      {/* Layer 3: Speed lines */}
      <div className="speed-lines" />

      {/* Layer 4: Light streaks */}
      <div className="light-streak" />
      <div className="light-streak light-streak-2" />

      {/* Layer 5: Floating particles (silver + red mix) */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="particle" style={{ left: "10%", top: "70%", animationDelay: "0s" }} />
        <span className="particle particle-red" style={{ left: "20%", top: "50%", animationDelay: "2s" }} />
        <span className="particle" style={{ left: "35%", top: "80%", animationDelay: "4s" }} />
        <span className="particle particle-red" style={{ left: "60%", top: "60%", animationDelay: "1s" }} />
        <span className="particle" style={{ left: "75%", top: "75%", animationDelay: "3s" }} />
        <span className="particle particle-red" style={{ left: "85%", top: "55%", animationDelay: "5s" }} />
        <span className="particle" style={{ left: "45%", top: "30%", animationDelay: "6s" }} />
        <span className="particle" style={{ left: "90%", top: "40%", animationDelay: "7s" }} />
      </div>

      {/* Layer 6: Grain overlay */}
      <div className="grain-overlay" />

      {/* Layer 7: Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(9,9,11,0.75) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top: Logo */}
        <div className="flex justify-center pt-20 md:pt-28 px-6">
          <Logo variant="mark" className="w-16 h-16 md:w-20 md:h-20 animate-fade-up" />
        </div>

        {/* Center title */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-5xl">
            <p className="text-overline text-ink-300 mb-6 animate-fade-up delay-100">
              <span className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-accent-600" />
                Quiroz Redcar · Concón · Valparaíso
                <span className="h-px w-8 bg-accent-600" />
              </span>
            </p>
            <h1 className="text-luxury-xl text-white animate-fade-up delay-200">
              <span className="block font-medium text-ink-200 text-[0.4em] tracking-[0.3em] uppercase mb-4 md:mb-6">
                Una colección
              </span>
              <span className="block text-white">EXCEPCIONAL</span>
            </h1>
            <p className="mt-6 md:mt-8 text-sm md:text-lg text-ink-200 max-w-xl mx-auto font-light leading-relaxed animate-fade-up delay-400 px-4">
               Autos seleccionados con más de 20 años de experiencia brindando
               seguridad, transparencia y eficiencia.
            </p>

            <div className="mt-10 md:mt-12 flex items-center justify-center gap-3 md:gap-4 animate-fade-up delay-500">
              <span className="h-px w-8 md:w-12 bg-white/30" />
              <span className="text-overline text-white">
                {totalCars} vehículos en catálogo
              </span>
              <span className="h-px w-8 md:w-12 bg-white/30" />
            </div>
          </div>
        </div>

        {/* Bottom scroll hint */}
        <div className="pb-10 md:pb-16 flex flex-col items-center gap-3 animate-fade-up delay-700">
          <span className="text-overline text-ink-300">Desliza para explorar</span>
          <div className="animate-scroll-hint">
            <svg
              width="20"
              height="32"
              viewBox="0 0 20 32"
              fill="none"
              className="text-white"
            >
              <rect
                x="1"
                y="1"
                width="18"
                height="30"
                rx="9"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <circle cx="10" cy="10" r="2" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
