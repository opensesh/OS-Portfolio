"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "@untitledui-pro/icons/line";
import Image from "next/image";
import { Project } from "@/types/project";
import { categoryLabel } from "@/data/categories";
import { cn } from "@/lib/utils";
import { ScrambleText } from "@/components/shared/scramble-text";
import { useMagneticCursor } from "@/hooks/use-magnetic-cursor";
import { devProps } from "@/utils/dev-props";

interface ProjectCardProps {
  project: Project;
  variant?: "grid" | "carousel";
  /** Parallax translateX for carousel images (from parent carousel) */
  parallaxX?: MotionValue<number>;
}

function MagneticCursorLabel({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const { cursorX, cursorY, opacity, rotate, bind } = useMagneticCursor(containerRef);

  return (
    <>
      {/* Invisible overlay to capture mouse events */}
      <div
        className="absolute inset-0 z-10"
        onMouseMove={bind.onMouseMove}
        onMouseEnter={bind.onMouseEnter}
        onMouseLeave={bind.onMouseLeave}
      />
      {/* Floating label with tilt */}
      <motion.div
        className={cn(
          "absolute z-20 pointer-events-none",
          "flex items-center justify-center",
          "px-4 py-2 bg-bg-brand-solid text-white",
          "font-accent text-xs uppercase tracking-wider",
          "whitespace-nowrap"
        )}
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
          opacity,
          rotate,
        }}
      >
        VIEW PROJECT
      </motion.div>
    </>
  );
}

function CarouselCard({ project, parallaxX }: { project: Project; parallaxX?: MotionValue<number> }) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={cardRef} className="group block">
      {/* Image container */}
      <div className="relative aspect-[3/2] overflow-hidden bg-bg-tertiary">
        {/* Image with parallax */}
        <motion.div
          className="absolute inset-0"
          style={parallaxX ? { x: parallaxX, scale: 1.225 } : undefined}
        >
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-tertiary to-bg-secondary">
              <span className="text-fg-tertiary text-sm font-medium">
                {project.title}
              </span>
            </div>
          )}
        </motion.div>

        {/* Magnetic cursor overlay */}
        <MagneticCursorLabel containerRef={cardRef} />
      </div>

      {/* Meta below image */}
      <div className="mt-4 flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
        <ScrambleText
          as="h3"
          className="font-accent text-base uppercase tracking-wider text-fg-primary"
          duration={300}
        >
          {project.title}
        </ScrambleText>
        <div className="flex items-center gap-2 text-fg-secondary">
          <span className="font-accent text-xs uppercase tracking-wider">
            [{categoryLabel(project.categories[0]).toUpperCase()}]
          </span>
          {project.industry && (
            <>
              <span className="text-fg-tertiary">&mdash;</span>
              <span className="font-accent text-xs uppercase tracking-wider">
                [{project.industry}]
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GridCard({ project }: { project: Project }) {
  return (
    <Link
      {...devProps("ProjectCard")}
      href={`/projects/${project.slug}`}
      className="group block"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-bg-tertiary">
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-700 ease-out",
            "group-hover:scale-105"
          )}
        >
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-tertiary to-bg-secondary">
              <span className="text-fg-tertiary text-sm font-medium">
                {project.title}
              </span>
            </div>
          )}
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
            "flex items-center gap-2 px-3 py-2",
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
          {categoryLabel(project.categories[0])}
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-fg-tertiary uppercase tracking-wide">
          {project.industry}
        </span>
        <span className="text-fg-tertiary">&middot;</span>
        <span className="text-xs text-fg-tertiary">{project.year}</span>
      </div>

      {/* Title with scramble */}
      <ScrambleText
        as="h3"
        className="text-heading text-xl group-hover:text-fg-brand transition-colors duration-200"
        duration={300}
      >
        {project.title}
      </ScrambleText>

      {project.description && (
        <p className="text-sm text-fg-secondary mt-2 line-clamp-2">
          {project.description}
        </p>
      )}
    </Link>
  );
}

export function ProjectCard({ project, variant = "grid", parallaxX }: ProjectCardProps) {
  if (variant === "carousel") {
    return <CarouselCard project={project} parallaxX={parallaxX} />;
  }
  return <GridCard project={project} />;
}
