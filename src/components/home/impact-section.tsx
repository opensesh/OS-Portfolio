"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@untitledui-pro/icons/line";
import { useGlitch } from "react-powerglitch";
import { cn } from "@/lib/utils";
import { useTextScramble } from "@/hooks/use-text-scramble";
import { SectionLabel } from "@/components/shared/section-label";
import { DotPattern } from "@/components/ui/dot-pattern";
import { fadeInUp } from "@/lib/motion";
import { devProps } from "@/utils/dev-props";

// ---------------------------------------------------------------------------
// Carousel item types
// ---------------------------------------------------------------------------

type CardItem =
  | { kind: "stat"; value: string; label: string }
  | { kind: "media"; mediaType: "video" | "image"; src: string | null; alt: string };

const CARDS: CardItem[] = [
  { kind: "stat", value: "$1B+", label: "TOUCHED IN PIPELINE" },
  { kind: "media", mediaType: "image", src: null, alt: "Brand campaign" },
  { kind: "stat", value: "$300M+", label: "DRIVEN IN SALES" },
  { kind: "media", mediaType: "video", src: null, alt: "Product launch" },
  { kind: "stat", value: "5M+", label: "AUDIENCE REACHED" },
  { kind: "media", mediaType: "image", src: null, alt: "Design system showcase" },
  { kind: "stat", value: "2M+", label: "APP USERS TOUCHED" },
  { kind: "media", mediaType: "video", src: null, alt: "Project highlight reel" },
  { kind: "stat", value: "15+", label: "BRANDS PARTNERED" },
  { kind: "media", mediaType: "image", src: null, alt: "Client collaboration" },
];

// ---------------------------------------------------------------------------
// Bounding-box wrapper — matches Beliefs section style
// ---------------------------------------------------------------------------

function BoundingBox({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative border border-brand-500 h-full", className)}>
      <DotPattern width={5} height={5} />
      {/* Corner markers */}
      <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-brand-500" />
      <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-brand-500" />
      <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-brand-500" />
      <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-brand-500" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat card — number with CRT powerglitch + scramble label
// ---------------------------------------------------------------------------

function StatCard({ value, label, index, isInView }: { value: string; label: string; index: number; isInView: boolean }) {
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

  const { displayText: labelText, trigger: triggerLabel } = useTextScramble(label, {
    duration: 600,
  });

  const hasTriggered = useRef(false);

  useEffect(() => {
    if (isInView && !hasTriggered.current) {
      hasTriggered.current = true;
      const timeout = setTimeout(() => triggerLabel(), 300 + index * 150);
      return () => clearTimeout(timeout);
    }
  }, [isInView, triggerLabel, index]);

  return (
    <BoundingBox>
      <div className="flex flex-col justify-between h-full p-6 sm:p-8 md:p-10">
        <div
          ref={glitch.ref}
          className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-fg-primary leading-none"
        >
          {value}
        </div>
        <p className="font-accent text-[10px] sm:text-xs font-bold uppercase tracking-widest text-fg-tertiary mt-auto pt-6">
          {isInView ? labelText : label}
        </p>
      </div>
    </BoundingBox>
  );
}

// ---------------------------------------------------------------------------
// Media card — placeholder or actual content
// ---------------------------------------------------------------------------

function MediaCard({ mediaType, src, alt }: { mediaType: "video" | "image"; src: string | null; alt: string }) {
  return (
    <BoundingBox>
      <div className="h-full overflow-hidden">
        {src ? (
          mediaType === "video" ? (
            <video
              src={src}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border border-border-secondary flex items-center justify-center">
              {mediaType === "video" ? (
                <div className="w-0 h-0 border-l-[10px] border-l-fg-tertiary border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
              ) : (
                <div className="w-5 h-5 rounded-sm border border-fg-tertiary opacity-40" />
              )}
            </div>
            <span className="font-accent text-[10px] uppercase tracking-widest text-fg-tertiary text-center px-4">
              {mediaType === "video" ? "Video" : "Image"} — {alt}
            </span>
          </div>
        )}
      </div>
    </BoundingBox>
  );
}

// ---------------------------------------------------------------------------
// Horizontal scroll carousel
// ---------------------------------------------------------------------------

export function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    // Also recheck on resize
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scroll = useCallback((dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    // Scroll by ~1 card width
    const cardWidth = el.querySelector<HTMLElement>("[data-card]")?.offsetWidth ?? 320;
    el.scrollBy({ left: dir * (cardWidth + 16), behavior: "smooth" });
  }, []);

  // Track stat-only index for glitch stagger
  let statIndex = 0;

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-bg-primary overflow-hidden"
      {...devProps("ImpactSection")}
    >
      {/* Header */}
      <div className="container-main">
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel>Our Impact</SectionLabel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              className={cn(
                "flex items-center justify-center",
                "w-10 h-10 rounded-full",
                "border border-border-secondary",
                "text-fg-secondary hover:text-fg-primary",
                "hover:border-border-primary hover:bg-bg-secondary",
                "transition-all duration-200",
                !canScrollLeft && "opacity-30 pointer-events-none"
              )}
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              className={cn(
                "flex items-center justify-center",
                "w-10 h-10 rounded-full",
                "border border-border-secondary",
                "text-fg-secondary hover:text-fg-primary",
                "hover:border-border-primary hover:bg-bg-secondary",
                "transition-all duration-200",
                !canScrollRight && "opacity-30 pointer-events-none"
              )}
              aria-label="Scroll right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-[max(1rem,calc((100vw-var(--container-xl))/2+1rem))] md:px-[max(2rem,calc((100vw-var(--container-xl))/2+2rem))] lg:px-[max(4rem,calc((100vw-var(--container-xl))/2+4rem))]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CARDS.map((card, i) => {
            const currentStatIndex = card.kind === "stat" ? statIndex++ : 0;
            return (
              <div
                key={i}
                data-card
                className="flex-shrink-0 snap-start w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] aspect-square"
              >
                {card.kind === "stat" ? (
                  <StatCard
                    value={card.value}
                    label={card.label}
                    index={currentStatIndex}
                    isInView={isInView}
                  />
                ) : (
                  <MediaCard
                    mediaType={card.mediaType}
                    src={card.src}
                    alt={card.alt}
                  />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
