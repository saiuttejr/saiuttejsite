"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Timeline", href: "#about" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggers = navItems.map((item) => {
      const el = document.querySelector(item.href);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(item.href),
        onEnterBack: () => setActiveSection(item.href),
      });
    });

    let rafPending = false;
    const scrollHandler = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 100);
        rafPending = false;
      });
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      triggers.forEach((t) => t?.kill());
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  // Focus management for the mobile overlay: trap Tab inside it while open,
  // close on Escape, and return focus to the toggle on close.
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !overlay.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-700 ease-[var(--ease-out)] ${scrolled ? "pt-3" : "pt-4 md:pt-5"}`}
        aria-label="Main"
      >
        <div className="editorial-shell">
          <div
            className={`nav-pill flex items-center gap-3 px-3 py-3 md:px-5 md:py-3.5 transition-all duration-700 ease-[var(--ease-out)] ${scrolled ? "nav-pill--glass" : ""}`}
          >
            <Link
              href="/"
              className="flex min-w-0 shrink-0 flex-col items-start text-text transition-colors duration-300 hover:text-accent"
              data-cursor-hover
              data-cursor-label="top"
            >
              <span className="font-logo whitespace-nowrap text-[1.05rem] tracking-[0.22em] md:text-[1.14rem]">
                SAI UTTEJ R
              </span>
              <span
                className={`hidden overflow-hidden whitespace-nowrap font-mono text-xs tracking-[0.08em] text-text-dim transition-all duration-500 md:block ${scrolled ? "max-h-0 max-w-0 opacity-0" : "max-h-8 max-w-[360px] opacity-100"}`}
              >
                backend · ai agents · product builds
              </span>
            </Link>

            <div className="flex-1" />

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-current={activeSection === item.href ? "true" : undefined}
                  className={`rounded-full border px-3.5 py-2 font-mono text-xs tracking-[0.08em] transition-all duration-300 ${activeSection === item.href ? "border-accent/40 bg-accent/10 text-text" : "border-transparent text-text-muted hover:border-white/10 hover:bg-white/5 hover:text-text"}`}
                  data-cursor-hover
                  data-cursor-label={item.label.toLowerCase()}
                >
                  {item.label}
                </a>
              ))}

              <a
                href="#contact"
                className="button-secondary ml-1 px-4 py-1.5"
                data-cursor-hover
                data-cursor-label="contact"
              >
                Contact
              </a>
            </div>

            {/* The hidden utility lives on the wrapper: `.button-secondary` sets
                `display` from unlayered CSS, which outranks Tailwind's utilities
                layer and would defeat `md:hidden` on the button itself. */}
            <div className="md:hidden">
              <button
                ref={toggleRef}
                className="button-secondary min-w-[3.8rem] px-3 py-1.5"
                onClick={() => setMenuOpen((open) => !open)}
                type="button"
                aria-controls="mobile-navigation"
                aria-expanded={menuOpen}
                data-cursor-hover
                data-cursor-label="menu"
              >
                {menuOpen ? "Close" : "Menu"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        ref={overlayRef}
        id="mobile-navigation"
        inert={!menuOpen}
        className={`nav-overlay fixed inset-0 z-40 flex items-center justify-center px-4 ${menuOpen ? "nav-overlay--open" : ""}`}
      >
        <div className="glass-section w-full max-w-md px-6 py-8 md:px-8 md:py-10">
          <div className="flex flex-col items-center gap-4 text-center">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="nav-link font-display text-[clamp(2.3rem,8vw,4.2rem)] leading-none tracking-[0.12em] text-text transition-colors duration-300 hover:text-accent"
                data-cursor-hover
                data-cursor-label={item.label.toLowerCase()}
              >
                {item.label}
              </a>
            ))}

            <a
              href="#contact"
              onClick={closeMenu}
              className="nav-link button-primary mt-4"
              data-cursor-hover
              data-cursor-label="contact"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
