"use client";

import dynamic from "next/dynamic";
import type { WhatWeDoItem } from "@/data/what-we-do";
import { devProps } from "@/utils/dev-props";

const PixelTransition = dynamic(
  () =>
    import("@/components/shared/pixel-transition").then((mod) => ({
      default: mod.PixelTransition,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="relative">
        <div style={{ paddingTop: "75%" }} />
        <div className="absolute inset-0 bg-bg-tertiary" />
      </div>
    ),
  }
);

interface WhatWeDoCardProps {
  item: WhatWeDoItem;
}

export function WhatWeDoCard({ item }: WhatWeDoCardProps) {
  return (
    <div
      {...devProps("WhatWeDoCard")}
      className="bg-bg-secondary border border-border-secondary rounded-lg overflow-hidden"
    >
      {/* Image area with PixelTransition */}
      <PixelTransition
        firstContent={<div className="w-full h-full bg-bg-tertiary" />}
        secondContent={<div className="w-full h-full bg-bg-brand-solid" />}
        gridSize={14}
        pixelColor="#FE5102"
        animationStepDuration={0.7}
        aspectRatio="75%"
      />

      {/* Text content */}
      <div className="p-6">
        <h3 className="text-heading text-xl md:text-2xl mb-3">{item.title}</h3>
        <p className="text-fg-secondary text-sm md:text-base leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
}
