"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

let consoleGreeted = false;

export function MotionRuntime() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    root.dataset.room = pathname?.startsWith("/space") ? "space" : "work";

    if (!consoleGreeted) {
      consoleGreeted = true;
      console.log(
        "%cHey, I’m Sai.%c  saiuttej.r@gmail.com · github.com/saiuttejr · Tip: click my glasses or type \"lights\" anywhere.",
        "background:#1447e6;color:#fff;font-weight:700;padding:4px 10px;border-radius:999px",
        "color:#08112b;font-weight:600"
      );
    }

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const revealElement = (el: HTMLElement) => {
      if (el.classList.contains("is-in")) return;
      el.classList.add("is-in");
      const idx = Number(el.style.getPropertyValue("--i") || 0);
      if (typeof el.animate === "function") {
        el.animate(
          [
            { opacity: 0.01, transform: "translateY(18px)" },
            { opacity: 1, transform: "translateY(0px)" },
          ],
          {
            duration: 580,
            delay: idx * 65,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          }
        );
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          revealElement(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "0px 0px -4% 0px",
        threshold: 0.06,
      }
    );

    targets.forEach((el) => observer.observe(el));

    const timer = window.setTimeout(() => {
      targets.forEach(revealElement);
    }, 1600);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    let buffer = "";
    let konamiIdx = 0;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      konamiIdx =
        e.key === KONAMI[konamiIdx]
          ? konamiIdx + 1
          : Number(e.key === KONAMI[0]);

      if (e.key.length === 1) {
        buffer = (buffer + e.key.toLowerCase()).slice(-6);
      }

      if (konamiIdx === KONAMI.length || buffer === "lights") {
        konamiIdx = 0;
        buffer = "";
        const playSection = document.getElementById("play");
        if (playSection) {
          playSection.scrollIntoView({ behavior: "smooth", block: "center" });
          window.dispatchEvent(new CustomEvent("sai:lights-out"));
        } else {
          router.push("/space?lights=1#play");
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
