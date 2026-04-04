"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

interface LogoProps {
  className?: string;
  logoType?: "horizontal" | "combo";
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { height: 20, width: 100 },
  md: { height: 24, width: 120 },
  lg: { height: 32, width: 160 },
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
      {...devProps('Logo')}
      href="/"
      className={cn(
        "inline-flex items-center transition-opacity duration-200 hover:opacity-80",
        className
      )}
      aria-label="Open Session - Home"
    >
      {/* Light mode: charcoal variant */}
      <div className="dark:hidden">
        <Image
          src={charcoalSrc}
          alt="Open Session"
          width={dimensions.width}
          height={dimensions.height}
          style={{ width: `${dimensions.width}px`, height: "auto" }}
          priority
        />
      </div>
      {/* Dark mode: vanilla variant */}
      <div className="hidden dark:block">
        <Image
          src={vanillaSrc}
          alt="Open Session"
          width={dimensions.width}
          height={dimensions.height}
          style={{ width: `${dimensions.width}px`, height: "auto" }}
          priority
        />
      </div>
    </Link>
  );
}
