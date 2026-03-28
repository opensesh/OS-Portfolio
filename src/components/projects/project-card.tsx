"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/types/project";
import { imageHover } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      {/* Image */}
      <motion.div
        variants={imageHover}
        initial="initial"
        whileHover="hover"
        className={cn(
          "relative aspect-[4/3] mb-4 overflow-hidden",
          "bg-bg-tertiary"
        )}
      >
        {/* Placeholder - replace with actual images */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-fg-tertiary text-sm">{project.title}</span>
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

        {/* Hover overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-bg-inverse/0 group-hover:bg-bg-inverse/10",
            "transition-colors duration-300"
          )}
        />
      </motion.div>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-fg-tertiary font-mono uppercase">
          {project.category}
        </span>
        <span className="text-fg-tertiary">—</span>
        <span className="text-xs text-fg-tertiary font-mono uppercase">
          {project.industry}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-heading text-xl group-hover:text-fg-brand transition-colors duration-200">
        {project.title}
      </h3>

      {/* Year */}
      <p className="text-sm text-fg-tertiary mt-1">{project.year}</p>
    </Link>
  );
}
