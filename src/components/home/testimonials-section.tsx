"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { devProps } from "@/utils/dev-props";

export function TestimonialsSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-32" {...devProps("TestimonialsSection")}>
      <div className="container-main">
        {/* Section Header */}
        <div className="mb-16 md:mb-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-label mb-4"
          >
            Testimonials
          </motion.p>
          <TextBlockReveal
            as="h2"
            trigger="scroll"
            className="text-display text-3xl md:text-4xl lg:text-5xl max-w-2xl mx-auto"
          >
            What They Say
          </TextBlockReveal>
        </div>

        {/* Placeholder cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="border border-border-secondary rounded-lg p-8 flex flex-col gap-6"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-4 h-4 rounded-sm bg-bg-brand-solid"
                  />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-bg-tertiary" />
                <div className="h-3 w-full rounded bg-bg-tertiary" />
                <div className="h-3 w-4/5 rounded bg-bg-tertiary" />
              </div>
              <div className="flex items-center gap-3 mt-auto pt-2">
                <div className="w-10 h-10 rounded-full bg-bg-tertiary" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 rounded bg-bg-tertiary" />
                  <div className="h-2.5 w-32 rounded bg-bg-tertiary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
