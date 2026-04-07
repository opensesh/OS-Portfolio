"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { ViewMode } from "@/types/project";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectGrid } from "@/components/projects/project-grid";
import { ProjectCarousel } from "@/components/projects/project-carousel";
import { ProjectViewToggle } from "@/components/projects/project-view-toggle";
import { CarouselNavArrows } from "@/components/projects/carousel-nav-arrows";
import { SectionLabel } from "@/components/shared/section-label";
import { devProps } from "@/utils/dev-props";

export default function ProjectsPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true });

  const [activeFilter, setActiveFilter] = useState<string | "All">("All");
  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) => p.categories.some((c) => c === activeFilter));
  }, [activeFilter]);

  // Reset active index when filter changes
  const handleFilterChange = useCallback((filter: string | "All") => {
    setActiveFilter(filter);
    setActiveIndex(0);
  }, []);

  const carouselGoTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < filteredProjects.length - 1;

  return (
    <div {...devProps("ProjectsPage")} className="min-h-screen flex flex-col py-20 md:py-32">
      {/* Header */}
      <div className="container-wide">
        <div ref={headerRef} className="mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel className="mb-4">Work</SectionLabel>
          </motion.div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-display text-4xl md:text-5xl lg:text-6xl"
            >
              Projects
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-fg-secondary text-base md:text-lg max-w-md md:text-right"
            >
              15+ projects shipped across brand, digital design &amp; creative direction.
            </motion.p>
          </div>
        </div>

        {/* Controls bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-between gap-4 mb-8 md:mb-12"
        >
          {/* Left: Filter */}
          <ProjectFilters
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />

          {/* Center: Nav arrows (carousel mode only) */}
          {viewMode === "carousel" && filteredProjects.length > 1 && (
            <div className="flex items-center justify-center">
              <CarouselNavArrows
                onPrev={() => carouselGoTo(Math.max(0, activeIndex - 1))}
                onNext={() => carouselGoTo(Math.min(filteredProjects.length - 1, activeIndex + 1))}
                canPrev={canPrev}
                canNext={canNext}
              />
            </div>
          )}

          {/* Right: View toggle */}
          <ProjectViewToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </motion.div>
      </div>

      {/* Content area — flex-1 fills remaining viewport */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {viewMode === "carousel" ? (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCarousel
                projects={filteredProjects}
                activeIndex={activeIndex}
                onActiveIndexChange={setActiveIndex}
              />
            </motion.div>
          ) : (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="container-wide"
            >
              <ProjectGrid
                projects={filteredProjects}
                columns={viewMode === "two-column" ? 2 : 3}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
