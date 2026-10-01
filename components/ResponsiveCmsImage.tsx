import Image from "next/image";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Image> & { responsiveSrcSet?: string };

/** Deja que WordPress sirva sus miniaturas sin pasar por /_next/image. */
export default function ResponsiveCmsImage({ responsiveSrcSet, sizes, ...props }: Props) {
  if (!responsiveSrcSet) return <Image {...props} sizes={sizes} />;

  return (
    <picture>
      <source srcSet={responsiveSrcSet} sizes={sizes} />
      <Image {...props} sizes={sizes} />
    </picture>
  );
}
