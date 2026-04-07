"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const LEFT_TAGS = [
  "DevOps",
  "Design Systems",
  "Components",
  "Code",
  "CI/CD",
  "UXR",
  "Wireframes",
  "Prototype",
];

const RIGHT_TAGS = [
  "Shortform",
  "Blogs",
  "Production",
  "Longform",
  "Ads",
  "Conversion",
  "Events",
  "Community",
];

// Pre-computed tag positions (percentage offsets from circle center)
// Arranged in a roughly circular pattern inside each circle
function getTagPositions(count: number): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const radius = 34; // % from center
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    positions.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
  }
  return positions;
}

const leftPositions = getTagPositions(LEFT_TAGS.length);
const rightPositions = getTagPositions(RIGHT_TAGS.length);

// ---------------------------------------------------------------------------
// DisciplineTags
// ---------------------------------------------------------------------------

function DisciplineTags({
  tags,
  positions,
}: {
  tags: string[];
  positions: { x: number; y: number }[];
}) {
  return (
    <>
      {tags.map((tag, i) => (
        <span
          key={tag}
          className="absolute font-mono text-[10px] sm:text-xs text-fg-primary whitespace-nowrap pointer-events-none"
          style={{
            left: `${50 + positions[i].x}%`,
            top: `${50 + positions[i].y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          [{tag}]
        </span>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// DottedCircle (SVG)
// ---------------------------------------------------------------------------

function DottedCircle({
  className,
  reverse,
}: {
  className?: string;
  reverse?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      className={cn("absolute inset-0 w-full h-full", className)}
    >
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 9"
        fill="none"
        className="text-fg-primary"
        style={{
          transformOrigin: "200px 200px",
          animation: `spin ${reverse ? "45s" : "40s"} linear infinite ${reverse ? "reverse" : "normal"}`,
        }}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// PerspectiveSection
// ---------------------------------------------------------------------------

export function PerspectiveSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: inViewRef, isInView } = useInView<HTMLDivElement>({
    threshold: 0.1,
  });
  const isDesktop = useBreakpoint("lg");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });

  // Circle merge: overlap amount in percentage
  const overlapAmount = isDesktop ? 25 : 15;
  const leftX = useTransform(
    scrollYProgress,
    [0.15, 0.55],
    ["0%", `${overlapAmount}%`]
  );
  const rightX = useTransform(
    scrollYProgress,
    [0.15, 0.55],
    ["0%", `${-overlapAmount}%`]
  );

  // Overlap indicator opacity
  const overlapOpacity = useTransform(scrollYProgress, [0.4, 0.65], [0, 0.15]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg-primary py-24 sm:py-32 lg:py-40 overflow-hidden"
      {...devProps("PerspectiveSection")}
    >
      <div ref={inViewRef} className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 sm:mb-20 lg:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-label mb-4"
          >
            Our Advantage
          </motion.p>
          <TextBlockReveal as="h2" className="text-display text-fg-primary">
            {"Merging Creative\nDomains"}
          </TextBlockReveal>
        </div>

        {/* Venn diagram area */}
        <div className="relative">
          {/* Desktop: side-by-side with text columns flanking */}
          <div
            className={cn(
              "flex items-center gap-0",
              isDesktop
                ? "flex-row justify-center"
                : "flex-col items-center"
            )}
          >
            {/* Left: Product column */}
            <motion.div
              className={cn(
                "flex-shrink-0 text-center",
                isDesktop
                  ? "w-[200px] text-right pr-6"
                  : "w-full max-w-sm mb-8"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-fg-primary tracking-tight">
                Product
              </h3>
              <p className="font-mono text-xs text-fg-secondary mt-1 uppercase tracking-wider">
                Design Discipline
              </p>
              <p className="text-sm text-fg-secondary mt-3 leading-relaxed hidden lg:block">
                Product design is heavily rooted in design systems and code. We
                take our experience from working with companies like Google and
                transform our understanding of code into transformative outcomes
                and workflows.
              </p>
            </motion.div>

            {/* Circles container */}
            <div
              className={cn(
                "relative",
                isDesktop
                  ? "w-[600px] h-[400px]"
                  : "w-full max-w-md aspect-[3/2]"
              )}
            >
              {/* Overlap glow */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ opacity: overlapOpacity }}
              >
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-brand-500 blur-3xl" />
              </motion.div>

              {/* Left circle */}
              <motion.div
                className="absolute top-0 bottom-0 w-1/2 left-0"
                style={{ x: leftX }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-[90%] aspect-square max-h-full">
                    <DottedCircle />
                    <DisciplineTags tags={LEFT_TAGS} positions={leftPositions} />
                  </div>
                </div>
              </motion.div>

              {/* Right circle */}
              <motion.div
                className="absolute top-0 bottom-0 w-1/2 right-0"
                style={{ x: rightX }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-[90%] aspect-square max-h-full">
                    <DottedCircle reverse />
                    <DisciplineTags
                      tags={RIGHT_TAGS}
                      positions={rightPositions}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Marketing column */}
            <motion.div
              className={cn(
                "flex-shrink-0 text-center",
                isDesktop
                  ? "w-[200px] text-left pl-6"
                  : "w-full max-w-sm mt-8"
              )}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-fg-primary tracking-tight">
                Marketing
              </h3>
              <p className="font-mono text-xs text-fg-secondary mt-1 uppercase tracking-wider">
                Content Strategy
              </p>
              <p className="text-sm text-fg-secondary mt-3 leading-relaxed hidden lg:block">
                Content strategy spans every medium from shortform social to
                longform editorial. We merge production craft with data-driven
                distribution to build audiences that convert and communities that
                endure.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Spin keyframes */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
