"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

let consoleGreeted = false;

export function syncThemeColor(room: string | undefined) {
  const color = room === "space" ? "#6a3d45" : "#fafbfe";
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = color;
}

export function MotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const initialRoom = pathname?.startsWith("/space") ? "space" : "work";
    root.dataset.room = initialRoom;
    syncThemeColor(initialRoom);

    if (!consoleGreeted) {
      consoleGreeted = true;
      console.log(
        "%cHey, I’m Sai.%c  saiuttej.r@gmail.com · github.com/saiuttejr",
        "background:#1447e6;color:#fff;font-weight:700;padding:4px 10px;border-radius:999px",
        "color:#08112b;font-weight:600"
      );
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealElement = (el: HTMLElement) => {
      if (el.classList.contains("is-in")) return;
      el.classList.add("is-in");
      if (prefersReduced) return;
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

    const observer =
      !prefersReduced && "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries, obs) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                revealElement(entry.target as HTMLElement);
                obs.unobserve(entry.target);
              }
            },
            {
              rootMargin: "0px 0px -4% 0px",
              threshold: 0.06,
            }
          )
        : null;

    let fallbackTimer = 0;

    const bindReveals = () => {
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")
      );
      if (!observer) {
        targets.forEach((el) => el.classList.add("is-in"));
        return;
      }
      targets.forEach((el) => observer.observe(el));
      window.clearTimeout(fallbackTimer);
      fallbackTimer = window.setTimeout(() => {
        targets.forEach(revealElement);
      }, 1600);
    };

    bindReveals();

    const roomObserver = new MutationObserver(() => {
      syncThemeColor(root.dataset.room);
      window.requestAnimationFrame(bindReveals);
    });
    roomObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-room"],
    });

    return () => {
      roomObserver.disconnect();
      observer?.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, [pathname]);

  return null;
}
