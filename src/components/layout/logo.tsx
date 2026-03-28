"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { height: 24, width: 100 },
  md: { height: 32, width: 133 },
  lg: { height: 40, width: 166 },
};

export function Logo({ className, variant = "full", size = "md" }: LogoProps) {
  const dimensions = sizeMap[size];

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center transition-opacity duration-200 hover:opacity-80",
        className
      )}
      aria-label="Open Session - Home"
    >
      <Image
        src="/logo.png"
        alt="Open Session"
        width={variant === "mark" ? dimensions.height : dimensions.width}
        height={dimensions.height}
        className="dark:invert"
        style={{ width: "auto", height: "auto" }}
        priority
      />
    </Link>
  );
}
