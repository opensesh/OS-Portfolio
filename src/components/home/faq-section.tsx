"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { faqItems } from "@/data/faq";
import { FAQAccordion } from "@/components/shared/faq-accordion";

export function FAQSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-bg-secondary">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <p className="section-label mb-4">FAQ</p>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl mb-6">
              Common Questions
            </h2>
            <p className="text-fg-secondary text-lg max-w-md">
              Have a different question? Reach out to us at{" "}
              <a
                href="mailto:hello@opensession.co"
                className="text-fg-brand hover:underline"
              >
                hello@opensession.co
              </a>
            </p>
          </motion.div>

          {/* Right Column - Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FAQAccordion items={faqItems} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
