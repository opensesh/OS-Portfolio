"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { featuredProjects } from "@/data/projects";
import { staggerContainer, fadeInUp, imageHover } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/button";

export function FeaturedWork() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-bg-secondary">
      <div className="container-main">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16"
        >
          <div>
            <p className="section-label mb-4">Work</p>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl">
              Selected Projects
            </h2>
          </div>
          <Button href="/projects" variant="ghost" className="group">
            View All Work
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {featuredProjects.map((project) => (
            <motion.article key={project.id} variants={fadeInUp}>
              <Link href={`/projects/${project.slug}`} className="group block">
                {/* Image */}
                <motion.div
                  variants={imageHover}
                  initial="initial"
                  whileHover="hover"
                  className={cn(
                    "relative aspect-[4/3] mb-4 overflow-hidden",
                    "bg-bg-tertiary"
                  )}
                >
                  {/* Placeholder - replace with actual images */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-fg-tertiary text-sm">
                      {project.title}
                    </span>
                  </div>
                  {/* Uncomment when images are available
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  */}
                </motion.div>

                {/* Meta */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-fg-tertiary font-mono uppercase">
                    {project.category}
                  </span>
                  <span className="text-fg-tertiary">—</span>
                  <span className="text-xs text-fg-tertiary font-mono uppercase">
                    {project.industry}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-heading text-xl group-hover:text-fg-brand transition-colors duration-200">
                  {project.title}
                </h3>

                {/* Year */}
                <p className="text-sm text-fg-tertiary mt-1">{project.year}</p>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
