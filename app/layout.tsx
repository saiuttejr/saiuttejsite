import type { Metadata } from "next";
import { Instrument_Serif, Sora } from "next/font/google";
import localFont from "next/font/local";
import { siteMetadata, socialLinks } from "@/lib/constants";
import ChessEasterEgg from "@/components/ChessEasterEgg";
import ChessPieces from "@/components/ChessPieces";
import CursorLayer from "@/components/CursorLayer";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "./fonts/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  metadataBase: new URL(siteMetadata.url),
  applicationName: siteMetadata.title,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: siteMetadata.title }],
  creator: siteMetadata.title,
  publisher: siteMetadata.title,
  keywords: [
    "software engineer",
    "backend engineer",
    "AI engineer",
    "AI agents",
    "Azure AI",
    "product builder",
    "platform tooling",
    "systems design",
    "Hyderabad",
  ],
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.url,
    siteName: siteMetadata.title,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteMetadata.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteMetadata.title} — software engineer and product builder`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: siteMetadata.title,
      url: siteMetadata.url,
      email: `mailto:${socialLinks.email}`,
      jobTitle: "Backend & AI/Agent Engineer, Product Builder",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hyderabad",
        addressCountry: "India",
      },
      sameAs: [socialLinks.linkedin, socialLinks.github, socialLinks.lichess],
    },
    {
      "@type": "WebSite",
      name: siteMetadata.title,
      url: siteMetadata.url,
      description: siteMetadata.description,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${sora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="grain-overlay" aria-hidden="true" />
        {children}
        <ChessEasterEgg />
        <ChessPieces />
        <CursorLayer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
