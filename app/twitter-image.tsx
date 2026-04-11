import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sai Uttej Rajoju — software engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "56px 64px",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(180deg, #f7f1e9 0%, #f3ede3 100%)",
          color: "#17120e",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b85b38" }}>
            Sai Uttej Rajoju
          </span>
          <div
            style={{
              fontSize: 82,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              fontFamily: "Georgia, serif",
              maxWidth: 900,
            }}
          >
            I like building things
            that work quietly.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 800 }}>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: "#5e5449" }}>
            Backend-focused engineering, shipped end to end.
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 24, color: "#5e5449" }}>
            <span>Backend systems</span>
            <span style={{ color: "#b85b38" }}>•</span>
            <span>Data systems</span>
            <span style={{ color: "#b85b38" }}>•</span>
            <span>saiuttej.com</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}