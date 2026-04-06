"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import { Project } from "@/types/project";
import { ProjectCard } from "./project-card";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

const CARD_GAP = 32;

function useSlideWidth() {
  const [width, setWidth] = useState(800);
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setWidth(Math.min(944, vw * 0.8));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

interface ProjectCarouselProps {
  projects: Project[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

export function ProjectCarousel({
  projects,
  activeIndex,
  onActiveIndexChange,
}: ProjectCarouselProps) {
  const slideWidth = useSlideWidth();
  const cardStep = slideWidth + CARD_GAP;
  const totalSlides = projects.length;

  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 40 });

  const [containerPadding, setContainerPadding] = useState(24);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      setViewportWidth(window.innerWidth);
      const containerEl = document.querySelector(".container-wide");
      if (containerEl) {
        const rect = containerEl.getBoundingClientRect();
        setContainerPadding(rect.left);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const trackWidth = totalSlides * cardStep - CARD_GAP;
  const containerRight = viewportWidth - containerPadding;
  const maxOffset = Math.max(0, trackWidth - containerRight + containerPadding);

  // Internal offset tracks the true pixel position — not derived from activeIndex
  const offsetRef = useRef(0);

  // Flag to prevent feedback loops between parent activeIndex and internal offset
  const isNavigating = useRef(false);

  // Navigate to a specific index (called when parent's activeIndex changes)
  const navigateToIndex = useCallback(
    (index: number) => {
      const targetOffset = Math.min(maxOffset, index * cardStep);
      const clamped = Math.max(0, targetOffset);
      offsetRef.current = clamped;
      animate(x, -clamped, { type: "spring", stiffness: 300, damping: 40 });
    },
    [maxOffset, cardStep, x]
  );

  // Respond to external activeIndex changes (e.g., from nav arrows)
  useEffect(() => {
    if (isNavigating.current) {
      isNavigating.current = false;
      return;
    }
    navigateToIndex(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // Drag state
  const dragStart = useRef<{
    startX: number;
    startOffset: number;
    startTime: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const justDragged = useRef(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragStart.current = {
        startX: e.clientX,
        startOffset: offsetRef.current,
        startTime: Date.now(),
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStart.current) return;
      const delta = dragStart.current.startX - e.clientX;
      if (Math.abs(delta) > 3) setIsDragging(true);
      const next = Math.max(
        0,
        Math.min(maxOffset, dragStart.current.startOffset + delta)
      );
      x.set(-next);
    },
    [maxOffset, x]
  );

  const onPointerUp = useCallback(
    () => {
      if (!dragStart.current) return;

      // Recalculate from the current motion value
      const currentOffset = -x.get();
      const elapsed = Date.now() - dragStart.current.startTime;

      // If barely moved, treat as click
      const totalDelta = currentOffset - dragStart.current.startOffset;
      if (Math.abs(totalDelta) < 5) {
        dragStart.current = null;
        setIsDragging(false);
        return;
      }

      justDragged.current = true;
      setTimeout(() => {
        justDragged.current = false;
      }, 100);

      // Velocity-based inertia
      const velocity = totalDelta / Math.max(elapsed, 1);
      const velocityBoost = velocity * 200;
      const finalOffset = currentOffset + velocityBoost;

      const snapped = Math.round(finalOffset / cardStep) * cardStep;
      const clamped = Math.max(0, Math.min(maxOffset, snapped));
      offsetRef.current = clamped;
      animate(x, -clamped, { type: "spring", stiffness: 300, damping: 40 });

      // Update parent's active index
      const newIndex = Math.max(0, Math.min(totalSlides - 1, Math.round(clamped / cardStep)));
      isNavigating.current = true;
      onActiveIndexChange(newIndex);

      dragStart.current = null;
      setIsDragging(false);
    },
    [maxOffset, cardStep, x, totalSlides, onActiveIndexChange]
  );

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    if (justDragged.current) {
      e.preventDefault();
    }
  }, []);

  return (
    <div {...devProps("ProjectCarousel")} className="relative">
      {/* Edge fades */}
      <div
        className="absolute top-0 bottom-0 left-0 z-10 pointer-events-none"
        style={{
          width: Math.max(containerPadding, 32),
          background: "linear-gradient(to right, var(--bg-primary), transparent)",
        }}
      />
      <div
        className="absolute top-0 bottom-0 right-0 z-10 pointer-events-none"
        style={{
          width: Math.max(containerPadding, 32),
          background: "linear-gradient(to left, var(--bg-primary), transparent)",
        }}
      />

      {/* Track */}
      <div className="overflow-hidden">
        <motion.div
          className={cn(
            "flex touch-pan-y select-none",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          style={{
            x: springX,
            gap: CARD_GAP,
            paddingLeft: containerPadding,
            paddingRight: containerPadding,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="flex-shrink-0"
              style={{ width: slideWidth }}
            >
              <Link
                href={`/projects/${project.slug}`}
                onClick={handleLinkClick}
                draggable={false}
                className="block"
              >
                <CarouselSlide
                  project={project}
                  index={i}
                  springX={springX}
                  slideWidth={slideWidth}
                  containerPadding={containerPadding}
                  cardStep={cardStep}
                />
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function CarouselSlide({
  project,
  index,
  springX,
  slideWidth,
  containerPadding,
  cardStep,
}: {
  project: Project;
  index: number;
  springX: ReturnType<typeof useSpring>;
  slideWidth: number;
  containerPadding: number;
  cardStep: number;
}) {
  const slideLeft = index * cardStep + containerPadding;
  const parallaxX = useTransform(
    springX,
    [-(slideLeft + slideWidth), -(slideLeft - slideWidth)],
    [100, -100]
  );

  return (
    <ProjectCard
      project={project}
      variant="carousel"
      parallaxX={parallaxX}
    />
  );
}
