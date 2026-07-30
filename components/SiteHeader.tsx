import Link from "next/link";

/**
 * Header for the sub-pages. The home page uses Navigation, which additionally
 * tracks the active section — there is nothing to track here.
 */
export default function SiteHeader({ label = "Sai Uttej Rajoju" }: { label?: string }) {
  return (
    <nav
      className="fixed inset-x-0 top-0 z-40 px-4 pt-4 md:px-8 md:pt-5 lg:px-12"
      aria-label="Main"
    >
      <div className="editorial-shell">
        <div className="nav-pill nav-pill--glass flex items-center justify-between gap-4 px-4 py-3 md:px-5 md:py-3.5">
          <Link
            href="/"
            className="flex min-w-0 flex-col items-start text-text-primary transition-colors duration-300 hover:text-accent"
            data-cursor-hover
            data-cursor-label="home"
          >
            <span className="font-logo whitespace-nowrap text-[1.05rem] tracking-[0.22em] md:text-[1.14rem]">
              SAI UTTEJ R
            </span>
            <span className="label hidden md:block">{label}</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/work" className="nav-chip">
              Work
            </Link>
            <Link href="/about" className="nav-chip">
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
