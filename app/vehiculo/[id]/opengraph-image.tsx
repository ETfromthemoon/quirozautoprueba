import { ImageResponse } from "next/og";
import { fetchCarBySlug, fetchCarSlugs } from "@/lib/wordpress";

export const alt = "Vehículo · Quiroz Redcar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-genera la OG de cada vehículo en build (estática, sin coste en runtime).
export async function generateStaticParams() {
  const slugs = await fetchCarSlugs();
  return slugs.map((id) => ({ id }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await fetchCarBySlug(id);

  if (!car) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#09090b",
            color: "#ffffff",
            fontSize: 64,
            fontWeight: 800,
            fontFamily: "sans-serif",
          }}
        >
          Quiroz Redcar
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          background: "#09090b",
          fontFamily: "sans-serif",
        }}
      >
        {/* Foto del vehículo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={car.image}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, objectFit: "cover" }}
        />
        {/* Overlay degradado */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(90deg, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.55) 55%, rgba(9,9,11,0.15) 100%)",
          }}
        />

        {/* Contenido */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            padding: "0 80px",
            maxWidth: 760,
          }}
        >
          {/* Badge / tagline */}
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#f87171",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            {car.tagline}
          </div>

          {/* Marca */}
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#d4d4d8",
              letterSpacing: 8,
              textTransform: "uppercase",
            }}
          >
            {car.brand}
          </div>

          {/* Modelo */}
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            {car.model}
          </div>

          {car.variant ? (
            <div style={{ display: "flex", fontSize: 26, color: "#a1a1aa", marginTop: 10 }}>
              {car.variant}
            </div>
          ) : null}

          {/* Precio */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 38,
              padding: "14px 28px",
              borderRadius: 999,
              background: "linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)",
              fontSize: 40,
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            {car.price}
          </div>

          {/* Specs línea */}
          <div style={{ display: "flex", marginTop: 28, fontSize: 24, color: "#e4e4e7" }}>
            {car.year} · {car.km} km · {car.fuel} · {car.transmission}
          </div>
        </div>

        {/* Logo esquina */}
        <div
          style={{
            position: "absolute",
            top: 44,
            right: 56,
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          <span style={{ color: "#ffffff" }}>QUIROZ</span>
          <span style={{ color: "#dc2626", marginLeft: 8 }}>RED</span>
          <span style={{ color: "#ffffff" }}>CAR</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
