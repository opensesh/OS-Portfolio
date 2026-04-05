"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { whatWeDoItems } from "@/data/what-we-do";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { WhatWeDoCard } from "@/components/home/what-we-do-card";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { devProps } from "@/utils/dev-props";

export function WhatWeDoSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 md:py-32" {...devProps("WhatWeDoSection")}>
      <div className="container-main">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-label mb-4"
          >
            What We Do
          </motion.p>
          <TextBlockReveal
            as="h2"
            trigger="scroll"
            className="text-display text-3xl md:text-4xl lg:text-5xl max-w-2xl"
          >
            Three ways we deliver value
          </TextBlockReveal>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {whatWeDoItems.map((item) => (
            <motion.div key={item.id} variants={fadeInUp}>
              <WhatWeDoCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
