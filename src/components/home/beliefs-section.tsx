"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@untitledui-pro/icons/line";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/shared/section-label";
import { DotPattern } from "@/components/ui/dot-pattern";
import { devProps } from "@/utils/dev-props";

interface Belief {
  label: string;
  segments: { text: string; bold: boolean }[];
  author: {
    name: string;
    initials: string;
    href: string;
  };
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
    author: {
      name: "Karim Bouhdary",
      initials: "KB",
      href: "/about#karim-bouhdary",
    },
  },
  {
    label: "I believe",
    segments: [
      { text: '"Technology works best ', bold: true },
      { text: "when it disappears ", bold: false },
      { text: "into ", bold: true },
      { text: "the experience ", bold: false },
      { text: 'it enables."', bold: true },
    ],
    author: {
      name: "Morgan McKean",
      initials: "MM",
      href: "/about#morgan-mckean",
    },
  },
  {
    label: "I believe",
    segments: [
      { text: '"Great brands ', bold: true },
      { text: "aren't built ", bold: false },
      { text: "overnight— ", bold: true },
      { text: "they're shaped ", bold: false },
      { text: 'through craft and conviction."', bold: true },
    ],
    author: {
      name: "Karim Bouhdary",
      initials: "KB",
      href: "/about#karim-bouhdary",
    },
  },
  {
    label: "I believe",
    segments: [
      { text: '"The best work ', bold: true },
      { text: "happens when strategy ", bold: false },
      { text: "and creativity ", bold: true },
      { text: "stop being ", bold: false },
      { text: 'treated as opposites."', bold: true },
    ],
    author: {
      name: "Morgan McKean",
      initials: "MM",
      href: "/about#morgan-mckean",
    },
  },
];

export function BeliefsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback((dir: -1 | 1) => {
    setDirection(dir);
    setCurrentIndex((prev) => (prev + dir + beliefs.length) % beliefs.length);
  }, []);

  const current = beliefs[currentIndex];

  const slideVariants = {
    enter: (d: number) => ({
      x: d > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? -60 : 60,
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
        {/* Section Header — left-aligned with arrows on the right */}
        <div className="flex items-center justify-between mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel>Our Beliefs</SectionLabel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-sm text-fg-tertiary font-mono mr-1">
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(beliefs.length).padStart(2, "0")}
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
          </motion.div>
        </div>

        {/* Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative border border-brand-500">
            <DotPattern width={5} height={5} />

            {/* Corner markers */}
            <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-brand-500" />
            <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-brand-500" />
            <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-brand-500" />
            <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-brand-500" />

            {/* Quote content */}
            <div className="relative z-10 w-full overflow-hidden px-8 py-10 md:px-14 md:py-14 lg:px-20 lg:py-16">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-sm md:text-base text-brand-500 mb-3 md:mb-4 font-medium italic">
                    {current.label}
                  </p>
                  <div className="text-xl md:text-3xl lg:text-5xl tracking-tight leading-[1.15] text-fg-primary max-w-5xl">
                    {current.segments.map((seg, i) => (
                      <span
                        key={i}
                        className={seg.bold ? "font-bold" : "font-light"}
                      >
                        {seg.text}
                      </span>
                    ))}
                  </div>

                  {/* Author attribution — bottom right */}
                  <div className="flex justify-end mt-8 md:mt-12">
                    <Link
                      href={current.author.href}
                      className="flex items-center gap-3 group"
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center",
                          "w-10 h-10 rounded-full",
                          "bg-bg-brand-solid text-white",
                          "text-sm font-semibold",
                          "group-hover:scale-105 transition-transform duration-200"
                        )}
                      >
                        {current.author.initials}
                      </div>
                      <span className="text-sm text-fg-secondary group-hover:text-fg-primary transition-colors duration-200">
                        {current.author.name}
                      </span>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
