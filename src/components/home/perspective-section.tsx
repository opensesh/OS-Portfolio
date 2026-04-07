"use client";

import { useRef, useState, useCallback } from "react";
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

// Tag positions biased toward the INNER edge of each circle (toward center overlap).
// Left circle tags cluster toward the right; right circle tags cluster toward the left.
// Laid out in a vertical-ish column formation like the reference design.
const LEFT_POSITIONS: { x: number; y: number }[] = [
  { x: 18, y: -30 },  // DevOps (top center-right)
  { x: 14, y: -16 },  // Design Systems
  { x: 6, y: -4 },    // Components
  { x: 26, y: -4 },   // Code
  { x: 4, y: 8 },     // CI/CD
  { x: 24, y: 8 },    // UXR
  { x: 14, y: 20 },   // Wireframes
  { x: 14, y: 32 },   // Prototype
];

const RIGHT_POSITIONS: { x: number; y: number }[] = [
  { x: -18, y: -30 }, // Shortform
  { x: -24, y: -16 }, // Blogs
  { x: -6, y: -16 },  // Production
  { x: -24, y: -4 },  // Longform
  { x: -6, y: -4 },   // Production (duplicate in ref, keeping as-is)
  { x: -24, y: 8 },   // Ads
  { x: -6, y: 8 },    // Conversion
  { x: -18, y: 20 },  // Events
];

// ---------------------------------------------------------------------------
// DisciplineTags — with mouse-reactive subtle movement
// ---------------------------------------------------------------------------

function DisciplineTags({
  tags,
  positions,
  mouseOffset,
}: {
  tags: string[];
  positions: { x: number; y: number }[];
  mouseOffset: { x: number; y: number };
}) {
  return (
    <>
      {tags.map((tag, i) => {
        // Each tag gets a slightly different parallax factor for organic feel
        const factor = 0.3 + (i % 3) * 0.15;
        return (
          <span
            key={tag}
            className="absolute whitespace-nowrap pointer-events-none transition-transform duration-300 ease-out"
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: "clamp(9px, 1.1vw, 13px)",
              fontWeight: 700,
              color: "var(--fg-primary)",
              left: `${50 + positions[i].x}%`,
              top: `${50 + positions[i].y}%`,
              transform: `translate(-50%, -50%) translate(${mouseOffset.x * factor}px, ${mouseOffset.y * factor}px)`,
            }}
          >
            [{tag}]
          </span>
        );
      })}
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
          animation: `perspective-spin ${reverse ? "45s" : "40s"} linear infinite ${reverse ? "reverse" : "normal"}`,
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

  // Mouse tracking for tag parallax
  const [leftMouse, setLeftMouse] = useState({ x: 0, y: 0 });
  const [rightMouse, setRightMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (side: "left" | "right", e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      if (side === "left") setLeftMouse({ x, y });
      else setRightMouse({ x, y });
    },
    []
  );

  const handleMouseLeave = useCallback((side: "left" | "right") => {
    if (side === "left") setLeftMouse({ x: 0, y: 0 });
    else setRightMouse({ x: 0, y: 0 });
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });

  // Circle merge
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

  // Overlap glow
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
          <TextBlockReveal
            as="h2"
            trigger="scroll"
            className="text-display text-3xl md:text-4xl lg:text-5xl max-w-2xl"
          >
            {"Merging Creative\nDomains"}
          </TextBlockReveal>
        </div>

        {/* Venn diagram area */}
        <div className="relative">
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
                "flex-shrink-0",
                isDesktop
                  ? "w-[220px] text-left pr-8"
                  : "w-full max-w-sm mb-8 text-center"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
                style={{
                  fontFamily: "var(--font-accent)",
                  color: "var(--fg-brand)",
                }}
              >
                Product
              </h3>
              <p className="text-sm font-bold text-fg-primary mt-1 uppercase tracking-wide">
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
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-bg-brand-solid blur-3xl" />
              </motion.div>

              {/* Left circle */}
              <motion.div
                className="absolute top-0 bottom-0 w-1/2 left-0"
                style={{ x: leftX }}
                onMouseMove={(e) => handleMouseMove("left", e)}
                onMouseLeave={() => handleMouseLeave("left")}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-[90%] aspect-square max-h-full">
                    <DottedCircle />
                    <DisciplineTags
                      tags={LEFT_TAGS}
                      positions={LEFT_POSITIONS}
                      mouseOffset={leftMouse}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Right circle */}
              <motion.div
                className="absolute top-0 bottom-0 w-1/2 right-0"
                style={{ x: rightX }}
                onMouseMove={(e) => handleMouseMove("right", e)}
                onMouseLeave={() => handleMouseLeave("right")}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-[90%] aspect-square max-h-full">
                    <DottedCircle reverse />
                    <DisciplineTags
                      tags={RIGHT_TAGS}
                      positions={RIGHT_POSITIONS}
                      mouseOffset={rightMouse}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Marketing column */}
            <motion.div
              className={cn(
                "flex-shrink-0",
                isDesktop
                  ? "w-[220px] text-left pl-8"
                  : "w-full max-w-sm mt-8 text-center"
              )}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
                style={{
                  fontFamily: "var(--font-accent)",
                  color: "var(--fg-brand)",
                }}
              >
                Marketing
              </h3>
              <p className="text-sm font-bold text-fg-primary mt-1 uppercase tracking-wide">
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

      {/* Spin keyframes — namespaced to avoid collision */}
      <style jsx global>{`
        @keyframes perspective-spin {
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
