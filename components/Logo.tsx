import Image from "next/image";

type LogoProps = {
  variant?: "full" | "mark" | "horizontal";
  className?: string;
};

/**
 * Shared brand logo used by every page surface.
 *
 * The asset is a transparent PNG cropped to the black circular mark, so it
 * can sit on both the dark page background and lighter image sections without
 * bringing along the source image's white square background.
 */
export default function Logo({ className = "" }: LogoProps) {
  return (
    <Image
      src="/brand/logo-quiroz-group.png"
      alt="Quiroz Redcar Group"
      width={1400}
      height={1400}
      sizes="80px"
      className={`block object-contain ${className}`}
    />
  );
}
