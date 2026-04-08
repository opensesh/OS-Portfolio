"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "@untitledui-pro/icons/line";
import { accordionContent } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ScrambleText } from "@/components/shared/scramble-text";
import { devProps } from "@/utils/dev-props";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function FAQAccordion({
  items,
  allowMultiple = false,
  className,
}: FAQAccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div {...devProps('FAQAccordion')} className={cn("space-y-3", className)}>
      {items.map((item, index) => {
        const isExpanded = expandedItems.has(index);
        const number = String(index + 1).padStart(2, "0");

        return (
          <motion.div
            key={index}
            className={cn(
              "border border-border-secondary rounded-lg overflow-hidden",
              "transition-all duration-300",
              isExpanded && "border-border-primary bg-bg-secondary/30"
            )}
            initial={false}
            animate={{
              borderColor: isExpanded
                ? "var(--border-primary)"
                : "var(--border-secondary)",
            }}
          >
            {/* Question */}
            <button
              onClick={() => toggleItem(index)}
              className={cn(
                "w-full flex items-center gap-4",
                "px-5 py-4 md:px-6 md:py-5",
                "text-left group"
              )}
              aria-expanded={isExpanded}
            >
              {/* Number indicator */}
              <motion.span
                className={cn(
                  "flex-shrink-0 text-sm font-mono",
                  "transition-colors duration-200",
                  isExpanded ? "text-fg-brand" : "text-fg-tertiary"
                )}
                animate={{ scale: isExpanded ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {number}
              </motion.span>

              {/* Question text with scramble on hover */}
              <ScrambleText
                as="span"
                className={cn(
                  "flex-1 font-medium text-base md:text-lg",
                  "transition-colors duration-200",
                  isExpanded ? "text-fg-brand" : "text-fg-primary group-hover:text-fg-brand"
                )}
                duration={700}
              >
                {item.question}
              </ScrambleText>

              {/* Toggle icon with rotation */}
              <motion.div
                className={cn(
                  "flex-shrink-0 w-8 h-8 flex items-center justify-center",
                  "border border-border-primary rounded-full",
                  "transition-colors duration-200",
                  isExpanded && "bg-bg-brand-solid border-transparent"
                )}
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {isExpanded ? (
                  <Minus className="w-4 h-4 text-white" />
                ) : (
                  <Plus className="w-4 h-4 text-fg-primary" />
                )}
              </motion.div>
            </button>

            {/* Answer with smooth height animation */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  variants={accordionContent}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="overflow-hidden"
                >
                  <motion.div
                    className="px-5 pb-5 md:px-6 md:pb-6 pl-14 md:pl-16"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <p className="text-fg-secondary text-sm md:text-base leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
