"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { saveCatalogPosition } from "@/lib/catalog-position";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> &
  Pick<LinkProps, "replace" | "scroll" | "shallow" | "prefetch"> & {
    sectionId: string;
    children: ReactNode;
  };

export default function CatalogBackLink({
  sectionId,
  children,
  ...props
}: Props) {
  return (
    <Link
      {...props}
      href="/"
      onClick={() => saveCatalogPosition(sectionId)}
    >
      {children}
    </Link>
  );
}
