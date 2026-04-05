"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Plus, Minus } from "@untitledui-pro/icons/line";
import { useInView } from "@/hooks/use-in-view";
import { whatWeDoItems } from "@/data/what-we-do";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { Badge } from "@/components/uui/base/badges/badges";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

const PixelTransition = dynamic(
  () =>
    import("@/components/shared/pixel-transition").then((mod) => ({
      default: mod.PixelTransition,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="relative">
        <div style={{ paddingTop: "75%" }} />
        <div className="absolute inset-0 bg-bg-tertiary rounded-xl" />
      </div>
    ),
  }
);

export function WhatWeDoSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 });
  const [expandedId, setExpandedId] = useState<string | null>(
    whatWeDoItems[0].id
  );

  // Refs for GSAP animations
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const iconRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const prevExpandedId = useRef<string | null>(null);

  const setContentRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) contentRefs.current.set(id, el);
      else contentRefs.current.delete(id);
    },
    []
  );

  const setIconRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) iconRefs.current.set(id, el);
      else iconRefs.current.delete(id);
    },
    []
  );

  // Initialize: set initial heights
  useEffect(() => {
    whatWeDoItems.forEach((item) => {
      const contentEl = contentRefs.current.get(item.id);
      if (!contentEl) return;
      if (item.id === whatWeDoItems[0].id) {
        gsap.set(contentEl, { height: "auto", opacity: 1 });
      } else {
        gsap.set(contentEl, { height: 0, opacity: 0, overflow: "hidden" });
      }
    });
    prevExpandedId.current = whatWeDoItems[0].id;
  }, []);

  const animateAccordion = useCallback((newId: string | null) => {
    const oldId = prevExpandedId.current;

    // Collapse previous
    if (oldId && oldId !== newId) {
      const contentEl = contentRefs.current.get(oldId);
      if (contentEl) {
        gsap.to(contentEl, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          overflow: "hidden",
        });
      }
    }

    // Expand new
    if (newId) {
      const contentEl = contentRefs.current.get(newId);
      const innerEl = contentEl?.querySelector("[data-desc]") as HTMLElement;

      if (contentEl) {
        gsap.to(contentEl, {
          height: "auto",
          opacity: 1,
          duration: 0.5,
          ease: "power3.inOut",
        });
      }
      if (innerEl) {
        gsap.fromTo(
          innerEl,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            delay: 0.15,
            ease: "power2.out",
          }
        );
      }
    }

    // Desktop image crossfade
    if (newId && newId !== oldId && imageWrapperRef.current) {
      const images =
        imageWrapperRef.current.querySelectorAll("[data-image-id]");
      images.forEach((img) => {
        const imgId = (img as HTMLElement).dataset.imageId;
        if (imgId === oldId) {
          gsap.to(img, {
            opacity: 0,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              gsap.set(img, { display: "none", scale: 1 });
            },
          });
        }
        if (imgId === newId) {
          gsap.set(img, { display: "block", opacity: 0, y: 8 });
          gsap.to(img, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            delay: 0.15,
            ease: "power2.out",
          });
        }
      });
    }

    prevExpandedId.current = newId;
  }, []);

  const toggleItem = useCallback(
    (id: string) => {
      const newId = expandedId === id ? null : id;
      setExpandedId(newId);
      animateAccordion(newId);
    },
    [expandedId, animateAccordion]
  );

  return (
    <section
      ref={ref}
      className="py-20 md:py-32"
      {...devProps("WhatWeDoSection")}
    >
      <div className="container-main">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-label mb-4"
          >
            How We Deliver
          </motion.p>
          <TextBlockReveal
            as="h2"
            trigger="scroll"
            className="text-display text-3xl md:text-4xl lg:text-5xl max-w-2xl"
          >
            Full Stack Creativity
          </TextBlockReveal>
        </div>

        {/* Two-panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Accordion cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-4"
          >
            {whatWeDoItems.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  className={cn(
                    "border border-border-secondary",
                    "transition-colors duration-200",
                    isExpanded && "border-border-primary bg-bg-secondary"
                  )}
                >
                  {/* Header */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between",
                      "px-6 py-5 md:px-8 md:py-6",
                      "text-left cursor-pointer"
                    )}
                    aria-expanded={isExpanded}
                  >
                    <h3 className="text-heading text-xl md:text-2xl">
                      {item.title}
                    </h3>
                    <div
                      ref={setIconRef(item.id)}
                      className={cn(
                        "flex-shrink-0 w-10 h-10 flex items-center justify-center",
                        "border border-border-primary rounded-full",
                        "transition-colors duration-200",
                        isExpanded && "bg-bg-brand-solid border-transparent"
                      )}
                    >
                      {isExpanded ? (
                        <Minus className="w-4 h-4 text-white" />
                      ) : (
                        <Plus className="w-4 h-4 text-fg-primary" />
                      )}
                    </div>
                  </button>

                  {/* Content */}
                  <div
                    ref={setContentRef(item.id)}
                    className="overflow-hidden"
                    style={{
                      height: item.id === whatWeDoItems[0].id ? "auto" : 0,
                      opacity: item.id === whatWeDoItems[0].id ? 1 : 0,
                    }}
                  >
                    <div data-desc className="px-6 pb-6 md:px-8 md:pb-8">
                      <p className="text-fg-secondary mb-6 max-w-2xl">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.items.map((tag) => (
                          <Badge
                            key={tag}
                            type="color"
                            color="gray"
                            size="md"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Mobile-only image */}
                      <div className="mt-6 lg:hidden rounded-xl overflow-hidden">
                        <PixelTransition
                          firstContent={
                            <div
                              className={cn("w-full h-full", item.imageBg)}
                            />
                          }
                          secondContent={
                            <div className={cn("w-full h-full", item.imageHoverBg)} />
                          }
                          gridSize={10}
                          pixelColor="#FE5102"
                          animationStepDuration={0.4}
                          aspectRatio="75%"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right: Desktop image panel — stretches to match left column */}
          <div
            ref={imageWrapperRef}
            className="hidden lg:block"
          >
            <div className="rounded-xl overflow-hidden bg-bg-secondary h-full relative">
              {whatWeDoItems.map((item, index) => (
                <div
                  key={item.id}
                  data-image-id={item.id}
                  className="absolute inset-0"
                  style={{
                    display: index === 0 ? "block" : "none",
                  }}
                >
                  <PixelTransition
                    firstContent={
                      <div
                        className={cn("w-full h-full", item.imageBg)}
                      />
                    }
                    secondContent={
                      <div className="w-full h-full bg-bg-brand-solid" />
                    }
                    gridSize={14}
                    pixelColor="#FE5102"
                    animationStepDuration={0.4}
                    aspectRatio="0"
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
