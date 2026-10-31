import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_PROFILE } from "@/lib/site-data";
import { pageMetadata, SITE_URL } from "@/lib/metadata";
import { MotionRuntime } from "@/components/MotionRuntime";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata(),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_PROFILE.name,
  jobTitle: SITE_PROFILE.role,
  url: SITE_URL,
  email: SITE_PROFILE.links.emailAddress,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressCountry: "IN",
  },
  worksFor: {
    "@type": "Organization",
    name: "MAQ Software",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "CVR College of Engineering, JNTUH",
  },
  sameAs: [
    SITE_PROFILE.links.github,
    SITE_PROFILE.links.linkedin,
    SITE_PROFILE.links.letterboxd,
    SITE_PROFILE.links.goodreads,
    SITE_PROFILE.links.myanimelist,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-room="work" className="js" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <MotionRuntime />
        {children}
      </body>
    </html>
  );
}
