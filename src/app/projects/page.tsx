"use client";

import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { projects } from "@/data/projects";
import { ProjectCategory } from "@/types/project";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectGrid } from "@/components/projects/project-grid";
import { SectionLabel } from "@/components/shared/section-label";

export default function ProjectsPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true });
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "All">(
    "All"
  );

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="py-20 md:py-32">
      <div className="container-main">
        {/* Header */}
        <div ref={headerRef} className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel className="mb-4">Work</SectionLabel>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-display text-4xl md:text-5xl lg:text-6xl mb-6"
          >
            Selected Projects
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-fg-secondary text-lg max-w-2xl mb-8"
          >
            A collection of work across brand identity, digital design, art
            direction, and strategic consulting.
          </motion.p>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProjectFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </motion.div>
        </div>

        {/* Projects Grid */}
        <ProjectGrid projects={filteredProjects} />
      </div>
    </div>
  );
}
