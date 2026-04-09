"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

const SCRAMBLE_CHARS = "★✦✧%#@&$!?*·•◇△○+~=^><{}[]☆⁕÷±×";

interface ScrambleTextProps {
  children: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
  duration?: number;
  /** Attach hover listeners to an external element instead of self */
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function ScrambleText({
  children,
  className,
  as: Component = "span",
  duration = 400,
  triggerRef,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const lastShuffleRef = useRef(0);
  const scrambleMapRef = useRef<string[]>([]);
  const isScramblingRef = useRef(false);

  const getRandomChar = useCallback(() => {
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  }, []);

  const unlock = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.width = "";
      containerRef.current.style.height = "";
      containerRef.current.style.overflow = "";
    }
  }, []);

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setDisplayText(children);
    setIsScrambling(false);
    isScramblingRef.current = false;
    unlock();
  }, [children, unlock]);

  const start = useCallback(() => {
    if (isScramblingRef.current) return;
    setIsScrambling(true);
    isScramblingRef.current = true;

    // Lock container dimensions to prevent layout shifts
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      containerRef.current.style.width = `${rect.width}px`;
      containerRef.current.style.height = `${rect.height}px`;
      containerRef.current.style.overflow = "hidden";
    }

    const text = children;
    const textLength = text.length;
    const startTime = Date.now();

    // Pre-fill scramble map
    scrambleMapRef.current = Array.from(text, (ch) =>
      ch === " " ? " " : getRandomChar()
    );
    lastShuffleRef.current = startTime;

    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const linear = Math.min(elapsed / duration, 1);
      const progress = easeInOut(linear);
      const targetRevealed = Math.floor(progress * textLength);

      // Reshuffle scramble chars every ~60ms to reduce twitchiness
      if (now - lastShuffleRef.current > 60) {
        lastShuffleRef.current = now;
        for (let i = targetRevealed; i < textLength; i++) {
          if (text[i] !== " ") {
            scrambleMapRef.current[i] = getRandomChar();
          }
        }
      }

      let result = "";
      for (let i = 0; i < textLength; i++) {
        if (i < targetRevealed) {
          result += text[i];
        } else if (text[i] === " ") {
          result += " ";
        } else {
          result += scrambleMapRef.current[i];
        }
      }

      setDisplayText(result);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        setIsScrambling(false);
        isScramblingRef.current = false;
        unlock();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [children, duration, getRandomChar, unlock]);

  // When triggerRef is provided, listen on that element instead of self
  useEffect(() => {
    const el = triggerRef?.current;
    if (!el) return;

    el.addEventListener("mouseenter", start);
    el.addEventListener("mouseleave", stop);
    return () => {
      el.removeEventListener("mouseenter", start);
      el.removeEventListener("mouseleave", stop);
    };
  }, [triggerRef, start, stop]);

  return (
    <Component
      {...devProps('ScrambleText')}
      ref={containerRef as React.Ref<never>}
      className={cn("inline-block", className)}
      // Self-hover only when no external trigger
      {...(!triggerRef && {
        onMouseEnter: start,
        onMouseLeave: stop,
      })}
    >
      {displayText}
    </Component>
  );
}
