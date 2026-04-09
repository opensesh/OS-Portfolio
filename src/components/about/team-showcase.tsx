"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { showcase } from "@/data/team";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { HoverMaskReveal } from "@/components/shared/hover-mask-reveal";
import { devProps } from "@/utils/dev-props";

export function TeamShowcase() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      {...devProps("TeamShowcase")}
      ref={ref}
      className="py-20 md:py-32 bg-bg-inverse"
    >
      <div className="container-main">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <p className="section-label mb-4">Meet the Team</p>
          <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-inverse">
            The People Behind the Work
          </h2>
        </motion.div>

        {/* Side-by-side team cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24"
        >
          {showcase.map((member) => (
            <motion.div
              key={member.id}
              variants={fadeInUp}
              className="flex flex-col gap-10"
            >
              <HoverMaskReveal
                src={member.image!}
                alt={member.name}
                className="aspect-[4/5] w-full rounded-[10px]"
              />
              <div className="flex flex-col gap-4">
                <h3 className="text-display text-2xl md:text-3xl lg:text-4xl text-fg-inverse">
                  {member.name}
                </h3>
                <p className="text-fg-brand text-sm uppercase tracking-[0.2em] font-medium">
                  {member.role}
                </p>
                <p className="text-fg-secondary text-base md:text-lg leading-relaxed pt-2">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
