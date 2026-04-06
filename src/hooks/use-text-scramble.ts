"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const SCRAMBLE_CHARS = "█▓▒░▮▯▰▱▣▤▥▦▧▨@#$%^&*()_+[]{}|;:,.<>?~";

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

// Multi-line version with per-line stagger — designed for TextBlockReveal
interface UseMultiLineTextScrambleOptions {
  duration?: number; // per-line scramble duration in ms
  stagger?: number; // delay between lines in seconds
  baseDelay?: number; // initial delay before first line in seconds
}

interface UseMultiLineTextScrambleReturn {
  displayLines: string[];
  resolvedCounts: number[];
  trigger: () => void;
}

export function useMultiLineTextScramble(
  lines: string[],
  options: UseMultiLineTextScrambleOptions = {}
): UseMultiLineTextScrambleReturn {
  const { duration = 1000, stagger = 0.15, baseDelay = 0 } = options;
  const [displayLines, setDisplayLines] = useState<string[]>(lines);
  const [resolvedCounts, setResolvedCounts] = useState<number[]>(
    () => lines.map((l) => l.length)
  );
  const animationRef = useRef<number | null>(null);
  const triggeredRef = useRef(false);

  const trigger = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;

    const startTime = performance.now();
    const lineCount = lines.length;
    // Throttle scramble cycling — only regenerate random chars every ~80ms
    const TICK_INTERVAL = 80;
    let lastTickTime = 0;
    // Cache scrambled strings between ticks so glyphs hold steady
    const scrambleCache: string[] = lines.map(() => "");

    // Ease-in-out cubic for smoother reveal pacing
    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const shouldRetick = now - lastTickTime >= TICK_INTERVAL;
      if (shouldRetick) lastTickTime = now;

      let allDone = true;
      const next: string[] = [];
      const nextCounts: number[] = [];

      for (let li = 0; li < lineCount; li++) {
        const lineDelayMs = (baseDelay + li * stagger) * 1000;
        const lineElapsed = elapsed - lineDelayMs;

        if (lineElapsed < 0) {
          next.push(lines[li]);
          nextCounts.push(lines[li].length);
          allDone = false;
        } else {
          const linear = Math.min(lineElapsed / duration, 1);
          const progress = easeInOut(linear);
          if (linear >= 1) {
            next.push(lines[li]);
            nextCounts.push(lines[li].length);
          } else {
            allDone = false;
            const text = lines[li];
            const targetRevealed = Math.floor(progress * text.length);
            nextCounts.push(targetRevealed);

            // Only regenerate scrambled chars on tick boundaries
            if (shouldRetick || !scrambleCache[li]) {
              let result = "";
              for (let i = 0; i < text.length; i++) {
                if (i < targetRevealed) {
                  result += text[i];
                } else if (text[i] === " ") {
                  result += " ";
                } else {
                  result +=
                    SCRAMBLE_CHARS[
                      Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                    ];
                }
              }
              scrambleCache[li] = result;
            } else {
              // Reuse cached string but update revealed portion
              const cached = scrambleCache[li];
              scrambleCache[li] =
                text.slice(0, targetRevealed) + cached.slice(targetRevealed);
            }
            next.push(scrambleCache[li]);
          }
        }
      }

      setDisplayLines(next);
      setResolvedCounts(nextCounts);

      if (!allDone) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [lines, duration, stagger, baseDelay]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return { displayLines, resolvedCounts, trigger };
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
