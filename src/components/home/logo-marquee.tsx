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
  const [mode, setMode] = useState<MarqueeMode>("clients");
  const items = mode === "clients" ? clients : tools;
  const duplicated = [...items, ...items];

  return (
    <section
      className="py-16 md:py-20 border-y border-border-secondary overflow-hidden"
      {...devProps("LogoMarquee")}
    >
      {/* Toggle */}
      <div className="container-main mb-10">
        <div className="flex items-center justify-center gap-1">
          {(["clients", "tools"] as const).map((tab) => (
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

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex animate-marquee"
          >
            {duplicated.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className={cn(
                  "flex-shrink-0 px-8 md:px-12",
                  "flex items-center justify-center"
                )}
              >
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={120}
                  height={40}
                  className="h-6 md:h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
