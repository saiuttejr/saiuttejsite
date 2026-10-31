import type { NextConfig } from "next";

// Report-Only until a full pass shows no violations. 'unsafe-inline' covers Next's inline bootstrap
// scripts and React's style attributes, which avoids nonces and keeps the pages static.
// Add upgrade-insecure-requests when enforcing; browsers ignore it (and log an error) in Report-Only.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://a.ltrbxd.com https://cdn.myanimelist.net https://covers.openlibrary.org",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'self' https://eatensity.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          // Dev tooling needs eval, so the policy is only sent for production builds.
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy }]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
