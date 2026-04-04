"use client";

import Link from "next/link";
import { ArrowUpRight } from "@untitledui-pro/icons/line";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import { ScrambleText } from "@/components/shared/scramble-text";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      {/* Image Container with reveal animation */}
      <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-bg-tertiary rounded-lg">
        {/* Image with zoom on hover */}
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-700 ease-out",
            "group-hover:scale-105"
          )}
        >
          {/* Placeholder - replace with actual images when available */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-tertiary to-bg-secondary">
            <span className="text-fg-tertiary text-sm font-medium">
              {project.title}
            </span>
          </div>
          {/* Uncomment when images are available
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
            priority={priority}
          />
          */}
        </div>

        {/* Gradient overlay on hover */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100",
            "bg-gradient-to-t from-bg-inverse/60 via-transparent to-transparent",
            "transition-opacity duration-300"
          )}
        />

        {/* View Project indicator */}
        <div
          className={cn(
            "absolute bottom-4 right-4",
            "flex items-center gap-2 px-3 py-2 rounded-full",
            "bg-bg-primary text-fg-primary text-sm font-medium",
            "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
            "transition-all duration-300"
          )}
        >
          View Project
          <ArrowUpRight className="w-4 h-4" />
        </div>

        {/* Category tag slides in from left */}
        <div
          className={cn(
            "absolute top-4 left-0 px-3 py-1",
            "bg-bg-brand-solid text-white text-xs font-medium uppercase tracking-wider",
            "-translate-x-full group-hover:translate-x-0",
            "transition-transform duration-300 ease-out"
          )}
        >
          {project.category}
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-fg-tertiary uppercase tracking-wide">
          {project.industry}
        </span>
        <span className="text-fg-tertiary">·</span>
        <span className="text-xs text-fg-tertiary">{project.year}</span>
      </div>

      {/* Title with scramble on hover */}
      <ScrambleText
        as="h3"
        className="text-heading text-xl group-hover:text-fg-brand transition-colors duration-200"
        duration={300}
      >
        {project.title}
      </ScrambleText>

      {/* Brief description */}
      {project.description && (
        <p className="text-sm text-fg-secondary mt-2 line-clamp-2">
          {project.description}
        </p>
      )}
    </Link>
  );
}
