"use client";

import { useEffect, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Tracks mouse position normalized to [-1, 1] range across the viewport.
 * Returns a ref (not state) so Three.js useFrame can read without causing re-renders.
 * On touch devices, values remain at (0, 0).
 */
export function useMousePosition() {
  const position = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      position.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      position.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return position;
}
