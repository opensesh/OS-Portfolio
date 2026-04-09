"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@untitledui-pro/icons/line";
import { Project, ProjectImage } from "@/types/project";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { devProps } from "@/utils/dev-props";
import { ProjectResults } from "./project-results";
import { ProjectCard } from "./project-card";

interface ProjectDetailProps {
  project: Project;
  latestProjects: Project[];
}

// ---------------------------------------------------------------------------
// Right-column image gallery
// ---------------------------------------------------------------------------

function ProjectImageGallery({ images }: { images: ProjectImage[] }) {
  if (images.length === 0) return null;

  const items: React.ReactNode[] = [];
  let i = 0;

  while (i < images.length) {
    const remaining = images.length - i;

    if (items.length % 3 === 2 && remaining >= 2) {
      items.push(
        <div key={`pair-${i}`} className="grid grid-cols-2 gap-3">
          <div className="relative aspect-[4/3] bg-bg-tertiary overflow-hidden rounded-lg">
            <Image
              src={images[i].src}
              alt={images[i].alt}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 50vw, 400px"
            />
          </div>
          <div className="relative aspect-[4/3] bg-bg-tertiary overflow-hidden rounded-lg">
            <Image
              src={images[i + 1].src}
              alt={images[i + 1].alt}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 50vw, 400px"
            />
          </div>
        </div>
      );
      i += 2;
    } else {
      items.push(
        <div
          key={`full-${i}`}
          className="relative aspect-[16/9] bg-bg-tertiary overflow-hidden rounded-lg"
        >
          <Image
            src={images[i].src}
            alt={images[i].alt}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 800px"
          />
        </div>
      );
      i += 1;
    }
  }

  return <>{items}</>;
}

// ---------------------------------------------------------------------------
// Scroll-driven section panel — fades in and out based on scroll range
// ---------------------------------------------------------------------------

