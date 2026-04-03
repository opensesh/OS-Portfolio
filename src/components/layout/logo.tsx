"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  logoType?: "horizontal" | "combo";
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { height: 24, width: 100 },
  md: { height: 32, width: 133 },
  lg: { height: 40, width: 166 },
};

const comboSizeMap = {
  sm: { height: 32, width: 80 },
  md: { height: 40, width: 100 },
  lg: { height: 48, width: 120 },
};

export function Logo({ className, logoType = "horizontal", size = "md" }: LogoProps) {
  const dimensions = logoType === "combo" ? comboSizeMap[size] : sizeMap[size];

  const vanillaSrc = `/logos/${logoType}-vanilla.png`;
  const charcoalSrc = `/logos/${logoType}-charcoal.png`;

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center transition-opacity duration-200 hover:opacity-80",
        className
      )}
      aria-label="Open Session - Home"
    >
      {/* Light mode: charcoal variant */}
      <Image
        src={charcoalSrc}
        alt="Open Session"
        width={dimensions.width}
        height={dimensions.height}
        className="dark:hidden"
        style={{ width: "auto", height: `${dimensions.height}px` }}
        priority
      />
      {/* Dark mode: vanilla variant */}
      <Image
        src={vanillaSrc}
        alt="Open Session"
        width={dimensions.width}
        height={dimensions.height}
        className="hidden dark:block"
        style={{ width: "auto", height: `${dimensions.height}px` }}
        priority
      />
    </Link>
  );
}
