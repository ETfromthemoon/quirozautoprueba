import { ImageResponse } from "next/og";

export const alt = "Quiroz Redcar — Colección Premium de vehículos en Valparaíso, Chile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(220,38,38,0.22) 0%, transparent 55%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Q mark */}
        <div
          style={{
            display: "flex",
            width: 132,
            height: 132,
            borderRadius: "50%",
            border: "10px solid #d4d4d8",
            position: "relative",
            marginBottom: 44,
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 6,
              bottom: -10,
              width: 38,
              height: 10,
              background: "#d4d4d8",
              transform: "rotate(45deg)",
            }}
          />
        </div>

        {/* Wordmark */}
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: -2 }}>
          <span style={{ color: "#ffffff" }}>QUIROZ</span>
        </div>
        <div style={{ display: "flex", fontSize: 52, fontWeight: 700, letterSpacing: 2, marginTop: 4 }}>
          <span style={{ color: "#dc2626" }}>RED</span>
          <span style={{ color: "#ffffff" }}>CAR</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 26,
            color: "#a1a1aa",
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Colección Premium · Valparaíso, Chile
        </div>
      </div>
    ),
    { ...size }
  );
}
