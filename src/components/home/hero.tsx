"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { ActionButton } from "@/components/shared/action-button";
import { UnderlineLink } from "@/components/shared/underline-link";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { fadeInUp } from "@/lib/motion";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useTypewriter } from "@/hooks/use-typewriter";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { usePageLoaded } from "@/hooks/use-page-loaded";
import { useTheme } from "@/components/providers/theme-provider";
import { devProps } from "@/utils/dev-props";

const CRTTVScene = dynamic(
  () =>
    import("@/components/three/crt-tv-scene").then((mod) => ({
      default: mod.CRTTVScene,
    })),
  { ssr: false }
);

const FaultyTerminal = dynamic(
  () => import("@/components/backgrounds/faulty-terminal"),
  { ssr: false }
);

const ROTATING_PHRASES = [
  "brand identity",
  "design systems",
  "user experience",
  "product design",
  "creative AI",
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<number>(0);
  const mouseRef = useMousePosition();
  const isDesktop = useBreakpoint("lg");
  const { resolvedTheme } = useTheme();
  const pageLoaded = usePageLoaded();
  const terminalBg = resolvedTheme === "dark" ? "#191919" : "#faf8f5";

  const { displayedText } = useTypewriter({
    text: ROTATING_PHRASES,
    typingSpeed: 185,
    deletingSpeed: 50,
    pauseDuration: 1500,
    initialDelay: 1000,
    loop: true,
    variableSpeed: { min: 60, max: 120 },
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Canvas translateX: starts shifted right 25% on desktop so TV is in right half,
  // slides back to 0 on scroll so TV centers. Canvas stays full viewport width.
  const tvX = useTransform(
    scrollYProgress,
    [0, 0.3],
    [isDesktop ? "25%" : "0%", "0%"]
  );

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="relative h-[300vh]" {...devProps('Hero')}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Faulty Terminal background — full-bleed behind everything */}
        <div className="absolute inset-0 z-[-1] opacity-15">
          <FaultyTerminal
            tint="#fe5102"
            backgroundColor={terminalBg}
            scale={3}
            digitSize={0.6}
            timeScale={0.3}
            noiseAmp={0.3}
            brightness={1}
            scanlineIntensity={0.3}
            glitchAmount={1}
            flickerAmount={1}
            curvature={0}
            mouseStrength={0.5}
            mouseReact
            pageLoadAnimation
          />
        </div>

        {/* 3D Canvas — full viewport, translated right on desktop so TV starts in right half */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ x: tvX }}
        >
          <CRTTVScene
            scrollRef={scrollRef}
            mouseRef={mouseRef}
            className="h-full w-full"
          />
        </motion.div>

        {/* Hero text — left half, fades on scroll */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="relative z-10 h-full pointer-events-none"
        >
          <div className="container-wide h-full flex items-center pb-[20vh]">
            <div className="w-full lg:w-1/2">
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={pageLoaded ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="section-label mb-6"
            >
              A modern design studio.
            </motion.p>

            {/* Headline — block-wipe reveal */}
            <TextBlockReveal
              as="h1"
              trigger="after-loader"
              delay={0.1}
              stagger={0.15}
              className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.25rem]"
            >
              {"Brand strategy meets\ndesign systems"}
            </TextBlockReveal>

            {/* Typewriter — appears after heading reveal */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={pageLoaded ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.95 }}
              className="mb-6 flex items-baseline gap-x-3"
              aria-label={`focused on ${ROTATING_PHRASES.join(", ")}`}
            >
              <span
                className="uppercase tracking-[0] leading-none text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.75rem] inline-flex items-baseline"
                style={{ fontFamily: "var(--font-accent)", fontWeight: 700, color: "#fe5102" }}
              >
                {displayedText}
                <span
                  className="inline-block ml-0.5 w-[0.45em] h-[0.85em] bg-[#fe5102]"
                  style={{ animation: "cursor-blink 0.5s step-end infinite" }}
                  aria-hidden="true"
                />
              </span>
            </motion.p>

            {/* Description — narrower for staircase taper */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate={pageLoaded ? "visible" : undefined}
              transition={{ delay: 1.2 }}
              className="text-base md:text-lg text-fg-secondary max-w-sm mb-10"
            >
              We help the world make the most of design and technology. From
              brand identity to digital products, we craft experiences that
              matter.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={pageLoaded ? "visible" : undefined}
              transition={{ delay: 1.35 }}
              className="flex gap-4 pointer-events-auto"
            >
              <ActionButton href="/contact" size="lg" variant="brand">
                Start a Project
              </ActionButton>
              <UnderlineLink
                href="/projects"
                className="self-center text-sm font-body font-medium uppercase tracking-normal text-fg-primary"
              >
                View Our Work
              </UnderlineLink>
            </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom gradient fade — blends into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--bg-primary))" }}
        />

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={pageLoaded ? { opacity: 1 } : undefined}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-6 h-10 border-2 border-border-primary rounded-full flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-fg-tertiary rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
