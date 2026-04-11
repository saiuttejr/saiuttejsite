"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const navItems = [
  { label: "Projects", href: "#work" },
  { label: "Timeline", href: "#about" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!overlayRef.current) return;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
        onStart: () => {
          overlayRef.current!.style.pointerEvents = "auto";
        },
      });
      const links = overlayRef.current.querySelectorAll(".nav-link");
      gsap.fromTo(
        links,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.06, delay: 0.15 }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power3.out",
        onComplete: () => {
          if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
        },
      });
    }
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    },
    []
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-700 ease-[var(--ease-out)] ${scrolled ? "pt-3" : "pt-4 md:pt-5"}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="editorial-shell">
          <div
            className={`nav-pill flex items-center gap-3 px-3 py-3 md:px-5 md:py-3.5 transition-all duration-700 ease-[var(--ease-out)] ${scrolled ? "nav-pill--glass" : ""}`}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex min-w-0 shrink-0 flex-col items-start text-text transition-colors duration-300 hover:text-accent"
              data-cursor-hover
              data-cursor-label="top"
            >
              <span className="font-logo whitespace-nowrap text-[1.05rem] tracking-[0.22em] md:text-[1.14rem]">
                SAI UTTEJ R
              </span>
              <span
                className={`hidden overflow-hidden whitespace-nowrap font-mono text-[10px] tracking-[0.12em] text-text-dim transition-all duration-500 md:block ${scrolled ? "max-h-0 max-w-0 opacity-0" : "max-h-8 max-w-[360px] opacity-100"}`}
              >
                backend systems · product-minded builds
              </span>
            </a>

            <div className="flex-1" />

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`rounded-full border px-3.5 py-2 font-mono text-[10px] tracking-[0.12em] transition-all duration-300 ${activeSection === item.href ? "border-accent/40 bg-accent/10 text-text" : "border-transparent text-text-muted hover:border-white/10 hover:bg-white/5 hover:text-text"}`}
                  data-cursor-hover
                  data-cursor-label={item.label.toLowerCase()}
                >
                  {item.label}
                </a>
              ))}

              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="button-secondary ml-1 min-h-0 px-4 py-1.5"
                data-cursor-hover
                data-cursor-label="contact"
              >
                Contact
              </a>
            </div>

            <button
              className="button-secondary min-h-0 min-w-[3.8rem] px-3 py-1.5 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen ? "true" : "false"}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              data-cursor-hover
              data-cursor-label="menu"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </nav>

      <div
        ref={overlayRef}
        id="mobile-navigation"
        className="nav-overlay fixed inset-0 z-40 flex items-center justify-center px-4"
      >
        <div className="glass-section w-full max-w-md px-6 py-8 md:px-8 md:py-10">
          <div className="flex flex-col items-center gap-4 text-center">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="nav-link font-display text-[clamp(2.3rem,8vw,4.2rem)] leading-none tracking-[0.12em] text-text transition-colors duration-300 hover:text-accent"
                data-cursor-hover
                data-cursor-label={item.label.toLowerCase()}
              >
                {item.label}
              </a>
            ))}

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
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
