"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { devProps } from "@/utils/dev-props";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#";
const LOADING_TEXT = "OPEN SESSION";
const SCRAMBLE_DURATION = 1200; // ms
const EXIT_DELAY = 300; // ms after scramble completes

function getRandomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [mounted, setMounted] = useState(false);

  const animateText = useCallback(() => {
    const textLength = LOADING_TEXT.length;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / SCRAMBLE_DURATION, 1);

      // Calculate how many characters should be revealed
      const targetRevealed = Math.floor(progress * textLength);

      // Build the display string
      let result = "";
      for (let i = 0; i < textLength; i++) {
        if (i < targetRevealed) {
          result += LOADING_TEXT[i];
        } else if (LOADING_TEXT[i] === " ") {
          result += " ";
        } else {
          result += getRandomChar();
        }
      }

      setDisplayText(result);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayText(LOADING_TEXT);
        setTimeout(() => {
          setIsLoading(false);
          window.dispatchEvent(new Event("page-loader-exit"));
        }, EXIT_DELAY);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Only run on client after mount
  useEffect(() => {
    setMounted(true);
    // Generate initial scrambled text only on client
    const initial = LOADING_TEXT.split("")
      .map((char) => (char === " " ? " " : getRandomChar()))
      .join("");
    setDisplayText(initial);

    // Start animation after a brief delay
    const timeout = setTimeout(animateText, 100);
    return () => clearTimeout(timeout);
  }, [animateText]);

  // Don't render anything during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div {...devProps('PageLoader')} className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary">
        <span className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-fg-primary tracking-tight opacity-0">
          {LOADING_TEXT}
        </span>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          {...devProps('PageLoader')}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.98,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-fg-primary tracking-tight"
          >
            {displayText}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
