"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";
import { devProps } from "@/utils/dev-props";

interface ProjectThumbnailStripProps {
  projects: Project[];
  activeIndex: number;
  onThumbnailClick: (index: number) => void;
}

export function ProjectThumbnailStrip({
  projects,
  activeIndex,
  onThumbnailClick,
}: ProjectThumbnailStripProps) {
  return (
    <div
      {...devProps("ProjectThumbnailStrip")}
      className="hidden md:flex items-center justify-center"
    >
      <div className="relative overflow-hidden">
        {/* Active indicator border */}
        <div
          className="pointer-events-none absolute top-0 z-10 h-full border border-fg-primary/30 transition-transform duration-300"
          style={{
            width: 80,
            transform: `translateX(${activeIndex * (80 + 16)}px)`,
          }}
        />

        <div className="flex items-center gap-4">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onThumbnailClick(index)}
              className="group"
              aria-label={`Go to ${project.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <div
                className={cn(
                  "relative w-20 aspect-[16/9] overflow-hidden transition-opacity duration-300",
                  index === activeIndex
                    ? "opacity-100"
                    : "opacity-40 group-hover:opacity-70"
                )}
              >
                {project.thumbnail ? (
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full bg-bg-tertiary flex items-center justify-center">
                    <span className="text-[8px] text-fg-tertiary font-accent uppercase tracking-wider">
                      {project.title}
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
