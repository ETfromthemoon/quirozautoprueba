import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 104,
            height: 104,
            borderRadius: "50%",
            border: "13px solid #e4e4e7",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 2,
              bottom: -10,
              width: 34,
              height: 13,
              background: "#dc2626",
              transform: "rotate(45deg)",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
