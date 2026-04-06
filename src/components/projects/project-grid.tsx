"use client";

import { useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Project } from "@/types/project";
import { ProjectCard } from "./project-card";
import { devProps } from "@/utils/dev-props";
import { cn } from "@/lib/utils";

interface ProjectGridProps {
  projects: Project[];
  columns?: 2 | 3;
}

export function ProjectGrid({ projects, columns }: ProjectGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: "-50px" });

  if (projects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="py-20 text-center"
      >
        <p className="text-fg-secondary">No projects found.</p>
      </motion.div>
    );
  }

  const gridClasses = columns === 2
    ? "grid-cols-1 md:grid-cols-2"
    : columns === 3
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <motion.div
      {...devProps("ProjectGrid")}
      ref={gridRef}
      layout
      className={cn("grid gap-6 md:gap-8", gridClasses)}
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      delay: index * 0.05,
                    },
                  }
                : {}
            }
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.2 },
            }}
            transition={{
              layout: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
            }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
