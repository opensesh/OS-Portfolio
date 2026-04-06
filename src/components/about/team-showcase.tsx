"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { showcase } from "@/data/team";
import { fadeInLeft, fadeInRight, staggerContainer } from "@/lib/motion";
import { HoverMaskReveal } from "@/components/shared/hover-mask-reveal";
import { devProps } from "@/utils/dev-props";

export function TeamShowcase() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  const karim = showcase.find((m) => m.id === "karim")!;
  const morgan = showcase.find((m) => m.id === "morgan")!;

  return (
    <section {...devProps("TeamShowcase")} ref={ref} className="py-20 md:py-32">
      <div className="container-main">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 md:mb-24"
        >
          <p className="section-label mb-4">Meet the Team</p>
          <h2 className="text-display text-3xl md:text-4xl lg:text-5xl">
            The people behind the work
          </h2>
        </motion.div>

        {/* Karim — Image LEFT, Text RIGHT */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
        >
          <motion.div variants={fadeInLeft}>
            <HoverMaskReveal
              src={karim.image!}
              alt={karim.name}
              className="aspect-[3/4] w-full"
            />
          </motion.div>

          <motion.div variants={fadeInRight}>
            <h3 className="text-display text-2xl md:text-3xl lg:text-4xl mb-4">
              {karim.name}
            </h3>
            <p className="text-fg-brand text-sm uppercase tracking-widest mb-6">
              {karim.role}
            </p>
            <p className="text-fg-secondary text-lg leading-relaxed">
              {karim.bio}
            </p>
          </motion.div>
        </motion.div>

        {/* Morgan — Text LEFT, Image RIGHT */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mt-16 lg:mt-24"
        >
          <motion.div
            variants={fadeInLeft}
            className="order-2 lg:order-1"
          >
            <h3 className="text-display text-2xl md:text-3xl lg:text-4xl mb-4">
              {morgan.name}
            </h3>
            <p className="text-fg-brand text-sm uppercase tracking-widest mb-6">
              {morgan.role}
            </p>
            <p className="text-fg-secondary text-lg leading-relaxed">
              {morgan.bio}
            </p>
          </motion.div>

          <motion.div
            variants={fadeInRight}
            className="order-1 lg:order-2"
          >
            <HoverMaskReveal
              src={morgan.image!}
              alt={morgan.name}
              className="aspect-[3/4] w-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
