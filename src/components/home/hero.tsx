"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components/shared/button";
import { wordContainer, wordReveal, fadeInUp } from "@/lib/motion";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { devProps } from "@/utils/dev-props";

const CRTTVScene = dynamic(
  () =>
    import("@/components/three/crt-tv-scene").then((mod) => ({
      default: mod.CRTTVScene,
    })),
  { ssr: false }
);

const headline =
  "We're a design company focused on brand systems, creative AI, and community.";
const words = headline.split(" ");

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<number>(0);
  const mouseRef = useMousePosition();

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
      <div className="sticky top-0 h-screen flex items-start pt-28 md:pt-32 overflow-hidden">
        {/* 3D Canvas — full viewport, centered, behind text */}
        <div className="absolute inset-0 z-0">
          <CRTTVScene
            scrollRef={scrollRef}
            mouseRef={mouseRef}
            className="h-full w-full"
          />
        </div>

        {/* Hero text — fades out as you scroll, pointer-events-none so drag passes to canvas */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="container-main relative z-10 pointer-events-none"
        >
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-label mb-6"
          >
            Design & Technology
          </motion.p>

          {/* Headline with word-by-word animation */}
          <motion.h1
            variants={wordContainer}
            initial="hidden"
            animate="visible"
            className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mb-8"
          >
            {words.map((word, index) => (
              <motion.span
                key={index}
                variants={wordReveal}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-fg-secondary max-w-2xl mb-10"
          >
            We help the world make the most of design and technology. From brand
            identity to digital products, we craft experiences that matter.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 pointer-events-auto"
          >
            <Button href="/contact" size="lg">
              Start a Project
            </Button>
            <Button href="/projects" variant="secondary" size="lg">
              View Our Work
            </Button>
          </motion.div>
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
