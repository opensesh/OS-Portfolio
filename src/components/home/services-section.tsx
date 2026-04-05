"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "@untitledui-pro/icons/line";
import { useInView } from "@/hooks/use-in-view";
import { services } from "@/data/services";
import { staggerContainer, fadeInUp, accordionContent } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/uui/base/badges/badges";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { devProps } from "@/utils/dev-props";

export function ServicesSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 });
  const [expandedId, setExpandedId] = useState<string | null>(services[0].id);

  const toggleService = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section ref={ref} className="py-20 md:py-32" {...devProps('ServicesSection')}>
      <div className="container-main">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-label mb-4"
          >
            Services
          </motion.p>
          <TextBlockReveal
            as="h2"
            trigger="scroll"
            className="text-display text-3xl md:text-4xl lg:text-5xl max-w-2xl"
          >
            What we do
          </TextBlockReveal>
        </div>

        {/* Services Accordion */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-4"
        >
          {services.map((service) => {
            const isExpanded = expandedId === service.id;

            return (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                className={cn(
                  "border border-border-secondary",
                  "transition-colors duration-200",
                  isExpanded && "border-border-primary bg-bg-secondary"
                )}
              >
                {/* Header */}
                <button
                  onClick={() => toggleService(service.id)}
                  className={cn(
                    "w-full flex items-center justify-between",
                    "px-6 py-5 md:px-8 md:py-6",
                    "text-left"
                  )}
                  aria-expanded={isExpanded}
                >
                  <h3 className="text-heading text-xl md:text-2xl">
                    {service.title}
                  </h3>
                  <div
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
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      variants={accordionContent}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 md:px-8 md:pb-8">
                        <p className="text-fg-secondary mb-6 max-w-2xl">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {service.items.map((item) => (
                            <Badge key={item} type="color" color="gray" size="md">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
