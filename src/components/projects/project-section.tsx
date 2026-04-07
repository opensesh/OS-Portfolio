"use client";

import { motion } from "framer-motion";
import { ProjectSection, ProjectImage } from "@/types/project";
import { ProjectGallery } from "./project-gallery";
import { fadeInUp, staggerContainer } from "@/lib/motion";

interface ProjectSectionProps {
  section: ProjectSection;
  sectionNumber: number;
  images: ProjectImage[];
}

export function ProjectSectionBlock({
  section,
  sectionNumber,
  images,
}: ProjectSectionProps) {
  const sectionKey = section.heading.toLowerCase();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="space-y-10"
    >
      {/* Section label: "/ Challenge" left + "(01)" right */}
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-between"
      >
        <span className="font-accent text-sm uppercase tracking-wider text-fg-tertiary">
          / {section.heading}
        </span>
        <span className="font-accent text-sm uppercase tracking-wider text-fg-tertiary">
          ({String(sectionNumber).padStart(2, "0")})
        </span>
      </motion.div>

      {/* Headline — bold italic display */}
      <motion.h2
        variants={fadeInUp}
        className="text-display text-2xl md:text-3xl lg:text-4xl italic max-w-full md:max-w-[65%]"
      >
        {section.headline}
      </motion.h2>

      {/* Body — constrained width */}
      <motion.p
        variants={fadeInUp}
        className="text-fg-secondary text-base md:text-lg leading-relaxed max-w-full md:max-w-[60%]"
      >
        {section.body}
      </motion.p>

      {/* Section images */}
      {images.length > 0 && (
        <motion.div variants={fadeInUp}>
          <ProjectGallery images={images} sectionKey={sectionKey} />
        </motion.div>
      )}
    </motion.div>
  );
}
