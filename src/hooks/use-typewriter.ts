"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface VariableSpeed {
  min: number;
  max: number;
}

interface UseTypewriterOptions {
  /** Single string or array of strings to cycle through */
  text: string | string[];
  /** Base typing speed in ms per character */
  typingSpeed?: number;
  /** Speed for deleting characters in ms */
  deletingSpeed?: number;
  /** Pause after fully typed before deleting, in ms */
  pauseDuration?: number;
  /** Delay before first character types, in ms */
  initialDelay?: number;
  /** Whether to loop through phrases */
  loop?: boolean;
  /** Randomize typing speed within a range */
  variableSpeed?: VariableSpeed;
}

interface UseTypewriterReturn {
  displayedText: string;
  isDeleting: boolean;
  currentIndex: number;
}

export function useTypewriter({
  text,
  typingSpeed = 185,
  deletingSpeed = 50,
  pauseDuration = 1500,
  initialDelay = 0,
  loop = true,
  variableSpeed,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayedText, setDisplayedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const textArray = useMemo(
    () => (Array.isArray(text) ? text : [text]),
    [text]
  );

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const currentText = textArray[currentTextIndex];

    const tick = () => {
      if (isDeleting) {
        if (displayedText === "") {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) return;
          setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < currentText.length) {
          timeout = setTimeout(
            () => {
              setDisplayedText(
                (prev) => prev + currentText[currentCharIndex]
              );
              setCurrentCharIndex((prev) => prev + 1);
            },
            variableSpeed ? getRandomSpeed() : typingSpeed
          );
        } else if (textArray.length > 1) {
          if (!loop && currentTextIndex === textArray.length - 1) return;
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === "") {
      timeout = setTimeout(tick, initialDelay);
    } else {
      tick();
    }

    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    variableSpeed,
    getRandomSpeed,
  ]);

  return { displayedText, isDeleting, currentIndex: currentTextIndex };
}
