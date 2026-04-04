"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { values } from "@/data/values";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { devProps } from "@/utils/dev-props";

export function ValuesSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section {...devProps('ValuesSection')} ref={ref} className="py-20 md:py-32">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <p className="section-label mb-4">Values</p>
          <h2 className="text-display text-3xl md:text-4xl lg:text-5xl max-w-2xl">
            What we believe in
          </h2>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
        >
          {values.map((value, index) => (
            <motion.div
              key={value.id}
              variants={fadeInUp}
              className="group"
            >
              {/* Number */}
              <span className="text-display text-4xl md:text-5xl text-fg-tertiary group-hover:text-fg-brand transition-colors duration-300 mb-4 block">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Content */}
              <h3 className="text-heading text-xl md:text-2xl mb-3">
                {value.title}
              </h3>
              <p className="text-fg-secondary leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
