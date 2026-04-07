"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@untitledui-pro/icons/line";
import { Project } from "@/types/project";
import { Button } from "@/components/shared/button";
import { Badge } from "@/components/uui/base/badges/badges";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { devProps } from "@/utils/dev-props";
import { categoryLabel } from "@/data/categories";
import { ProjectSectionBlock } from "./project-section";
import { ProjectTestimonialBlock } from "./project-testimonial";
import { ProjectResults } from "./project-results";

interface ProjectDetailProps {
  project: Project;
  prevProject: Project | null;
  nextProject: Project | null;
}

export function ProjectDetail({
  project,
  prevProject,
  nextProject,
}: ProjectDetailProps) {
  const heroImage = project.images.find((img) => img.context === "hero");
  const heroSrc = heroImage?.src ?? project.thumbnail;

  // Group gallery images by section
  const sectionImages = (sectionKey: string) =>
    project.images.filter(
      (img) => img.context === "gallery" && img.section === sectionKey
    );

  // Map section heading to section key for image lookup
  const sectionKey = (heading: string): string => {
    const lower = heading.toLowerCase();
    if (lower.includes("challenge")) return "challenge";
    if (lower.includes("solution")) return "solution";
    if (lower.includes("impact")) return "impact";
    return lower.replace(/[^a-z0-9]/g, "-");
  };

  return (
    <article {...devProps("ProjectDetail")}>
      {/* Hero */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="py-20 md:py-32"
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

          {/* Meta */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-2 mb-4"
          >
            <span className="text-sm text-fg-tertiary font-mono uppercase">
              {project.categories.map(categoryLabel).join(" / ")}
            </span>
            <span className="text-fg-tertiary">—</span>
            <span className="text-sm text-fg-tertiary font-mono uppercase">
              {project.industry}
            </span>
            <span className="text-fg-tertiary">—</span>
            <span className="text-sm text-fg-tertiary">{project.year}</span>
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
            className="text-fg-secondary text-lg md:text-xl max-w-2xl mb-8"
          >
            {project.description}
          </motion.p>

          {/* Tags */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} type="color" color="gray" size="md">
                {tag}
              </Badge>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Hero Image */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-20 md:mb-32"
      >
        <div className="container-main">
          <div className="relative aspect-[16/9] bg-bg-tertiary overflow-hidden">
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

      {/* Project Content */}
      <section className="pb-20 md:pb-32">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-fg-primary mb-2 uppercase tracking-wider">
                    Client
                  </h3>
                  <p className="text-fg-secondary">{project.client}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-fg-primary mb-2 uppercase tracking-wider">
                    Year
                  </h3>
                  <p className="text-fg-secondary">{project.year}</p>
                </div>
                {project.duration && (
                  <div>
                    <h3 className="text-sm font-semibold text-fg-primary mb-2 uppercase tracking-wider">
                      Duration
                    </h3>
                    <p className="text-fg-secondary">{project.duration}</p>
                  </div>
                )}
                {project.services.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-fg-primary mb-2 uppercase tracking-wider">
                      Services
                    </h3>
                    <ul className="text-fg-secondary space-y-1">
                      {project.services.map((service) => (
                        <li key={service}>{service}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {project.buttonText && project.buttonHref && (
                  <div>
                    <Button
                      href={project.buttonHref}
                      variant="primary"
                      external
                    >
                      {project.buttonText}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              <p className="text-fg-secondary text-lg leading-relaxed">
                {project.description}
              </p>

              {/* Sections */}
              {project.sections.map((section) => (
                <ProjectSectionBlock
                  key={section.heading}
                  section={section}
                  images={sectionImages(sectionKey(section.heading))}
                />
              ))}

              {/* Testimonials */}
              {project.testimonials && project.testimonials.length > 0 && (
                <ProjectTestimonialBlock testimonials={project.testimonials} />
              )}
            </div>
          </div>

          {/* Results — full-width below the grid */}
          {project.results && project.results.length > 0 && (
            <div className="mt-16 md:mt-24">
              <ProjectResults results={project.results} />
            </div>
          )}
        </div>
      </section>

      {/* Navigation */}
      <section className="border-t border-border-secondary py-12 md:py-16">
        <div className="container-main">
          <div className="flex items-center justify-between">
            {/* Previous */}
            <div>
              {prevProject ? (
                <Link
                  href={`/projects/${prevProject.slug}`}
                  className="group flex items-center gap-3"
                >
                  <ArrowLeft className="w-5 h-5 text-fg-tertiary group-hover:text-fg-primary transition-colors" />
                  <div>
                    <p className="text-sm text-fg-tertiary mb-1">Previous</p>
                    <p className="text-fg-primary group-hover:text-fg-brand transition-colors font-medium">
                      {prevProject.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>

            {/* Next */}
            <div>
              {nextProject ? (
                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="group flex items-center gap-3 text-right"
                >
                  <div>
                    <p className="text-sm text-fg-tertiary mb-1">Next</p>
                    <p className="text-fg-primary group-hover:text-fg-brand transition-colors font-medium">
                      {nextProject.title}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-fg-tertiary group-hover:text-fg-primary transition-colors" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
