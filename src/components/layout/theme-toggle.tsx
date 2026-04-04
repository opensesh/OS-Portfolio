"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Sun, Moon01 } from "@untitledui-pro/icons/line";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      {...devProps('ThemeToggle')}
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex items-center justify-center",
        "w-10 h-10 rounded-full",
        "bg-transparent hover:bg-bg-secondary",
        "text-fg-primary",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        className
      )}
      aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
    >
      <Sun
        className={cn(
          "w-5 h-5 absolute transition-all duration-300",
          resolvedTheme === "light"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-0"
        )}
      />
      <Moon01
        className={cn(
          "w-5 h-5 absolute transition-all duration-300",
          resolvedTheme === "dark"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-0"
        )}
      />
    </button>
  );
}
