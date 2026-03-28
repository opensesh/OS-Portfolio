"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { accordionContent } from "@/lib/motion";
import { cn } from "@/lib/utils";

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
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => {
        const isExpanded = expandedItems.has(index);

        return (
          <div
            key={index}
            className={cn(
              "border border-border-secondary",
              "transition-colors duration-200",
              isExpanded && "border-border-primary"
            )}
          >
            {/* Question */}
            <button
              onClick={() => toggleItem(index)}
              className={cn(
                "w-full flex items-start justify-between gap-4",
                "px-5 py-4 md:px-6 md:py-5",
                "text-left"
              )}
              aria-expanded={isExpanded}
            >
              <span className="text-fg-primary font-medium text-base md:text-lg">
                {item.question}
              </span>
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 flex items-center justify-center",
                  "border border-border-primary rounded-full",
                  "transition-all duration-200",
                  isExpanded && "bg-bg-brand-solid border-transparent rotate-0"
                )}
              >
                {isExpanded ? (
                  <Minus className="w-4 h-4 text-white" />
                ) : (
                  <Plus className="w-4 h-4 text-fg-primary" />
                )}
              </div>
            </button>

            {/* Answer */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  variants={accordionContent}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 md:px-6 md:pb-6">
                    <p className="text-fg-secondary text-sm md:text-base leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
