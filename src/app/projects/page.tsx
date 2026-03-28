"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { ProjectCategory } from "@/types/project";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectGrid } from "@/components/projects/project-grid";

export default function ProjectsPage() {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <p className="section-label mb-4">Work</p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl mb-6">
            Selected Projects
          </h1>
          <p className="text-fg-secondary text-lg max-w-2xl mb-8">
            A collection of work across brand identity, digital design, art
            direction, and strategic consulting.
          </p>

          {/* Filters */}
          <ProjectFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </motion.div>

        {/* Projects Grid */}
        <ProjectGrid projects={filteredProjects} />
      </div>
    </div>
  );
}
