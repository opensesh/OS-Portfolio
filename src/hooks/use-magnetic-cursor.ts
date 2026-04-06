"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";

interface MagneticCursorResult {
  /** Spring-dampened X position relative to container */
  cursorX: MotionValue<number>;
  /** Spring-dampened Y position relative to container */
  cursorY: MotionValue<number>;
  /** Raw opacity motion value (0 or 1) */
  opacity: MotionValue<number>;
  /** Spring-dampened tilt rotation (degrees) based on horizontal velocity */
  rotate: MotionValue<number>;
  /** Whether the cursor label is currently visible */
  isHovering: boolean;
  /** Bind these to the container element */
  bind: {
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: () => void;
  };
}

/**
 * Creates a magnetic cursor effect — a label that follows the mouse
 * with spring-dampened lag, constrained to a container element.
 * Also produces a tilt rotation based on horizontal mouse velocity,
 * creating a gravitational pull feel.
 *
 * Disabled on touch devices (pointer: coarse).
 */
export function useMagneticCursor(
  containerRef: React.RefObject<HTMLElement | null>
): MagneticCursorResult {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawOpacity = useMotionValue(0);
  const rawRotate = useMotionValue(0);

  const cursorX = useSpring(rawX, { stiffness: 150, damping: 15 });
  const cursorY = useSpring(rawY, { stiffness: 150, damping: 15 });
  const opacity = useSpring(rawOpacity, { stiffness: 300, damping: 30 });
  const rotate = useSpring(rawRotate, { stiffness: 150, damping: 12 });

  const [isHovering, setIsHovering] = useState(false);
  const isTouchDevice = useRef(false);
  const lastX = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    isTouchDevice.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      // Calculate horizontal velocity for tilt
      const now = performance.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        const dx = currentX - lastX.current;
        const velocity = dx / Math.max(dt, 1);
        // Clamp tilt to ±20 degrees, scale velocity
        const tilt = Math.max(-20, Math.min(20, velocity * 40));
        rawRotate.set(tilt);
      }
      lastX.current = currentX;
      lastTime.current = now;

      rawX.set(currentX);
      rawY.set(currentY);
    },
    [containerRef, rawX, rawY, rawRotate]
  );

  const onMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      rawX.set(x);
      rawY.set(y);
      cursorX.set(x);
      cursorY.set(y);
      rawRotate.set(0);
      rotate.set(0);
      rawOpacity.set(1);
      lastX.current = x;
      lastTime.current = performance.now();
      setIsHovering(true);
    },
    [containerRef, rawX, rawY, cursorX, cursorY, rawOpacity, rawRotate, rotate]
  );

  const onMouseLeave = useCallback(() => {
    rawOpacity.set(0);
    rawRotate.set(0);
    setIsHovering(false);
  }, [rawOpacity, rawRotate]);

  return {
    cursorX,
    cursorY,
    opacity,
    rotate,
    isHovering,
    bind: { onMouseMove, onMouseEnter, onMouseLeave },
  };
}
