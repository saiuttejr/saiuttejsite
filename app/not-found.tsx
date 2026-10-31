import Link from "next/link";

export default function NotFound() {
  return (
    <div data-room="work">
      <main id="main" tabIndex={-1} className="editorial-beat">
        <p className="beat-numeral">404 — Page not found</p>
        <h1 className="statement-huge">Nothing at this address.</h1>
        <div className="editorial-links" style={{ marginTop: "2rem" }}>
          <Link href="/" className="ed-link ed-link-accent">
            <span>← Back to Work</span>
          </Link>
          <Link href="/space" className="ed-link">
            <span>After Hours →</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
