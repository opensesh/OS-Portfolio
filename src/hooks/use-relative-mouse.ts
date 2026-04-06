"use client";

import { useEffect, useRef, type RefObject } from "react";

interface RelativeMousePosition {
  x: number;
  y: number;
  isInside: boolean;
}

/**
 * Tracks mouse position relative to a container element.
 * Returns a ref (not state) to avoid re-renders on every mousemove.
 * Coordinates are in pixels relative to the element's top-left corner.
 */
export function useRelativeMouse(containerRef: RefObject<HTMLElement | null>) {
  const position = useRef<RelativeMousePosition>({
    x: 0,
    y: 0,
    isInside: false,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      position.current.x = e.clientX - rect.left;
      position.current.y = e.clientY - rect.top;
    };

    const handleMouseEnter = () => {
      position.current.isInside = true;
    };

    const handleMouseLeave = () => {
      position.current.isInside = false;
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerRef]);

  return position;
}
