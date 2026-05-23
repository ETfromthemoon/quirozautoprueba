import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quirozautomotriz.cl";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Quiroz Redcar — Colección Premium",
    template: "%s · Quiroz Redcar",
  },
  description:
    "Catálogo de vehículos premium en Chile. Más de 20 años seleccionando automóviles excepcionales. BMW, Ford, Chevrolet, Peugeot y más.",
  openGraph: {
    title: "Quiroz Redcar — Colección Premium",
    description: "Una experiencia automotriz curada. Valparaíso, Chile.",
    url: siteUrl,
    siteName: "Quiroz Redcar",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiroz Redcar — Colección Premium",
    description: "Catálogo de vehículos premium en Chile.",
    images: ["/brand/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${syne.variable} ${inter.variable}`}
    >
      <body className="bg-ink-950 text-ink-50 antialiased">
        {children}
      </body>
    </html>
  );
}
