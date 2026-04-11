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
      className="section-screen px-4 pt-24 pb-8 md:px-8 md:pt-28 md:pb-10 lg:px-12"
    >
      <div className="absolute inset-x-0 top-[16%] h-[18rem] bg-[radial-gradient(circle,_rgba(143,200,234,0.12),_transparent_62%)] blur-3xl" aria-hidden="true" />
      <div className="absolute right-[-8%] top-[38%] h-[20rem] w-[20rem] bg-[radial-gradient(circle,_rgba(240,91,43,0.11),_transparent_62%)] blur-3xl" aria-hidden="true" />

      <div className="editorial-shell flex min-h-[calc(100svh-6rem)] items-end">
        <div className="w-full pb-8 pt-10 md:pb-10 md:pt-14">
          <div className="hero-reveal flex flex-wrap items-center gap-4">
            <span className="section-kicker">Sai Uttej Rajoju</span>
            <span className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
              software engineer · Hyderabad
            </span>
          </div>

          <div className="mt-8 grid gap-10 border-t border-line pt-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(260px,0.72fr)] lg:gap-14 lg:pt-10">
            <div className="max-w-[44rem]">
              <h1 className="text-text">
                <span className="block overflow-hidden">
                  <span className="hero-title-line block font-editorial text-[clamp(2.8rem,10vw,6.2rem)] leading-[0.94] tracking-[-0.06em]">
                    Backend systems,
                  </span>
                </span>
                <span className="mt-1 block overflow-hidden">
                  <span className="hero-title-line block font-editorial text-[clamp(2.8rem,10vw,6.2rem)] leading-[0.94] tracking-[-0.06em] text-[#dce5ef]">
                    with a product sense.
                  </span>
                </span>
              </h1>

              <p className="hero-reveal mt-7 max-w-[36rem] text-[1rem] leading-[1.92] text-text-muted md:text-[1.04rem]">
                I work on backend services at MAQ Software, and I build a few
                things of my own when an idea feels worth pursuing.
              </p>

              <div className="hero-reveal mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#work")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="button-primary"
                  data-cursor-hover
                  data-cursor-label="work"
                >
                  Selected work
                </a>
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="link-underline font-mono text-[10px] tracking-[0.12em] text-text-muted transition-colors duration-300 hover:text-text"
                  data-cursor-hover
                  data-cursor-label="email"
                >
                  {socialLinks.email}
                </a>
              </div>
            </div>

            <div className="hero-reveal lg:pt-6">
              <div className="space-y-6 border-t border-line pt-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                    Current role
                  </p>
                  <p className="mt-2 text-[1rem] leading-[1.72] text-text">
                    Software Engineer 1 at MAQ Software.
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                    Own projects
                  </p>
                  <p className="mt-2 text-[0.98rem] leading-[1.78] text-text-muted">
                    Eatensity, figuretools, and Kanso.
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] tracking-[0.12em] text-text-dim">
                    Away from work
                  </p>
                  <p className="mt-2 text-[0.98rem] leading-[1.78] text-text-muted">
                    Usually chess on <a href={socialLinks.lichess} target="_blank" rel="noopener noreferrer" className="link-underline text-text" data-cursor-hover data-cursor-label="lichess">Lichess</a>, anime,
                    F1 weekends, and anything with two or four wheels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
