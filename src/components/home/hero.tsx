"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { ActionButton } from "@/components/shared/action-button";
import { UnderlineLink } from "@/components/shared/underline-link";
import { fadeInUp } from "@/lib/motion";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useTypewriter } from "@/hooks/use-typewriter";
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
  "brand design systems",
  "user experience",
  "product design",
  "creative AI",
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<number>(0);
  const mouseRef = useMousePosition();
  const { resolvedTheme } = useTheme();
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
        <div className="absolute inset-0 z-[-1] opacity-25">
          <FaultyTerminal
            tint="#fe5102"
            backgroundColor={terminalBg}
            scale={2}
            digitSize={0.8}
            timeScale={0.3}
            noiseAmp={1}
            brightness={0.3}
            scanlineIntensity={0.3}
            curvature={0.19}
            mouseStrength={0.5}
            mouseReact
            pageLoadAnimation
          />
        </div>

        {/* 3D Canvas — full viewport, positioning handled by Three.js camera */}
        <div className="absolute inset-0 z-0">
          <CRTTVScene
            scrollRef={scrollRef}
            mouseRef={mouseRef}
            className="h-full w-full"
          />
        </div>

        {/* Hero text — left half, fades on scroll */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="relative z-10 h-full pointer-events-none"
        >
          <div className="container-wide h-full flex items-center pt-20">
            <div className="w-full lg:w-1/2">
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="section-label mb-6"
            >
              We are the next generation of creativity.
            </motion.p>

            {/* Headline line 1 — single line across viewports */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.25rem] whitespace-nowrap"
            >
               Design company
            </motion.h1>

            {/* Headline line 2 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.25rem] mb-3"
            >
              focused on
            </motion.p>

            {/* Typewriter — OffBit 101 Bold, zero kerning, brand color */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
              className="flex items-center mb-8 min-h-[1.2em]"
              aria-label={ROTATING_PHRASES.join(", ")}
            >
              <span className="font-accent font-bold uppercase tracking-[0] text-fg-brand text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none">
                {displayedText}
              </span>
              <span
                className="inline-block text-fg-brand ml-0.5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                style={{ animation: "cursor-blink 0.5s step-end infinite" }}
                aria-hidden="true"
              >
                &#x2588;
              </span>
            </motion.div>

            {/* Description — narrower for staircase taper */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
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
              animate="visible"
              transition={{ delay: 0.8 }}
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
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
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
