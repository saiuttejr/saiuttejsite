import type { Metadata } from "next";
import { SITE_PROFILE } from "./site-data";

export const SITE_URL = "https://saiuttej.com";

interface PageMetaOptions {
  title?: string;
  description?: string;
  path?: string;
}

export function pageMetadata({
  title,
  description = SITE_PROFILE.summary,
  path = "/",
}: PageMetaOptions = {}): Metadata {
  const fullTitle = title
    ? `${title} · ${SITE_PROFILE.name}`
    : `${SITE_PROFILE.name} · ${SITE_PROFILE.role}`;
  const canonicalUrl = new URL(path, SITE_URL).toString();
  const ogImageUrl = new URL("/opengraph-image", SITE_URL).toString();

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_PROFILE.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_PROFILE.name} · ${SITE_PROFILE.role}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImageUrl],
    },
  };
}
