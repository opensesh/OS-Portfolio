"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "brand";
  animate?: boolean;
}

export function SectionLabel({
  children,
  className,
  variant = "default",
  animate = true,
}: SectionLabelProps) {
  const Component = animate ? motion.p : "p";

  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }
    : {};

  return (
    <Component
      {...animationProps}
      className={cn(
        "section-label",
        variant === "brand" && "section-label--brand",
        className
      )}
    >
      {children}
    </Component>
  );
}
