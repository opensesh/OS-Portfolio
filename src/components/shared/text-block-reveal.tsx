"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { usePageLoaded } from "@/hooks/use-page-loaded";
import "./text-block-reveal.css";

interface TextBlockRevealProps {
  /** Text to reveal — use \n for explicit line breaks */
  children: string;
  /** HTML element tag */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  /** Additional className for the text element */
  className?: string;
  /**
   * Trigger mode:
   * - "after-loader": fires after PageLoader exits (above-the-fold content)
   * - "scroll": fires when element enters viewport
   */
  trigger?: "after-loader" | "scroll";
  /** Delay after trigger fires before animation starts (seconds) */
  delay?: number;
  /** Stagger between lines (seconds) */
  stagger?: number;
}

export function TextBlockReveal({
  children,
  as: Tag = "h1",
  className,
  trigger = "scroll",
  delay = 0,
  stagger = 0.15,
}: TextBlockRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const pageLoaded = usePageLoaded();

  const lines = children.split("\n").filter(Boolean);

  const animate =
    trigger === "after-loader" ? pageLoaded : isInView;

  return (
    <div ref={containerRef} className={animate ? "tbr-animate" : undefined}>
      <Tag className={className}>
        {lines.map((line, i) => {
          const lineDelay = delay + i * stagger;
          return (
            <span key={i}>
              {i > 0 && <br />}
              <span
                className="tbr-line relative inline-block"
                style={{ "--tbr-delay": `${lineDelay}s` } as React.CSSProperties}
              >
                <span className="tbr-line-inner block whitespace-nowrap">
                  {line}
                </span>
                <span
                  className="tbr-rect tbr-brand absolute inset-x-[-0.1em] inset-y-[-0.05em] bg-bg-brand-solid"
                  aria-hidden="true"
                />
                <span
                  className="tbr-rect tbr-fg absolute inset-x-[-0.1em] inset-y-[-0.05em] bg-fg-primary"
                  aria-hidden="true"
                />
              </span>
            </span>
          );
        })}
      </Tag>
    </div>
  );
}
