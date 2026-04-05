"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ChevronDown } from "@untitledui-pro/icons/line";
import { useInView } from "@/hooks/use-in-view";
import { whatWeDoItems } from "@/data/what-we-do";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
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
  const chevronRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const titleRefs = useRef<Map<string, HTMLElement>>(new Map());
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const prevExpandedId = useRef<string | null>(null);

  const setContentRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) contentRefs.current.set(id, el);
      else contentRefs.current.delete(id);
    },
    []
  );

  const setChevronRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) chevronRefs.current.set(id, el);
      else chevronRefs.current.delete(id);
    },
    []
  );

  const setTitleRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) titleRefs.current.set(id, el);
      else titleRefs.current.delete(id);
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

  const animateAccordion = useCallback(
    (newId: string | null) => {
      const oldId = prevExpandedId.current;

      // Collapse previous
      if (oldId && oldId !== newId) {
        const contentEl = contentRefs.current.get(oldId);
        const chevronEl = chevronRefs.current.get(oldId);
        const titleEl = titleRefs.current.get(oldId);

        if (contentEl) {
          gsap.to(contentEl, {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
            overflow: "hidden",
          });
        }
        if (chevronEl) {
          gsap.to(chevronEl, {
            rotation: 0,
            duration: 0.3,
            ease: "power2.inOut",
          });
        }
        if (titleEl) {
          gsap.to(titleEl, {
            color: "var(--fg-secondary)",
            duration: 0.3,
          });
        }
      }

      // Expand new
      if (newId) {
        const contentEl = contentRefs.current.get(newId);
        const chevronEl = chevronRefs.current.get(newId);
        const titleEl = titleRefs.current.get(newId);
        const descEl = contentEl?.querySelector("[data-desc]") as HTMLElement;

        if (contentEl) {
          gsap.to(contentEl, {
            height: "auto",
            opacity: 1,
            duration: 0.5,
            ease: "power3.inOut",
          });
        }
        if (descEl) {
          gsap.fromTo(
            descEl,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.4, delay: 0.15, ease: "power2.out" }
          );
        }
        if (chevronEl) {
          gsap.to(chevronEl, {
            rotation: 180,
            duration: 0.4,
            ease: "back.out(1.4)",
          });
        }
        if (titleEl) {
          gsap.to(titleEl, {
            color: "var(--fg-primary)",
            duration: 0.3,
          });
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
              onComplete: () => { gsap.set(img, { display: "none", scale: 1 }); },
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
    },
    []
  );

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
            Our Creative Pillars
          </TextBlockReveal>
        </div>

        {/* Two-panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Accordion */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {whatWeDoItems.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  className="border-b border-border-secondary"
                >
                  {/* Trigger */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between",
                      "py-5 md:py-6",
                      "text-left group cursor-pointer"
                    )}
                    aria-expanded={isExpanded}
                  >
                    <h3
                      ref={setTitleRef(item.id)}
                      className={cn(
                        "text-heading text-lg md:text-xl",
                        "transition-colors duration-200",
                        isExpanded ? "text-fg-primary" : "text-fg-secondary"
                      )}
                    >
                      {item.title}
                    </h3>
                    <div
                      ref={setChevronRef(item.id)}
                      className={cn(
                        "flex-shrink-0 w-8 h-8 flex items-center justify-center",
                        "border border-border-primary rounded-full",
                        "transition-colors duration-200",
                        isExpanded && "bg-bg-brand-solid border-transparent"
                      )}
                    >
                      <ChevronDown
                        className={cn(
                          "w-4 h-4",
                          isExpanded ? "text-white" : "text-fg-primary"
                        )}
                      />
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
                    <div data-desc className="pb-5 md:pb-6 pr-12">
                      <p className="text-fg-secondary text-sm md:text-base leading-relaxed">
                        {item.description}
                      </p>

                      {/* Mobile-only image */}
                      <div className="mt-4 lg:hidden rounded-xl overflow-hidden">
                        <PixelTransition
                          firstContent={
                            <div
                              className={cn(
                                "w-full h-full",
                                item.imageBg
                              )}
                            />
                          }
                          secondContent={
                            <div className="w-full h-full bg-bg-brand-solid" />
                          }
                          gridSize={10}
                          pixelColor="#FE5102"
                          animationStepDuration={0.7}
                          aspectRatio="75%"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right: Desktop image panel */}
          <div
            ref={imageWrapperRef}
            className="hidden lg:block sticky top-24 self-start"
          >
            <div className="rounded-xl overflow-hidden bg-bg-secondary">
              {whatWeDoItems.map((item, index) => (
                <div
                  key={item.id}
                  data-image-id={item.id}
                  style={{
                    display: index === 0 ? "block" : "none",
                    position: index === 0 ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
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
                    animationStepDuration={0.7}
                    aspectRatio="75%"
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
