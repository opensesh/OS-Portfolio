"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useMotionValue, useSpring } from "framer-motion";
import { useRelativeMouse } from "@/hooks/use-relative-mouse";
import { cn } from "@/lib/utils";

interface HoverMaskRevealProps {
  src: string;
  alt: string;
  maskRadius?: number;
  overlayColor?: string;
  overlayOpacity?: number;
  className?: string;
}

// Each trailing blob follows the cursor at a different speed,
// creating an organic, watery shape that stretches and contracts.
const BLOBS = [
  { smoothing: 0.08, radiusScale: 1.0, feather: 0.55 },
  { smoothing: 0.05, radiusScale: 1.15, feather: 0.35 },
  { smoothing: 0.03, radiusScale: 0.85, feather: 0.45 },
  { smoothing: 0.018, radiusScale: 1.3, feather: 0.2 },
];

export function HoverMaskReveal({
  src,
  alt,
  maskRadius = 140,
  overlayColor = "var(--color-bg-brand-solid)",
  overlayOpacity = 0.55,
  className,
}: HoverMaskRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const blobPositions = useRef(BLOBS.map(() => ({ x: 0, y: 0 })));

  const mouse = useRelativeMouse(containerRef);

  const radiusValue = useMotionValue(0);
  const radiusSpring = useSpring(radiusValue, {
    stiffness: 120,
    damping: 18,
  });

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches);

  const handleMouseEnter = useCallback(() => {
    radiusValue.set(maskRadius);
  }, [radiusValue, maskRadius]);

  const handleMouseLeave = useCallback(() => {
    radiusValue.set(0);
  }, [radiusValue]);

  useEffect(() => {
    if (isTouchDevice) return;

    const tick = () => {
      const overlay = overlayRef.current;
      if (!overlay) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const targetX = mouse.current.x;
      const targetY = mouse.current.y;
      const r = radiusSpring.get();

      // Build composite mask from multiple trailing blobs
      const gradients = BLOBS.map((blob, i) => {
        const pos = blobPositions.current[i];
        pos.x += (targetX - pos.x) * blob.smoothing;
        pos.y += (targetY - pos.y) * blob.smoothing;

        const blobR = r * blob.radiusScale;
        const solidStop = Math.round(blob.feather * 100);

        return `radial-gradient(circle ${blobR}px at ${pos.x}px ${pos.y}px, black ${solidStop}%, transparent 100%)`;
      });

      const maskValue = gradients.join(", ");
      overlay.style.maskImage = maskValue;
      overlay.style.webkitMaskImage = maskValue;
      // Composite: any blob's coverage adds to the mask
      const composite = BLOBS.map(() => "add").join(", ");
      overlay.style.maskComposite = composite;
      (overlay.style as unknown as Record<string, string>).webkitMaskComposite =
        "source-over";

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [isTouchDevice, mouse, radiusSpring]);

  if (isTouchDevice) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-none", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Photo — always visible */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />

      {/* Brand color overlay — revealed by multi-blob mask */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{ willChange: "mask-image" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
            mixBlendMode: "multiply",
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
