import type { Metadata, Viewport } from "next";
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
    "Automotora familiar en San Miguel, Santiago. Más de 10 años seleccionando vehículos con honestidad y precios justos. BMW, Ford, Chevrolet, Peugeot y más.",
  openGraph: {
    title: "Quiroz Redcar — Colección Premium",
    description: "Automotora familiar en San Miguel, Santiago. Precios justos, trato directo.",
    url: siteUrl,
    siteName: "Quiroz Redcar",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiroz Redcar — Colección Premium",
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
  name: "Quiroz Redcar — Quiroz Automotriz Spa",
  description:
    "Automotora familiar en San Miguel, Santiago. Más de 10 años seleccionando vehículos con honestidad y precios justos.",
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
    <html
      lang="es"
      className={`${syne.variable} ${inter.variable}`}
    >
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
