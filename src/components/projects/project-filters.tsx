"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProjectCategory, projectCategories } from "@/types/project";

interface ProjectFiltersProps {
  activeFilter: ProjectCategory | "All";
  onFilterChange: (filter: ProjectCategory | "All") => void;
}

export function ProjectFilters({
  activeFilter,
  onFilterChange,
}: ProjectFiltersProps) {
  const filters: (ProjectCategory | "All")[] = ["All", ...projectCategories];
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Update indicator position when active filter changes
  useEffect(() => {
    if (!containerRef.current) return;

    const activeButton = containerRef.current.querySelector(
      `[data-filter="${activeFilter}"]`
    ) as HTMLButtonElement;

    if (activeButton) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [activeFilter]);

  return (
    <div ref={containerRef} className="relative flex flex-wrap gap-2">
      {/* Sliding indicator background */}
      <motion.div
        className="absolute top-0 h-full bg-bg-inverse rounded-full -z-10"
        initial={false}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 35,
        }}
      />

      {filters.map((filter) => (
        <button
          key={filter}
          data-filter={filter}
          onClick={() => onFilterChange(filter)}
          className={cn(
            "relative px-5 py-2.5 text-sm font-medium rounded-full",
            "transition-colors duration-200",
            activeFilter === filter
              ? "text-fg-inverse"
              : "text-fg-secondary hover:text-fg-primary"
          )}
        >
          {/* Text with subtle scale on active */}
          <motion.span
            initial={false}
            animate={{
              scale: activeFilter === filter ? 1.02 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {filter}
          </motion.span>
        </button>
      ))}
    </div>
  );
}
