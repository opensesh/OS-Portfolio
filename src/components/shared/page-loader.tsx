"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#";
const LOADING_TEXT = "OPEN SESSION";
const SCRAMBLE_DURATION = 1200; // ms
const EXIT_DELAY = 200; // ms after scramble completes

function getRandomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

function getInitialScrambledText() {
  return LOADING_TEXT.split("")
    .map((char) => (char === " " ? " " : getRandomChar()))
    .join("");
}

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [displayText, setDisplayText] = useState(getInitialScrambledText);
  const hasRun = useRef(false);

  const animateText = useCallback(() => {
    const textLength = LOADING_TEXT.length;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / SCRAMBLE_DURATION, 1);

      // Calculate how many characters should be revealed
      const targetRevealed = Math.floor(progress * textLength);

      // Build the display string
      let result = "";
      for (let i = 0; i < textLength; i++) {
        if (i < targetRevealed) {
          // Already revealed - show original character
          result += LOADING_TEXT[i];
        } else if (LOADING_TEXT[i] === " ") {
          // Keep spaces as spaces
          result += " ";
        } else {
          // Not yet revealed - show scrambled character
          result += getRandomChar();
        }
      }

      setDisplayText(result);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayText(LOADING_TEXT);
        // Delay before exit
        setTimeout(() => setIsLoading(false), EXIT_DELAY);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Start animation after a tiny delay for paint
    const timeout = setTimeout(animateText, 50);
    return () => clearTimeout(timeout);
  }, [animateText]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
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
            transition={{ duration: 0.2 }}
            className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-fg-primary tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {displayText}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
