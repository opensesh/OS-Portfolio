"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components/shared/button";
import { wordContainer, wordReveal, fadeInUp } from "@/lib/motion";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useTypewriter } from "@/hooks/use-typewriter";
import { devProps } from "@/utils/dev-props";

const CRTTVScene = dynamic(
  () =>
    import("@/components/three/crt-tv-scene").then((mod) => ({
      default: mod.CRTTVScene,
    })),
  { ssr: false }
);

const HEADLINE = "We're a design company focused on";
const headlineWords = HEADLINE.split(" ");

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

  const displayText = useTypewriter({
    phrases: ROTATING_PHRASES,
    typeSpeed: 80,
    deleteSpeed: 40,
    pauseDuration: 2000,
    startDelay: 1200,
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Sync Framer Motion value to a plain ref for Three.js to read
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="relative h-[300vh]" {...devProps('Hero')}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D Canvas — full viewport, behind text */}
        <div className="absolute inset-0 z-0">
          <CRTTVScene
            scrollRef={scrollRef}
            mouseRef={mouseRef}
            className="h-full w-full"
          />
        </div>

        {/* Hero text — left column, fades on scroll */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="container-main relative z-10 h-full flex items-center pointer-events-none"
        >
          <div className="w-full lg:w-1/2">
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="section-label mb-6"
            >
              Design & Technology
            </motion.p>

            {/* Static headline — widest line in the staircase */}
            <motion.h1
              variants={wordContainer}
              initial="hidden"
              animate="visible"
              className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4"
            >
              {headlineWords.map((word, index) => (
                <motion.span
                  key={index}
                  variants={wordReveal}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Typewriter line — OffBit 101 Bold, brand color */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
              className="flex items-center mb-8"
              aria-label={ROTATING_PHRASES.join(", ")}
            >
              <span className="font-accent uppercase tracking-wider text-fg-brand text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                {displayText}
              </span>
              <span
                className="inline-block w-[3px] h-[0.8em] bg-fg-brand ml-1 align-middle"
                style={{ animation: "cursor-blink 1.06s step-end infinite" }}
                aria-hidden="true"
              />
            </motion.div>

            {/* Description — narrower than headline for staircase taper */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-fg-secondary max-w-md mb-10"
            >
              We help the world make the most of design and technology. From
              brand identity to digital products, we craft experiences that
              matter.
            </motion.p>

            {/* CTAs — left-aligned, smallest footprint */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
              className="flex gap-4 pointer-events-auto"
            >
              <Button href="/contact" size="lg">
                Start a Project
              </Button>
              <Button href="/projects" variant="secondary" size="lg">
                View Our Work
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator — fades with text */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
