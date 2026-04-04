"use client";

import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

interface TriplingTextProps {
  children: string;
  className?: string;
}

// Good Fella style text tripling effect
// Shows 3 copies of text stacked, middle one visible
// On hover, translates Y to reveal different copy
export function TriplingText({ children, className }: TriplingTextProps) {
  return (
    <span {...devProps('TriplingText')} className={cn("relative inline-block overflow-hidden group/tripling", className)}>
      {/* Container with vertical stack of 3 text copies */}
      <span className="flex flex-col transition-transform duration-300 ease-out group-hover/tripling:-translate-y-1/3">
        {/* Top copy - muted */}
        <span className="text-fg-tertiary select-none" aria-hidden="true">
          {children}
        </span>
        {/* Middle copy - visible/highlighted */}
        <span className="text-fg-secondary group-hover/tripling:text-fg-brand transition-colors duration-300">
          {children}
        </span>
        {/* Bottom copy - muted */}
        <span className="text-fg-tertiary select-none" aria-hidden="true">
          {children}
        </span>
      </span>
      {/* Screen reader accessible text */}
      <span className="sr-only">{children}</span>
    </span>
  );
}
