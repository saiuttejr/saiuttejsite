"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div data-room="work" className="editorial-beat">
      <p className="beat-numeral">Unexpected error</p>
      <h1 className="statement-huge">Something went sideways.</h1>
      <div className="editorial-links" style={{ marginTop: "2rem" }}>
        <button
          type="button"
          onClick={() => reset()}
          className="ed-link ed-link-accent"
        >
          <span>Try again</span>
        </button>
        <Link href="/" className="ed-link">
          <span>← Back to Work</span>
        </Link>
      </div>
    </div>
  );
}
