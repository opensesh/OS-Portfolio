"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useGlitch } from "react-powerglitch";
import { useTextScramble } from "@/hooks/use-text-scramble";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { devProps } from "@/utils/dev-props";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface ImpactStat {
  value: string;
  label: string;
}

const STATS: ImpactStat[] = [
  { value: "$1B+", label: "TOUCHED IN PIPELINE" },
  { value: "$300M+", label: "DRIVEN IN SALES" },
  { value: "5M+", label: "AUDIENCE REACHED" },
  { value: "2M+", label: "APP USERS TOUCHED" },
  { value: "15+", label: "BRANDS PARTNERED" },
];

interface CarouselSlide {
  type: "video" | "image";
  src: string | null; // null = placeholder
  alt: string;
}

const SLIDES: CarouselSlide[] = [
  { type: "video", src: null, alt: "Project highlight reel" },
  { type: "image", src: null, alt: "Brand campaign" },
  { type: "video", src: null, alt: "Product launch" },
  { type: "image", src: null, alt: "Design system showcase" },
  { type: "image", src: null, alt: "Client collaboration" },
];

// ---------------------------------------------------------------------------
// Glitch Stat – each stat number gets the CRT powerglitch
// ---------------------------------------------------------------------------

function GlitchStat({ stat, index, isInView }: { stat: ImpactStat; index: number; isInView: boolean }) {
  const glitch = useGlitch({
    playMode: "always",
    timing: {
      duration: 4000 + index * 800,
      iterations: Infinity,
      easing: "ease-in-out",
    },
    glitchTimeSpan: { start: 0.4, end: 0.6 },
    shake: {
      velocity: 10,
      amplitudeX: 0.1,
      amplitudeY: 0.15,
    },
    slice: {
      count: 3,
      velocity: 12,
      minHeight: 0.02,
      maxHeight: 0.12,
      hueRotate: true,
    },
  });

  const { displayText: labelText, trigger: triggerLabel } = useTextScramble(stat.label, {
    duration: 600,
  });

  const hasTriggered = useRef(false);

  useEffect(() => {
    if (isInView && !hasTriggered.current) {
      hasTriggered.current = true;
      const timeout = setTimeout(() => triggerLabel(), 200 + index * 120);
      return () => clearTimeout(timeout);
    }
  }, [isInView, triggerLabel, index]);

  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-col gap-2"
    >
      {/* Number with powerglitch */}
      <div ref={glitch.ref} className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-fg-primary">
        {stat.value}
      </div>
      {/* Label with scramble effect */}
      <p className="font-accent text-[10px] sm:text-xs font-bold uppercase tracking-widest text-fg-tertiary">
        {isInView ? labelText : stat.label}
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Carousel
// ---------------------------------------------------------------------------

function MediaCarousel() {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;

  const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total]);

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-bg-secondary border border-border-secondary">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {SLIDES[current].src ? (
            SLIDES[current].type === "video" ? (
              <video
                src={SLIDES[current].src!}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={SLIDES[current].src!}
                alt={SLIDES[current].alt}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            /* Placeholder */
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-bg-secondary">
              <div className="w-12 h-12 rounded-full border border-border-secondary flex items-center justify-center">
                {SLIDES[current].type === "video" ? (
                  <div className="w-0 h-0 border-l-[10px] border-l-fg-tertiary border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
                ) : (
                  <div className="w-5 h-5 rounded-sm border border-fg-tertiary opacity-40" />
                )}
              </div>
              <span className="font-accent text-[10px] uppercase tracking-widest text-fg-tertiary">
                {SLIDES[current].type === "video" ? "Video" : "Image"} — {SLIDES[current].alt}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-bg-primary/80 backdrop-blur-sm border border-border-secondary flex items-center justify-center hover:bg-bg-primary transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 text-fg-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-bg-primary/80 backdrop-blur-sm border border-border-secondary flex items-center justify-center hover:bg-bg-primary transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 text-fg-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-fg-brand w-4" : "bg-fg-tertiary/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Section
// ---------------------------------------------------------------------------

export function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-bg-primary"
      {...devProps("ImpactSection")}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container-main"
      >
        {/* Section header */}
        <motion.div variants={fadeInUp} className="mb-12 md:mb-16">
          <p className="section-label mb-4">Our Impact</p>
          <h2 className="text-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-2xl">
            Numbers that tell our story
          </h2>
        </motion.div>

        {/* Two-column layout: stats + carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Stats tiles */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8 md:gap-x-8 md:gap-y-10 content-start"
          >
            {STATS.map((stat, i) => (
              <GlitchStat key={stat.label} stat={stat} index={i} isInView={isInView} />
            ))}
          </motion.div>

          {/* Media carousel */}
          <motion.div variants={fadeInUp}>
            <MediaCarousel />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
