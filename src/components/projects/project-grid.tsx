"use client";

import { motion } from "framer-motion";
import { Project } from "@/types/project";
import { ProjectCard } from "./project-card";
import { staggerContainer, fadeInUp } from "@/lib/motion";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-fg-secondary">No projects found.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
    >
      {projects.map((project, index) => (
        <motion.div key={project.id} variants={fadeInUp}>
          <ProjectCard project={project} priority={index < 3} />
        </motion.div>
      ))}
    </motion.div>
  );
}
