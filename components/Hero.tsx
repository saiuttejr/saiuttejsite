"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { socialLinks } from "@/lib/constants";
import {
  DURATION,
  EASE_CINEMATIC,
  EASE_OUT,
  clipReveal,
  fadeUp,
} from "@/lib/animations";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const context = gsap.context(() => {
      const titleLines = gsap.utils.toArray<HTMLElement>(".hero-title-line");
      const revealItems = gsap.utils.toArray<HTMLElement>(".hero-reveal");

      if (prefersReducedMotion) {
        gsap.set(titleLines, { ...clipReveal.to });
        gsap.set(revealItems, { ...fadeUp.to });
        return;
      }

      gsap.set(titleLines, { ...clipReveal.from });
      gsap.set(revealItems, { ...fadeUp.from });

      const timeline = gsap.timeline({ delay: 0.2 });

      timeline.to(titleLines, {
        ...clipReveal.to,
        duration: DURATION.reveal,
        ease: EASE_CINEMATIC,
        stagger: 0.14,
      });

      timeline.to(
        revealItems,
        {
          ...fadeUp.to,
          duration: DURATION.normal,
          ease: EASE_OUT,
          stagger: 0.08,
        },
        "-=1"
      );
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-screen px-4 pt-28 pb-10 md:px-8 md:pt-32 lg:px-12"
    >
      <div className="hero-glow" aria-hidden="true" />

      <div className="editorial-shell flex min-h-[calc(100svh-9rem)] flex-col justify-between gap-14">
        <div className="pt-6 md:pt-10">
          <div className="hero-reveal flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="section-kicker">Sai Uttej Rajoju</span>
            <span className="label">Software engineer · Hyderabad, India</span>
          </div>

          <h1 className="display-xl mt-10 max-w-[15ch]">
            <span className="block overflow-hidden">
              <span className="hero-title-line block">Backend systems,</span>
            </span>
            <span className="mt-1 block overflow-hidden">
              <span className="hero-title-line block">
                and the <em className="hero-em">agents</em> on top.
              </span>
            </span>
          </h1>

          <p className="hero-reveal hero-lede mt-10">
            By day, backend services at MAQ Software. Lately I&apos;ve been
            building a layer up — the AI and agent systems that sit on top —
            and on the side, I ship products of my own.
          </p>

          <div className="hero-reveal mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#work"
              className="button-primary"
              data-cursor-hover
              data-cursor-label="work"
            >
              Selected work
            </a>
            <a
              href={`mailto:${socialLinks.email}`}
              className="link-underline label text-text-secondary transition-colors duration-300 hover:text-text-primary"
              data-cursor-hover
              data-cursor-label="email"
            >
              {socialLinks.email}
            </a>
          </div>
        </div>

        {/* A masthead rail rather than another sticky-label column, so the hero
            does not share a layout archetype with any section below it. */}
        <dl className="hero-reveal hero-rail">
          <div>
            <dt className="label">Now</dt>
            <dd className="hero-rail__value">Software Engineer&nbsp;1, MAQ Software</dd>
          </div>
          <div>
            <dt className="label">Building</dt>
            <dd className="hero-rail__value">Eatensity, figuretools, Kanso</dd>
          </div>
          <div>
            <dt className="label">Working in</dt>
            <dd className="hero-rail__value">C#, .NET, Azure AI, TypeScript</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
