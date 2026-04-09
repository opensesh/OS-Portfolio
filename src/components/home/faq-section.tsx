"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { faqItems } from "@/data/faq";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { devProps } from "@/utils/dev-props";

export function FAQSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-bg-secondary" {...devProps('FAQSection')}>
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Header */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="section-label mb-4"
            >
              FAQ
            </motion.p>
            <TextBlockReveal
              as="h2"
              trigger="scroll"
              className="text-display text-3xl md:text-4xl lg:text-5xl mb-6"
            >
              Common Questions
            </TextBlockReveal>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-fg-secondary text-lg max-w-md"
            >
              Have a different question? Reach out to us at{" "}
              <a
                href="mailto:hello@opensession.co"
                className="text-bg-brand-solid hover:underline"
              >
                hello@opensession.co
              </a>
            </motion.p>
          </div>

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
