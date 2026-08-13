import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const syne = localFont({
  src: "./fonts/syne-latin.woff2",
  variable: "--font-syne",
  weight: "400 800",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "400 700",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quirozautomotriz.cl";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Quiroz Automotriz — Colección Premium",
    template: "%s · Quiroz Automotriz",
  },
  description:
    "Automotora familiar. Más de 10 años seleccionando vehículos con honestidad y precios justos. BMW, Ford, Chevrolet, Peugeot y más.",
  openGraph: {
    title: "Quiroz Automotriz — Colección Premium",
    description: "Automotora familiar. Precios justos, trato directo.",
    url: siteUrl,
    siteName: "Quiroz Automotriz",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiroz Automotriz — Colección Premium",
    description: "Catálogo de vehículos premium en Chile.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

// ── Datos estructurados: concesionaria local (SEO + AI) ──
const dealerJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "Quiroz Automotriz Spa",
  description:
    "Automotora familiar. Más de 10 años seleccionando vehículos con honestidad y precios justos.",
  url: siteUrl,
  telephone: "+56993431571",
  priceRange: "$$$",
  areaServed: "CL",
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Av. Bosques de Montemar #65, oficina 203",
      addressLocality: "Concón",
      addressRegion: "Valparaíso",
      addressCountry: "CL",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Hontaneda 2615",
      addressLocality: "Valparaíso",
      addressRegion: "Valparaíso",
      addressCountry: "CL",
    },
  ],
  sameAs: [
    "https://instagram.com/quirozautomotrizspa",
    "https://tiktok.com/@quiroz.automotriz",
    "https://youtube.com/channel/UC11dE4tkZPT358WO5RLHtcg",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${syne.variable} ${inter.variable}`}>
      <body className="bg-ink-950 text-ink-50 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dealerJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
