"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@untitledui-pro/icons/line";
import { Project } from "@/types/project";
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

export function ProjectDetail({
  project,
  latestProjects,
}: ProjectDetailProps) {
  const heroImage = project.images.find((img) => img.context === "hero");
  const heroSrc = heroImage?.src ?? project.thumbnail;

  // Group images by section
  const sectionImages = (sectionKey: string) =>
    project.images.filter(
      (img) =>
        (img.context === "gallery" || img.context === "mockup") &&
        img.section === sectionKey
    );

  const sectionKey = (heading: string): string => {
    const lower = heading.toLowerCase();
    if (lower.includes("challenge")) return "challenge";
    if (lower.includes("solution")) return "solution";
    if (lower.includes("impact")) return "impact";
    return lower.replace(/[^a-z0-9]/g, "-");
  };

  // Metadata items for the row
  const meta = [
    project.services.length > 0 ? project.services.join(", ") : null,
    project.client,
    project.duration,
    project.year,
  ].filter(Boolean);

  return (
    <article {...devProps("ProjectDetail")}>
      {/* Header */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="pt-8 md:pt-12 pb-12 md:pb-16"
      >
        <div className="container-main">
          {/* Back link */}
          <motion.div variants={fadeInUp} className="mb-8">
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
            className="text-display text-4xl md:text-5xl lg:text-6xl mb-6"
          >
            {project.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-fg-secondary text-lg md:text-xl max-w-3xl mb-8"
          >
            {project.description}
          </motion.p>

          {/* Metadata row: Scope / Client / Duration / Year */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-8"
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

          {/* CTA button */}
          {project.buttonText && project.buttonHref && (
            <motion.div variants={fadeInUp}>
              <Button href={project.buttonHref} variant="primary" external>
                {project.buttonText}
              </Button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Hero Image */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-16 md:mb-24"
      >
        <div className="container-main">
          <div className="relative aspect-[16/9] bg-bg-tertiary overflow-hidden rounded-lg">
            {heroSrc ? (
              <Image
                src={heroSrc}
                alt={heroImage?.alt ?? project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-fg-tertiary">Project Hero Image</span>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Narrative Sections */}
      <section className="pb-16 md:pb-24">
        <div className="container-main space-y-20 md:space-y-28">
          {project.sections.map((section, index) => (
            <ProjectSectionBlock
              key={section.heading}
              section={section}
              sectionNumber={index + 1}
              images={sectionImages(sectionKey(section.heading))}
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
      </section>

      {/* Latest Projects */}
      <section className="border-t border-border-secondary py-16 md:py-24">
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
