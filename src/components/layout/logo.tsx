"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-display font-bold tracking-tight",
        "text-fg-primary hover:text-fg-brand transition-colors duration-200",
        className
      )}
    >
      {/* Logo Mark - Simple "OS" monogram */}
      <span className="flex items-center justify-center w-10 h-10 bg-bg-brand-solid text-white rounded-lg text-lg font-bold">
        OS
      </span>
      {showText && (
        <span className="text-xl hidden sm:block">Open Session</span>
      )}
    </Link>
  );
}
