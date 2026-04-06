"use client";

import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

interface CarouselNavArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function CarouselNavArrows({ onPrev, onNext, canPrev, canNext }: CarouselNavArrowsProps) {
  const buttonBase = cn(
    "flex items-center justify-center w-8 h-8",
    "bg-bg-secondary text-fg-secondary",
    "hover:bg-bg-tertiary transition-colors duration-300"
  );

  return (
    <div {...devProps("CarouselNavArrows")} className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className={cn(buttonBase, !canPrev && "opacity-30 pointer-events-none")}
        aria-label="Previous slide"
      >
        <ChevronLeftIcon />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className={cn(buttonBase, !canNext && "opacity-30 pointer-events-none")}
        aria-label="Next slide"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}
