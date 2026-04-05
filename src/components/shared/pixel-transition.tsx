"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import "./pixel-transition.css";

interface PixelTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  animationStepDurationOut?: number;
  once?: boolean;
  aspectRatio?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function PixelTransition({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = "currentColor",
  animationStepDuration = 0.3,
  animationStepDurationOut,
  once = false,
  aspectRatio = "100%",
  className = "",
  style = {},
}: PixelTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelGridRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);

  const [isActive, setIsActive] = useState(false);

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = "";

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixel-transition__pixel");
        pixel.style.backgroundColor = pixelColor;

        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = useCallback(
    (activate: boolean) => {
      setIsActive(activate);

      const pixelGridEl = pixelGridRef.current;
      const activeEl = activeRef.current;
      if (!pixelGridEl || !activeEl) return;

      const pixels = pixelGridEl.querySelectorAll(".pixel-transition__pixel");
      if (!pixels.length) return;

      gsap.killTweensOf(pixels);
      if (delayedCallRef.current) {
        delayedCallRef.current.kill();
      }

      gsap.set(pixels, { display: "none" });

      const duration = activate
        ? animationStepDuration
        : (animationStepDurationOut ?? animationStepDuration * 0.6);
      const totalPixels = pixels.length;
      const staggerDuration = duration / totalPixels;

      gsap.to(pixels, {
        display: "block",
        duration: 0,
        stagger: {
          each: staggerDuration,
          from: "random",
        },
      });

      delayedCallRef.current = gsap.delayedCall(duration, () => {
        activeEl.style.display = activate ? "block" : "none";
        activeEl.style.pointerEvents = activate ? "none" : "";
      });

      gsap.to(pixels, {
        display: "none",
        duration: 0,
        delay: duration,
        stagger: {
          each: staggerDuration,
          from: "random",
        },
      });
    },
    [animationStepDuration, animationStepDurationOut]
  );

  const handleEnter = useCallback(() => {
    if (!isActive) animatePixels(true);
  }, [isActive, animatePixels]);

  const handleLeave = useCallback(() => {
    if (isActive && !once) animatePixels(false);
  }, [isActive, once, animatePixels]);

  const handleClick = useCallback(() => {
    if (!isActive) animatePixels(true);
    else if (!once) animatePixels(false);
  }, [isActive, once, animatePixels]);

  return (
    <div
      ref={containerRef}
      className={`pixel-transition ${className}`}
      style={style}
      onMouseEnter={!isTouchDevice ? handleEnter : undefined}
      onMouseLeave={!isTouchDevice ? handleLeave : undefined}
      onClick={isTouchDevice ? handleClick : undefined}
      onFocus={!isTouchDevice ? handleEnter : undefined}
      onBlur={!isTouchDevice ? handleLeave : undefined}
      tabIndex={0}
    >
      <div style={{ paddingTop: aspectRatio }} />
      <div className="pixel-transition__default" aria-hidden={isActive}>
        {firstContent}
      </div>
      <div
        className="pixel-transition__active"
        ref={activeRef}
        aria-hidden={!isActive}
      >
        {secondContent}
      </div>
      <div className="pixel-transition__pixels" ref={pixelGridRef} />
    </div>
  );
}
