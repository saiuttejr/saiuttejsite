import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sai Uttej Rajoju — software engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "#f3ede3",
          color: "#17120e",
          border: "1px solid rgba(23, 18, 14, 0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#b85b38",
          }}
        >
          <span>Sai Uttej Rajoju</span>
          <span>Software Engineer</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 900 }}>
          <div
            style={{
              fontSize: 88,
              lineHeight: 0.94,
              letterSpacing: "-0.04em",
              fontFamily: "Georgia, serif",
            }}
          >
            Backend systems
            and useful things.
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: "#5e5449",
              maxWidth: 860,
            }}
          >
            Software engineer who likes building things that work quietly
            and hold up over time.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 24, color: "#5e5449" }}>
          <span>Hyderabad, India</span>
          <span style={{ color: "#b85b38" }}>•</span>
          <span>saiuttej.com</span>
        </div>
      </div>
    ),
    size
  );
}