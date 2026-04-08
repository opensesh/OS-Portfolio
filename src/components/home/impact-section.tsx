"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@untitledui-pro/icons/line";
import { useGlitch } from "react-powerglitch";
import { cn } from "@/lib/utils";
import { useTextScramble } from "@/hooks/use-text-scramble";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
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

// Card gap — 32px gives comfortable breathing room between large square cards
const CARD_GAP = 32;

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
  const [hovered, setHovered] = useState(false);

  // Timing
  const DUR = 350;    // ms per edge grow
  const STAG = 80;    // ms stagger between edges
  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
  const THICKNESS = 3; // px — triple the 1px border

  // Clockwise: top(L→R) → right(T→B) → bottom(R→L) → left(B→T)
  // Reverse on leave: top last, left first
  const edges: {
    pos: React.CSSProperties;
    origin: string;
    axis: "scaleX" | "scaleY";
    enterDelay: number;
    leaveDelay: number;
  }[] = [
    {
      // Top edge — centered on top border
      pos: { top: -THICKNESS / 2, left: 0, right: 0, height: THICKNESS },
      origin: "left",
      axis: "scaleX",
      enterDelay: STAG * 0,
      leaveDelay: STAG * 3,
    },
    {
      // Right edge — centered on right border
      pos: { top: 0, right: -THICKNESS / 2, bottom: 0, width: THICKNESS },
      origin: "top",
      axis: "scaleY",
      enterDelay: STAG * 1,
      leaveDelay: STAG * 2,
    },
    {
      // Bottom edge — centered on bottom border
      pos: { bottom: -THICKNESS / 2, left: 0, right: 0, height: THICKNESS },
      origin: "right",
      axis: "scaleX",
      enterDelay: STAG * 2,
      leaveDelay: STAG * 1,
    },
    {
      // Left edge — centered on left border
      pos: { top: 0, left: -THICKNESS / 2, bottom: 0, width: THICKNESS },
      origin: "bottom",
      axis: "scaleY",
      enterDelay: STAG * 3,
      leaveDelay: STAG * 0,
    },
  ];

  return (
    <div
      className={cn("relative border border-warm-gray-50 h-full", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <DotPattern width={5} height={5} />

      {/* Corner markers — transition to vanilla on hover */}
      {[
        { pos: "-left-1.5 -top-1.5" },
        { pos: "-right-1.5 -top-1.5" },
        { pos: "-bottom-1.5 -right-1.5" },
        { pos: "-bottom-1.5 -left-1.5" },
      ].map(({ pos }) => (
        <div
          key={pos}
          className={cn("absolute h-3 w-3 z-20 transition-colors", pos)}
          style={{
            backgroundColor: hovered ? "var(--fg-inverse)" : "var(--color-gray-50)",
            transitionDuration: "200ms",
            transitionDelay: hovered ? "0ms" : `${STAG * 4}ms`,
          }}
        />
      ))}

      {/* Animated edge lines — vanilla, 3px thick, clockwise in / reverse out */}
      {edges.map((edge, i) => (
        <div
          key={i}
          className="absolute z-10 pointer-events-none"
          style={{
            ...edge.pos,
            backgroundColor: "var(--fg-inverse)",
            transformOrigin: edge.origin,
            transform: hovered ? `${edge.axis}(1)` : `${edge.axis}(0)`,
            transition: `transform ${DUR}ms ${EASE}`,
            transitionDelay: hovered
              ? `${edge.enterDelay}ms`
              : `${edge.leaveDelay}ms`,
          }}
        />
      ))}

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat card — number with CRT powerglitch (Aperol + warm grays) + scramble label
// ---------------------------------------------------------------------------

function StatCard({ value, label, index, isInView }: { value: string; label: string; index: number; isInView: boolean }) {
  // playMode "hover" — glitch fires on hover; we also trigger once on scroll-in
  const glitch = useGlitch({
    playMode: "hover",
    timing: {
      duration: 600,
      iterations: 1,
      easing: "ease-in-out",
    },
    glitchTimeSpan: { start: 0, end: 1 },
    shake: {
      velocity: 10,
      amplitudeX: 0.15,
      amplitudeY: 0.2,
    },
    slice: {
      count: 4,
      velocity: 14,
      minHeight: 0.02,
      maxHeight: 0.15,
      hueRotate: false,
    },
  });

  const { displayText: labelText, trigger: triggerLabel } = useTextScramble(label, {
    duration: 600,
  });

  const hasTriggered = useRef(false);

  // Fire glitch + scramble once when section scrolls into view
  useEffect(() => {
    if (isInView && !hasTriggered.current) {
      hasTriggered.current = true;
      const delay = 300 + index * 150;
      const timeout = setTimeout(() => {
        triggerLabel();
        glitch.startGlitch();
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [isInView, triggerLabel, glitch, index]);

  return (
    <BoundingBox>
      <div className="flex flex-col justify-between h-full p-6 sm:p-8 md:p-10">
        <div
          ref={glitch.ref}
          data-impact-glitch
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none uppercase font-bold"
          style={{ color: "#fe5102", fontFamily: "var(--font-accent)" }}
        >
          {value}
        </div>
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-fg-tertiary mt-auto pt-6" style={{ fontFamily: "var(--font-accent)" }}>
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
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const cardWidth = useCardWidth();
  const totalCards = CARDS.length;
  const cardStep = cardWidth + CARD_GAP;

  // Position tracking via motion value (pixel offset of track)
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 40 });

  // Measure the container-main left padding so carousel aligns with it
  const [containerPadding, setContainerPadding] = useState(16);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      setViewportWidth(window.innerWidth);
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setContainerPadding(rect.left);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const trackWidth = totalCards * cardStep - CARD_GAP;
  // Max offset: track should stop when last card aligns with container right edge
  const containerRight = viewportWidth - containerPadding;
  const maxOffset = Math.max(0, trackWidth - containerRight + containerPadding);

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
      className="py-28 md:py-40"
      style={{
        backgroundColor: "var(--color-gray-950)",
        color: "var(--color-gray-50)",
        // Force dark palette regardless of theme
        ["--bg-primary" as string]: "var(--color-gray-950)",
        ["--fg-primary" as string]: "var(--color-gray-50)",
        ["--fg-secondary" as string]: "var(--color-gray-400)",
        ["--fg-tertiary" as string]: "var(--color-gray-500)",
        ["--fg-inverse" as string]: "var(--color-gray-50)",
        ["--border-primary" as string]: "var(--color-gray-700)",
        ["--border-secondary" as string]: "var(--color-gray-800)",
        ["--fg-brand" as string]: "#fe5102",
      }}
      {...devProps("ImpactSection")}
    >
      {/* Glitch artifacts always vanilla on dark bg */}
      <style>{`
        [data-impact-glitch]::before,
        [data-impact-glitch]::after {
          color: #faf8f5 !important;
        }
      `}</style>
      {/* Header */}
      <div ref={headerRef} className="container-wide">
        <div className="flex items-center justify-between mb-12 md:mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="section-label mb-4"
            >
              Our Impact
            </motion.p>
            <TextBlockReveal
              as="h2"
              trigger="scroll"
              className="text-display text-3xl md:text-4xl lg:text-5xl max-w-2xl"
            >
              Creative Results
            </TextBlockReveal>
          </div>

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

      {/* Carousel viewport with edge fades — py-2 prevents corner marker clipping */}
      <div className="relative overflow-hidden py-2">
        {/* Left fade — aligned to container edge */}
        <div
          className="absolute top-0 bottom-0 z-10 pointer-events-none"
          style={{
            left: 0,
            width: Math.max(containerPadding, 32),
            background: "linear-gradient(to right, var(--bg-primary), transparent)",
          }}
        />
        {/* Right fade — aligned to container edge */}
        <div
          className="absolute top-0 bottom-0 z-10 pointer-events-none"
          style={{
            right: 0,
            width: Math.max(containerPadding, 32),
            background: "linear-gradient(to left, var(--bg-primary), transparent)",
          }}
        />

        {/* Track */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="flex gap-8 touch-pan-y select-none"
            style={{ x: springX, paddingLeft: containerPadding, paddingRight: containerPadding, width: trackWidth + containerPadding * 2 }}
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
