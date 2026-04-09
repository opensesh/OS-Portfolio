"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@untitledui-pro/icons/line";
import { Project, ProjectImage, ProjectSection } from "@/types/project";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { devProps } from "@/utils/dev-props";
import { ProjectResults } from "./project-results";
import { ProjectCard } from "./project-card";

interface ProjectDetailProps {
  project: Project;
  latestProjects: Project[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toSectionKey(heading: string): string {
  const lower = heading.toLowerCase();
  if (lower.includes("challenge")) return "challenge";
  if (lower.includes("solution")) return "solution";
  if (lower.includes("impact")) return "impact";
  return lower.replace(/[^a-z0-9]/g, "-");
}

// ---------------------------------------------------------------------------
// Image pair — renders 2 images side-by-side
// ---------------------------------------------------------------------------

function ImagePair({ images }: { images: ProjectImage[] }) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative aspect-[16/9] bg-bg-tertiary overflow-hidden rounded-lg">
        <Image
          src={images[0].src}
          alt={images[0].alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {images.slice(0, 2).map((img) => (
        <div
          key={img.src}
          className="relative aspect-[4/3] bg-bg-tertiary overflow-hidden rounded-lg"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 400px"
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full-width image
// ---------------------------------------------------------------------------

function FullImage({ image }: { image: ProjectImage }) {
  return (
    <div className="relative aspect-[16/9] bg-bg-tertiary overflow-hidden rounded-lg">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(max-width: 1280px) 100vw, 800px"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section text block (used in mobile interleaved layout)
// ---------------------------------------------------------------------------

function SectionText({
  section,
  sectionNumber,
}: {
  section: ProjectSection;
  sectionNumber: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="font-accent text-sm uppercase tracking-wider text-fg-tertiary">
          / {section.heading}
        </span>
        <span className="font-accent text-sm uppercase tracking-wider text-fg-tertiary">
          ({String(sectionNumber).padStart(2, "0")})
        </span>
      </div>
      <h2 className="text-display text-2xl md:text-[32px] leading-[1.2] tracking-tight mb-6">
        {section.headline}
      </h2>
      <p className="text-fg-secondary text-base leading-relaxed">
        {section.body}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scroll-driven section — fades in and out in-place on the sticky left pane
// ---------------------------------------------------------------------------

function ScrollSection({
  section,
  sectionNumber,
  scrollYProgress,
  rangeIn,
  rangeOut,
}: {
  section: ProjectSection;
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
    [24, 0, 0, -16]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-0 top-0"
    >
      <div className="flex items-center justify-between mb-6">
        <span className="font-accent text-sm uppercase tracking-wider text-fg-tertiary">
          / {section.heading}
        </span>
        <span className="font-accent text-sm uppercase tracking-wider text-fg-tertiary">
          ({String(sectionNumber).padStart(2, "0")})
        </span>
      </div>
      <h2 className="text-display text-2xl md:text-[32px] leading-[1.2] tracking-tight mb-6">
        {section.headline}
      </h2>
      <p className="text-fg-secondary text-base leading-relaxed">
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const sectionCount = project.sections.length;
  const totalSegments = sectionCount + 1; // intro + N sections
  const segmentSize = 1 / totalSegments;

  // Intro collapses: maxHeight shrinks to 0, opacity fades
  const introOpacity = useTransform(
    scrollYProgress,
    [0, segmentSize * 0.5, segmentSize * 0.85],
    [1, 1, 0]
  );
  const introMaxHeight = useTransform(
    scrollYProgress,
    [0, segmentSize * 0.5, segmentSize],
    [500, 500, 0]
  );
  const introMarginBottom = useTransform(
    scrollYProgress,
    [0, segmentSize * 0.5, segmentSize],
    [24, 24, 0]
  );

  // ---------- Image grouping ----------

  const allImages = project.images.filter(
    (img) =>
      img.context === "hero" ||
      img.context === "gallery" ||
      img.context === "mockup"
  );

  const heroImages = allImages.filter((img) => img.context === "hero");

  // Get images for each section (first 2 for pairs)
  const sectionImageGroups = project.sections.map((section) => {
    const key = toSectionKey(section.heading);
    return allImages.filter((img) => img.section === key);
  });

  // Remaining images not used in hero or section groups
  const usedSrcs = new Set([
    ...heroImages.map((i) => i.src),
    ...sectionImageGroups.flat().map((i) => i.src),
  ]);
  const extraImages = allImages.filter((img) => !usedSrcs.has(img.src));

  // ---------- Metadata ----------

  const meta = [
    project.services.length > 0 ? project.services.join(", ") : null,
    project.client,
    project.duration,
    project.year,
  ].filter(Boolean);

  return (
    <article {...devProps("ProjectDetail")}>
      {/* ==============================================================
          DESKTOP: Two-column layout — sticky left pane, scrolling right
          ============================================================== */}
      <div ref={containerRef} className="hidden lg:block">
        <div className="container-wide">
          <div className="flex gap-10 pt-12">
            {/* LEFT COLUMN — sticky, viewport-height */}
            <div className="w-[38%] shrink-0 sticky top-20 h-[calc(100vh-5rem)] self-start">
              <div className="flex flex-col h-full">
                {/* Header: breadcrumb + title */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="shrink-0"
                >
                  <motion.div variants={fadeInUp} className="mb-6">
                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-2 text-fg-secondary hover:text-fg-primary transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      All Projects
                    </Link>
                  </motion.div>

                  <motion.h1
                    variants={fadeInUp}
                    className="text-display text-[60px] leading-[1.1] tracking-tight"
                  >
                    {project.title}
                  </motion.h1>
                </motion.div>

                {/* Collapsing intro — description + tags fade & shrink */}
                <motion.div
                  style={{
                    opacity: introOpacity,
                    maxHeight: introMaxHeight,
                    marginBottom: introMarginBottom,
                  }}
                  className="overflow-hidden mt-6 shrink-0"
                >
                  <p className="text-fg-secondary text-base leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
                  </div>
                </motion.div>

                {/* CTA button — always visible, slides up as intro collapses */}
                {project.buttonText && project.buttonHref && (
                  <div className="shrink-0 mt-2">
                    <a
                      href={project.buttonHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-[--radius-cta] bg-bg-brand-solid text-white font-medium transition-colors duration-200 hover:bg-transparent hover:text-fg-brand border border-transparent hover:border-border-brand"
                    >
                      {project.buttonText}
                    </a>
                  </div>
                )}

                {/* Scroll-driven sections — fade in/out in place */}
                <div className="relative flex-1 mt-10">
                  {project.sections.map((section, index) => {
                    const segStart = segmentSize * (index + 1);
                    const segEnd = segmentSize * (index + 2);
                    const fadeIn: [number, number] = [
                      segStart - segmentSize * 0.15,
                      segStart + segmentSize * 0.15,
                    ];
                    const fadeOut: [number, number] =
                      index < sectionCount - 1
                        ? [segEnd - segmentSize * 0.25, segEnd]
                        : [1, 1]; // last stays

                    return (
                      <ScrollSection
                        key={section.heading}
                        section={section}
                        sectionNumber={index + 1}
                        scrollYProgress={scrollYProgress}
                        rangeIn={fadeIn}
                        rangeOut={fadeOut}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — scrolling images + results */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col gap-10"
              >
                {/* Hero */}
                {heroImages.map((img) => (
                  <FullImage key={img.src} image={img} />
                ))}

                {/* Section image groups — each group corresponds to a section */}
                {sectionImageGroups.map((imgs, groupIdx) => {
                  // Render as: full-width first image, then pair of remaining
                  const items: React.ReactNode[] = [];

                  if (imgs.length >= 1) {
                    items.push(
                      <FullImage key={imgs[0].src} image={imgs[0]} />
                    );
                  }
                  if (imgs.length >= 3) {
                    items.push(
                      <ImagePair
                        key={`pair-${groupIdx}`}
                        images={imgs.slice(1, 3)}
                      />
                    );
                  } else if (imgs.length === 2) {
                    items.push(
                      <FullImage key={imgs[1].src} image={imgs[1]} />
                    );
                  }
                  // Any remaining images in this group
                  if (imgs.length > 3) {
                    for (let j = 3; j < imgs.length; j++) {
                      items.push(
                        <FullImage key={imgs[j].src} image={imgs[j]} />
                      );
                    }
                  }

                  return items;
                })}

                {/* Extra images */}
                {extraImages.map((img) => (
                  <FullImage key={img.src} image={img} />
                ))}

                {/* Results card */}
                {project.results && project.results.length > 0 && (
                  <ProjectResults results={project.results} />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          MOBILE: Interleaved images + text
          ============================================================== */}
      <div className="lg:hidden">
        <div className="container-main pt-8 md:pt-12">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-fg-secondary hover:text-fg-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All Projects
              </Link>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-display text-4xl md:text-5xl tracking-tight mb-6"
            >
              {project.title}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-fg-secondary text-base leading-relaxed mb-4"
            >
              {project.description}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6"
            >
              {meta.map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-fg-tertiary">/</span>}
                  <span className="font-accent text-sm uppercase tracking-wider text-fg-tertiary">
                    {item}
                  </span>
                </span>
              ))}
            </motion.div>

            {project.buttonText && project.buttonHref && (
              <motion.div variants={fadeInUp} className="mb-10">
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

          {/* Hero image */}
          {heroImages.map((img) => (
            <div
              key={img.src}
              className="relative aspect-[16/9] bg-bg-tertiary overflow-hidden rounded-lg mb-10"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          ))}

          {/* Interleaved: image pair → section text */}
          <div className="space-y-10">
            {project.sections.map((section, index) => {
              const imgs = sectionImageGroups[index] || [];
              return (
                <div key={section.heading} className="space-y-10">
                  {imgs.length > 0 && (
                    <ImagePair images={imgs.slice(0, 2)} />
                  )}
                  <SectionText section={section} sectionNumber={index + 1} />
                </div>
              );
            })}

            {/* Extra images */}
            {extraImages.length > 0 && (
              <div className="space-y-4">
                {extraImages.map((img) => (
                  <div
                    key={img.src}
                    className="relative aspect-[16/9] bg-bg-tertiary overflow-hidden rounded-lg"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {project.results && project.results.length > 0 && (
              <ProjectResults results={project.results} />
            )}
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
