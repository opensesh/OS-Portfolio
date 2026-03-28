"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { processSteps } from "@/data/process";
import { staggerContainer, fadeInUp } from "@/lib/motion";

export function ProcessSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="container-main">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 md:mb-20"
        >
          <p className="section-label mb-4">Process</p>
          <h2 className="text-display text-3xl md:text-4xl lg:text-5xl max-w-2xl">
            How we work
          </h2>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6"
        >
          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={fadeInUp}
              className="group"
            >
              {/* Number */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-display text-5xl md:text-6xl text-fg-tertiary group-hover:text-fg-brand transition-colors duration-300">
                  {step.number}
                </span>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block flex-1 h-px bg-border-secondary" />
                )}
              </div>

              {/* Content */}
              <h3 className="text-heading text-xl md:text-2xl mb-3">
                {step.title}
              </h3>
              <p className="text-fg-secondary text-sm md:text-base leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
