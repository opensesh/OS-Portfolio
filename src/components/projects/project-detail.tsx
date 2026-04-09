"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@untitledui-pro/icons/line";
import { Project, ProjectImage } from "@/types/project";
import { Button } from "@/components/shared/button";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { devProps } from "@/utils/dev-props";
import { ProjectSectionBlock } from "./project-section";
import { ProjectTestimonialBlock } from "./project-testimonial";
import { ProjectResults } from "./project-results";
import { ProjectCard } from "./project-card";

interface ProjectDetailProps {
  project: Project;
  latestProjects: Project[];
}

// ---------------------------------------------------------------------------
// Right-column image gallery – renders all images in a mixed layout
// ---------------------------------------------------------------------------

function ProjectImageGallery({ images }: { images: ProjectImage[] }) {
  if (images.length === 0) return null;

  // Build a layout sequence: full, full, pair, full, full+pair, ...
  const items: React.ReactNode[] = [];
  let i = 0;

  while (i < images.length) {
    const remaining = images.length - i;

    // Every 3rd slot, try to render a pair (2-up) if we have ≥ 2
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
      // Full-width image
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
// Main component
// ---------------------------------------------------------------------------

export function ProjectDetail({
  project,
  latestProjects,
}: ProjectDetailProps) {
  const introRef = useRef<HTMLDivElement>(null);

  // Track when the intro section scrolls out of view
  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ["start start", "end start"],
  });

  // Fade out intro (description + tags) as user scrolls
  const introOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // All images for the right-column gallery
  const allImages = project.images.filter(
    (img) =>
      img.context === "hero" ||
      img.context === "gallery" ||
      img.context === "mockup"
  );

  // Metadata row items
  const meta = [
    project.services.length > 0 ? project.services.join(", ") : null,
    project.client,
    project.duration,
    project.year,
  ].filter(Boolean);

  const sectionKey = (heading: string): string => {
    const lower = heading.toLowerCase();
    if (lower.includes("challenge")) return "challenge";
    if (lower.includes("solution")) return "solution";
    if (lower.includes("impact")) return "impact";
    return lower.replace(/[^a-z0-9]/g, "-");
  };

  return (
    <article {...devProps("ProjectDetail")}>
      {/* ============================================================
          TWO-COLUMN LAYOUT (desktop) / SINGLE COLUMN (mobile)
          ============================================================ */}
      <div className="px-6 md:px-10 lg:px-20 pt-8 md:pt-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* --------------------------------------------------------
              LEFT COLUMN – text content
              -------------------------------------------------------- */}
          <div className="flex-1 lg:min-w-0">
            {/* Sticky header: breadcrumb + title + button */}
            <div className="lg:sticky lg:top-24 z-10">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
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

                {/* Intro content that fades on scroll (description + tags) */}
                <motion.div
                  ref={introRef}
                  style={{ opacity: introOpacity }}
                  className="mt-6"
                >
                  <motion.p
                    variants={fadeInUp}
                    className="text-fg-secondary text-base leading-[1.25] max-w-lg mb-6"
                  >
                    {project.description}
                  </motion.p>

                  {/* Tags / metadata row */}
                  <motion.div
                    variants={fadeInUp}
                    className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6"
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

                {/* CTA button – always visible */}
                {project.buttonText && project.buttonHref && (
                  <motion.div variants={fadeInUp} className="mt-4">
                    <Button href={project.buttonHref} variant="primary" external>
                      {project.buttonText}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Narrative sections – scroll naturally below sticky header */}
            <div className="mt-24 lg:mt-32 space-y-16 lg:space-y-24">
              {project.sections.map((section, index) => (
                <ProjectSectionBlock
                  key={section.heading}
                  section={section}
                  sectionNumber={index + 1}
                  images={[]}
                />
              ))}

              {/* Testimonials */}
              {project.testimonials && project.testimonials.length > 0 && (
                <ProjectTestimonialBlock testimonials={project.testimonials} />
              )}

              {/* Results */}
              {project.results && project.results.length > 0 && (
                <ProjectResults results={project.results} />
              )}
            </div>
          </div>

          {/* --------------------------------------------------------
              RIGHT COLUMN – image gallery (desktop only inline,
              mobile shows below text)
              -------------------------------------------------------- */}
          <div className="lg:w-[56%] lg:shrink-0 flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col gap-10"
            >
              <ProjectImageGallery images={allImages} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ============================================================
          LATEST PROJECTS – full width below
          ============================================================ */}
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
