"use client";

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

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={cn(
            "px-4 py-2 text-sm font-medium",
            "border transition-all duration-200",
            activeFilter === filter
              ? "bg-bg-inverse text-fg-inverse border-bg-inverse"
              : "bg-transparent text-fg-secondary border-border-primary hover:border-border-brand hover:text-fg-primary"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
