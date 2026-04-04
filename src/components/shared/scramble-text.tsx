"use client";

import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#________";

interface ScrambleTextProps {
  children: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
  duration?: number;
}

export function ScrambleText({
  children,
  className,
  as: Component = "span",
  duration = 400,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);
  const animationRef = useRef<number | null>(null);

  const getRandomChar = useCallback(() => {
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    const text = children;
    const textLength = text.length;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const targetRevealed = Math.floor(progress * textLength);

      let result = "";
      for (let i = 0; i < textLength; i++) {
        if (i < targetRevealed) {
          result += text[i];
        } else if (text[i] === " ") {
          result += " ";
        } else {
          result += getRandomChar();
        }
      }

      setDisplayText(result);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        setIsScrambling(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [children, duration, isScrambling, getRandomChar]);

  const handleMouseLeave = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setDisplayText(children);
    setIsScrambling(false);
  }, [children]);

  return (
    <Component
      {...devProps('ScrambleText')}
      className={cn("inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </Component>
  );
}
