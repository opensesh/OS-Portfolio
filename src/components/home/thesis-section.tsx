"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { ThesisDiagram } from "@/components/home/thesis-diagram";
import { fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

// ---------------------------------------------------------------------------
// Content data
// ---------------------------------------------------------------------------

type ThesisState = "past" | "future";

const THESIS_CONTENT: Record<
  ThesisState,
  { title: string; lead: string; points: string[] }
> = {
  past: {
    title: "Disconnect & Departments",
    lead: "Brand lived in silos. Teams worked apart.",
    points: [
      "Product marketing owned the brand narrative",
      "Design executed deliverables on request",
      "Engineering built without brand context",
    ],
  },
  future: {
    title: "Brand as the Container",
    lead: "One system. Every team. Every touchpoint.",
    points: [
      "Design system becomes the single source of truth",
      "Open-source tools eliminate redundant infrastructure",
      "Brand is embedded technically, not just visually",
    ],
  },
};

// ---------------------------------------------------------------------------
// Text content animation variants
// ---------------------------------------------------------------------------

const textVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
  },
};

// ---------------------------------------------------------------------------
// Toggle component
// ---------------------------------------------------------------------------

function ThesisToggle({
  value,
  onChange,
}: {
  value: ThesisState;
  onChange: (v: ThesisState) => void;
}) {
  return (
    <LayoutGroup id="thesis-toggle">
      <div className="inline-flex items-center rounded-full border border-border-secondary bg-bg-secondary p-1 gap-0.5">
        {(["past", "future"] as const).map((state) => (
          <button
            key={state}
            onClick={() => onChange(state)}
            className={cn(
              "relative z-10 px-4 py-1.5 md:px-5 md:py-2",
              "text-xs md:text-sm font-accent uppercase tracking-wider",
              "rounded-full transition-colors duration-200",
              value === state ? "text-white" : "text-fg-secondary hover:text-fg-primary"
            )}
            aria-pressed={value === state}
          >
            {value === state && (
              <motion.div
                layoutId="thesis-pill"
                className="absolute inset-0 rounded-full bg-brand-500"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10">{state === "past" ? "Past" : "Future"}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export function ThesisSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.15 });
  const [activeState, setActiveState] = useState<ThesisState>("past");

  const content = THESIS_CONTENT[activeState];

  // Swipe handling for mobile
  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const threshold = 50;
      const velocityThreshold = 200;

      if (
        info.offset.x < -threshold ||
        info.velocity.x < -velocityThreshold
      ) {
        setActiveState("future");
      } else if (
        info.offset.x > threshold ||
        info.velocity.x > velocityThreshold
      ) {
        setActiveState("past");
      }
    },
    []
  );

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 bg-bg-primary overflow-hidden"
      {...devProps("ThesisSection")}
    >
      <div className="container-wide">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="section-label section-label--brand mb-4"
            >
              Our Thesis
            </motion.p>
            <TextBlockReveal
              as="h2"
              trigger="scroll"
              className="text-display text-3xl md:text-4xl lg:text-5xl"
            >
              Evolving Design Systems
            </TextBlockReveal>
          </div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <ThesisToggle value={activeState} onChange={setActiveState} />
          </motion.div>
        </div>

        {/* Content grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          style={{ touchAction: "pan-y" }}
        >
          {/* Left column — text */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeState}
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h3 className="text-display text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4">
                  {content.title}
                </h3>
                <p className="text-fg-secondary text-sm md:text-base leading-relaxed max-w-lg mb-6">
                  {content.lead}
                </p>
                <ul className="space-y-3 max-w-lg">
                  {content.points.map((point, i) => (
                    <motion.li
                      key={point}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.15 + i * 0.08,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                      className={cn(
                        "pl-4 text-sm md:text-base text-fg-secondary leading-relaxed border-l-2",
                        activeState === "past"
                          ? "border-border-secondary"
                          : "border-brand-500"
                      )}
                    >
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right column — diagram */}
          <motion.div
            className="order-1 lg:order-2"
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <ThesisDiagram activeState={activeState} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
