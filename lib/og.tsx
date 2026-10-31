import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_PROFILE } from "./site-data";

export const OG_SIZE = {
  width: 1200,
  height: 630,
};

export async function renderOpenGraphCard(subtitle = SITE_PROFILE.role) {
  const fontsDir = join(process.cwd(), "assets", "fonts");
  const portraitPath = join(process.cwd(), "public", "images", "sai-pergola.jpg");
  const [switzerRegular, switzerSemibold, portraitBuf] = await Promise.all([
    readFile(join(fontsDir, "Switzer-Regular.ttf")),
    readFile(join(fontsDir, "Switzer-Semibold.ttf")),
    readFile(portraitPath),
  ]);
  const portraitDataUrl = `data:image/jpeg;base64,${portraitBuf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          color: "#09122c",
          padding: "54px 64px 0 64px",
          fontFamily: "Switzer",
          borderTop: "10px solid #1447e6",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingBottom: "54px",
            maxWidth: "740px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span
              style={{
                backgroundColor: "#1447e6",
                color: "#ffffff",
                padding: "8px 18px",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              saiuttej.com
            </span>
            <span
              style={{
                backgroundColor: "#ff3b1f",
                color: "#ffffff",
                padding: "8px 18px",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              /space
            </span>
            <span style={{ fontSize: 20, color: "#3d4a6b" }}>
              {SITE_PROFILE.location}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 600,
                lineHeight: 0.96,
                letterSpacing: "-0.035em",
              }}
            >
              Hey, I’m Sai. I build AI agents &amp; web software.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 400,
                color: "#2b3654",
                lineHeight: 1.38,
              }}
            >
              {`${subtitle} at MAQ Software · Creator of Eatensity, FigureTools, FinPulse AI & Kanso.`}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "24px",
              fontSize: 20,
              fontWeight: 600,
              color: "#1447e6",
            }}
          >
            <span>Eatensity (Live)</span>
            <span>·</span>
            <span>FigureTools</span>
            <span>·</span>
            <span>FinPulse AI</span>
            <span>·</span>
            <span>Kanso</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            width: "340px",
            height: "100%",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portraitDataUrl}
            width={320}
            height={485}
            alt={SITE_PROFILE.name}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: "Switzer",
          data: switzerRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Switzer",
          data: switzerSemibold,
          weight: 600,
          style: "normal",
        },
      ],
    }
  );
}
