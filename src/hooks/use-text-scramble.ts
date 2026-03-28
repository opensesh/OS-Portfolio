"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#________";

interface UseTextScrambleOptions {
  duration?: number;
}

interface UseTextScrambleReturn {
  displayText: string;
  isScrambling: boolean;
  trigger: () => void;
  reset: () => void;
}

export function useTextScramble(
  text: string,
  options: UseTextScrambleOptions = {}
): UseTextScrambleReturn {
  const { duration = 400 } = options;
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomChar = useCallback(() => {
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  }, []);

  const trigger = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    const textLength = text.length;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Calculate how many characters should be revealed based on progress
      const targetRevealed = Math.floor(progress * textLength);

      // Build the display string
      let result = "";
      for (let i = 0; i < textLength; i++) {
        if (i < targetRevealed) {
          // Already revealed - show original character
          result += text[i];
        } else if (text[i] === " ") {
          // Keep spaces as spaces
          result += " ";
        } else {
          // Not yet revealed - show scrambled character
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

    // Start scrambling immediately
    animationRef.current = requestAnimationFrame(animate);
  }, [text, duration, isScrambling, getRandomChar]);

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDisplayText(text);
    setIsScrambling(false);
  }, [text]);

  return {
    displayText,
    isScrambling,
    trigger,
    reset,
  };
}

// Simpler version for just scrambling on mount
export function useTextScrambleOnce(
  text: string,
  options: UseTextScrambleOptions & { delay?: number } = {}
): string {
  const { delay = 0, ...scrambleOptions } = options;
  const { displayText, trigger } = useTextScramble(text, scrambleOptions);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    if (delay > 0) {
      const timeout = setTimeout(trigger, delay);
      return () => clearTimeout(timeout);
    } else {
      // Trigger on next frame to avoid flash
      const frame = requestAnimationFrame(trigger);
      return () => cancelAnimationFrame(frame);
    }
  }, [delay, trigger]);

  return displayText;
}
