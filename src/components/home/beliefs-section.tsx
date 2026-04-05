"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@untitledui-pro/icons/line";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/shared/section-label";
import { DotPattern } from "@/components/ui/dot-pattern";
import { devProps } from "@/utils/dev-props";

interface Belief {
  label: string;
  segments: { text: string; bold: boolean }[];
}

const beliefs: Belief[] = [
  {
    label: "I believe",
    segments: [
      { text: '"Design should be ', bold: true },
      { text: "easy to understand ", bold: false },
      { text: "because ", bold: true },
      { text: "simple ideas ", bold: false },
      { text: 'are quicker to grasp..."', bold: true },
    ],
  },
  {
    label: "We believe",
    segments: [
      { text: '"Technology works best ', bold: true },
      { text: "when it disappears ", bold: false },
      { text: "into ", bold: true },
      { text: "the experience ", bold: false },
      { text: 'it enables."', bold: true },
    ],
  },
  {
    label: "We believe",
    segments: [
      { text: '"Great brands ', bold: true },
      { text: "aren't built ", bold: false },
      { text: "overnight— ", bold: true },
      { text: "they're shaped ", bold: false },
      { text: 'through craft and conviction."', bold: true },
    ],
  },
  {
    label: "We believe",
    segments: [
      { text: '"The best work ', bold: true },
      { text: "happens when strategy ", bold: false },
      { text: "and creativity ", bold: true },
      { text: "stop being ", bold: false },
      { text: 'treated as opposites."', bold: true },
    ],
  },
];

export function BeliefsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (dir: -1 | 1) => {
      setDirection(dir);
      setCurrentIndex((prev) => (prev + dir + beliefs.length) % beliefs.length);
    },
    []
  );

  const current = beliefs[currentIndex];

  const slideVariants = {
    enter: (d: number) => ({
      x: d > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-bg-primary"
      {...devProps("BeliefsSection")}
    >
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel className="mb-4">Our Beliefs</SectionLabel>
          </motion.div>
        </div>

        {/* Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative flex flex-col items-center border border-brand-500">
            <DotPattern width={5} height={5} />

            {/* Corner markers */}
            <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-brand-500" />
            <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-brand-500" />
            <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-brand-500" />
            <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-brand-500" />

            {/* Quote content */}
            <div className="relative z-10 w-full overflow-hidden py-10 px-8 md:p-16 lg:py-20 lg:px-20 min-h-[280px] md:min-h-[380px] lg:min-h-[480px] flex items-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <p className="text-sm md:text-lg lg:text-xl text-brand-500 mb-3 md:mb-4 font-medium italic">
                    {current.label}
                  </p>
                  <div className="text-2xl md:text-5xl lg:text-7xl xl:text-8xl tracking-tight leading-[1.1] text-fg-primary">
                    {current.segments.map((seg, i) => (
                      <span
                        key={i}
                        className={seg.bold ? "font-bold" : "font-light"}
                      >
                        {seg.text}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-end gap-3 mt-6">
            {/* Counter */}
            <span className="text-sm text-fg-tertiary font-mono mr-2">
              {String(currentIndex + 1).padStart(2, "0")} / {String(beliefs.length).padStart(2, "0")}
            </span>

            <button
              onClick={() => goTo(-1)}
              className={cn(
                "flex items-center justify-center",
                "w-10 h-10 rounded-full",
                "border border-border-secondary",
                "text-fg-secondary hover:text-fg-primary",
                "hover:border-border-primary hover:bg-bg-secondary",
                "transition-all duration-200"
              )}
              aria-label="Previous belief"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => goTo(1)}
              className={cn(
                "flex items-center justify-center",
                "w-10 h-10 rounded-full",
                "border border-border-secondary",
                "text-fg-secondary hover:text-fg-primary",
                "hover:border-border-primary hover:bg-bg-secondary",
                "transition-all duration-200"
              )}
              aria-label="Next belief"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