function ScrollSection({
  section,
  sectionNumber,
  scrollYProgress,
  rangeIn,
  rangeOut,
}: {
  section: { heading: string; headline: string; body: string };
  sectionNumber: number;
  scrollYProgress: MotionValue<number>;
  rangeIn: [number, number];
  rangeOut: [number, number];
}) {
  const opacity = useTransform(
    scrollYProgress,
    [rangeIn[0], rangeIn[1], rangeOut[0], rangeOut[1]],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [rangeIn[0], rangeIn[1], rangeOut[0], rangeOut[1]],
    [30, 0, 0, -20]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-0 top-0"
    >
      {/* Section label row */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-accent text-sm uppercase tracking-wider text-fg-tertiary">
          / {section.heading}
        </span>
        <span className="font-accent text-sm uppercase tracking-wider text-fg-tertiary">
          ({String(sectionNumber).padStart(2, "0")})
        </span>
      </div>

      {/* Headline */}
      <h2 className="text-display text-2xl md:text-[32px] leading-[1.2] tracking-tight mb-6">
        {section.headline}
      </h2>

      {/* Body */}
      <p className="text-fg-secondary text-base leading-[1.25]">
        {section.body}
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ProjectDetail({
  project,
  latestProjects,
}: ProjectDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the two-column container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const sectionCount = project.sections.length;

  // Scroll ranges — divide the scroll into: intro + N sections
  // Intro occupies the first segment, then each section gets an equal slice
  const totalSegments = sectionCount + 1; // +1 for intro
  const segmentSize = 1 / totalSegments;

  // Intro: visible at start, fades out during first segment
  const introOpacity = useTransform(
    scrollYProgress,
    [0, segmentSize * 0.6, segmentSize],
    [1, 1, 0]
  );

  // All images for gallery
  const allImages = project.images.filter(
    (img) =>
      img.context === "hero" ||
      img.context === "gallery" ||
      img.context === "mockup"
  );

  // Metadata row
  const meta = [
    project.services.length > 0 ? project.services.join(", ") : null,
    project.client,
    project.duration,
    project.year,
  ].filter(Boolean);

  return (
    <article {...devProps("ProjectDetail")}>
      {/* ==============================================================
          TWO-COLUMN LAYOUT — left pane is sticky, right scrolls
          ============================================================== */}
      <div ref={containerRef} className="container-main">
        <div className="flex flex-col lg:flex-row gap-10 pt-8 md:pt-12">
          {/* ------------------------------------------------------------
              LEFT COLUMN — sticky, viewport-height pane
              ------------------------------------------------------------ */}
          <div className="flex-1 lg:min-w-0 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:self-start">
            <div className="flex flex-col h-full">
              {/* Fixed header: breadcrumb + title + button */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="shrink-0"
              >
                {/* Back link */}
                <motion.div variants={fadeInUp} className="mb-6">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-fg-secondary hover:text-fg-primary transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    All Projects
                  </Link>
                </motion.div>

                {/* Title */}
                <motion.h1
                  variants={fadeInUp}
                  className="text-display text-4xl md:text-5xl lg:text-[60px] lg:leading-[1.1] tracking-tight"
                >
                  {project.title}
                </motion.h1>

                {/* Intro content — fades out on scroll */}
                <motion.div
                  style={{ opacity: introOpacity }}
                  className="mt-6 lg:hidden-when-faded"
                >
                  <motion.p
                    variants={fadeInUp}
                    className="text-fg-secondary text-base leading-[1.25] mb-6"
                  >
                    {project.description}
                  </motion.p>

                  {/* Tags / metadata row */}
                  <motion.div
                    variants={fadeInUp}
                    className="flex flex-wrap items-center gap-x-2 gap-y-1"
                  >
                    {meta.map((item, i) => (
                      <span key={i} className="flex items-center gap-2">
                        {i > 0 && (
                          <span className="text-fg-tertiary">/</span>
                        )}
                        <span className="font-accent text-sm uppercase tracking-wider text-fg-tertiary">
                          {item}
                        </span>
                      </span>
                    ))}
                  </motion.div>
                </motion.div>

                {/* CTA button — always visible */}
                {project.buttonText && project.buttonHref && (
                  <motion.div variants={fadeInUp} className="mt-6">
                    <a
                      href={project.buttonHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-[--radius-cta] bg-bg-brand-solid text-white font-medium transition-colors duration-200 hover:bg-transparent hover:text-fg-brand border border-transparent hover:border-border-brand"
                    >
                      {project.buttonText}
                    </a>
                  </motion.div>
                )}
              </motion.div>

              {/* Scroll-driven section area — sections fade in/out in place */}
              <div className="relative flex-1 mt-10 hidden lg:block">
                {project.sections.map((section, index) => {
                  const segStart = segmentSize * (index + 1);
                  const segEnd = segmentSize * (index + 2);
                  const fadeInRange: [number, number] = [
                    segStart - segmentSize * 0.15,
                    segStart + segmentSize * 0.15,
                  ];
                  const fadeOutRange: [number, number] =
                    index < sectionCount - 1
                      ? [segEnd - segmentSize * 0.3, segEnd]
                      : [1, 1]; // last section stays visible

                  return (
                    <ScrollSection
                      key={section.heading}
                      section={section}
                      sectionNumber={index + 1}
                      scrollYProgress={scrollYProgress}
                      rangeIn={fadeInRange}
                      rangeOut={fadeOutRange}
                    />
                  );
                })}
              </div>

              {/* Mobile fallback — sections render normally */}
              <div className="mt-12 space-y-16 lg:hidden">
                {project.sections.map((section, index) => (
                  <div key={section.heading}>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-accent text-sm uppercase tracking-wider text-fg-tertiary">
                        / {section.heading}
                      </span>
                      <span className="font-accent text-sm uppercase tracking-wider text-fg-tertiary">
                        ({String(index + 1).padStart(2, "0")})
                      </span>
                    </div>
                    <h2 className="text-display text-2xl md:text-[32px] leading-[1.2] tracking-tight mb-6">
                      {section.headline}
                    </h2>
                    <p className="text-fg-secondary text-base leading-[1.25]">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------
              RIGHT COLUMN — scrolling image gallery + results
              ------------------------------------------------------------ */}
          <div className="lg:w-[56%] lg:shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col gap-10"
            >
              <ProjectImageGallery images={allImages} />

              {/* Results card — last item in the gallery column */}
              {project.results && project.results.length > 0 && (
                <ProjectResults results={project.results} />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          LATEST PROJECTS — full width below
          ============================================================== */}
      <section className="border-t border-border-secondary mt-16 lg:mt-24 py-16 md:py-24">
        <div className="container-main">
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <h2 className="text-display text-2xl md:text-3xl">
              Latest Projects
            </h2>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-fg-secondary hover:text-fg-primary transition-colors"
            >
              View All Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {latestProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
