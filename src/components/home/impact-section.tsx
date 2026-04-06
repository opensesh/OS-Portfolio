"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
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

// Card size in px per breakpoint (matched via JS)
const CARD_GAP = 16;

function useCardWidth() {
  const [width, setWidth] = useState(280);
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw >= 1024) setWidth(400);
      else if (vw >= 768) setWidth(360);
      else if (vw >= 640) setWidth(320);
      else setWidth(280);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

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
// Stat card — number with CRT powerglitch (Aperol + warm grays) + scramble label
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
      hueRotate: false,
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
          className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-fg-brand leading-none"
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
// Main section — translateX carousel with edge fades
// ---------------------------------------------------------------------------

export function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const cardWidth = useCardWidth();
  const totalCards = CARDS.length;
  const cardStep = cardWidth + CARD_GAP;

  // Position tracking via motion value (pixel offset of track)
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 40 });

  // Compute max offset so last card is visible
  const [viewportWidth, setViewportWidth] = useState(0);
  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const trackWidth = totalCards * cardStep - CARD_GAP;
  const maxOffset = Math.max(0, trackWidth - viewportWidth + 64); // 64 = side padding safety

  const [offset, setOffset] = useState(0);

  const canScrollLeft = offset > 0;
  const canScrollRight = offset < maxOffset;

  const scrollBy = useCallback(
    (dir: -1 | 1) => {
      setOffset((prev) => {
        const next = Math.max(0, Math.min(maxOffset, prev + dir * cardStep));
        animate(x, -next, { type: "spring", stiffness: 300, damping: 40 });
        return next;
      });
    },
    [maxOffset, cardStep, x]
  );

  // Touch/drag support
  const dragStart = useRef<{ startX: number; startOffset: number } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragStart.current = { startX: e.clientX, startOffset: offset };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [offset]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStart.current) return;
      const delta = dragStart.current.startX - e.clientX;
      const next = Math.max(0, Math.min(maxOffset, dragStart.current.startOffset + delta));
      x.set(-next);
    },
    [maxOffset, x]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStart.current) return;
      const delta = dragStart.current.startX - e.clientX;
      const finalOffset = Math.max(0, Math.min(maxOffset, dragStart.current.startOffset + delta));
      // Snap to nearest card
      const snapped = Math.round(finalOffset / cardStep) * cardStep;
      const clamped = Math.max(0, Math.min(maxOffset, snapped));
      setOffset(clamped);
      animate(x, -clamped, { type: "spring", stiffness: 300, damping: 40 });
      dragStart.current = null;
    },
    [maxOffset, cardStep, x]
  );

  let statIndex = 0;

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-bg-primary"
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
              onClick={() => scrollBy(-1)}
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
              onClick={() => scrollBy(1)}
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

      {/* Carousel viewport with edge fades */}
      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 md:w-24 lg:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--bg-primary), transparent)" }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 md:w-24 lg:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--bg-primary), transparent)" }}
        />

        {/* Track */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="flex gap-4 px-8 md:px-16 lg:px-24 touch-pan-y select-none"
            style={{ x: springX, width: trackWidth + 192 }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {CARDS.map((card, i) => {
              const currentStatIndex = card.kind === "stat" ? statIndex++ : 0;
              return (
                <div
                  key={i}
                  className="flex-shrink-0"
                  style={{ width: cardWidth, height: cardWidth }}
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
