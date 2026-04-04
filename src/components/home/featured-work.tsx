"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "@untitledui-pro/icons/line";
import { useRef } from "react";
import { featuredProjects } from "@/data/projects";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { Button } from "@/components/shared/button";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionLabel } from "@/components/shared/section-label";

export function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-bg-secondary">
      <div className="container-main">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16"
        >
          <div>
            <SectionLabel className="mb-4">Work</SectionLabel>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl">
              Selected Projects
            </h2>
          </div>
          <Button href="/projects" variant="ghost" className="group">
            View All Work
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Projects Grid with staggered reveal */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {featuredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              variants={fadeInUp}
              custom={index}
            >
              <ProjectCard project={project} />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
