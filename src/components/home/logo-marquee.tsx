"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { clients } from "@/data/clients";
import { tools } from "@/data/tools";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

type MarqueeMode = "clients" | "tools";

const labels: Record<MarqueeMode, string> = {
  clients: "Trusted By",
  tools: "Experts In",
};

export function LogoMarquee() {
  const [mode, setMode] = useState<MarqueeMode>("tools");
  const items = mode === "clients" ? clients : tools;
  const duplicated = [...items, ...items];

  return (
    <section
      className="py-16 md:py-20 border-y border-border-secondary"
      style={{ overflowX: "clip", overflowY: "visible" }}
      {...devProps("LogoMarquee")}
    >
      {/* Toggle */}
      <div className="container-main mb-6">
        <div className="flex items-center justify-center gap-1">
          {(["tools", "clients"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              className={cn(
                "section-label relative px-4 py-2 transition-colors duration-200",
                mode === tab
                  ? "text-fg-brand"
                  : "text-fg-tertiary hover:text-fg-secondary"
              )}
            >
              {labels[tab]}
              {mode === tab && (
                <motion.span
                  layoutId="marquee-tab-indicator"
                  className="absolute inset-x-1 -bottom-px h-px bg-fg-brand"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-bg-primary to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-bg-primary to-transparent z-10" />

        {/* Fixed height prevents layout shift between modes */}
        <div className="h-10 md:h-14 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex animate-marquee items-center"
              style={{ animationDuration: mode === "clients" ? "20s" : "35s" }}
            >
            {duplicated.map((item, index) => (
              <a
                key={`${item.name}-${index}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="group relative flex-shrink-0 flex items-center justify-center px-8 md:px-12"
              >
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={120}
                  height={40}
                  className={cn(
                    "w-auto object-contain opacity-60 hover:opacity-100 transition-opacity invert dark:invert-0",
                    mode === "clients"
                      ? "h-8 md:h-10 max-w-[120px] md:max-w-[160px]"
                      : "h-10 md:h-14"
                  )}
                />
                <span className="pointer-events-none absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-bg-secondary px-2 py-1 text-xs text-fg-secondary opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-border-secondary">
                  {item.name}
                </span>
              </a>
            ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
