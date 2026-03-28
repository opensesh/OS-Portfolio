"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { Button } from "@/components/shared/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.3 });

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-bg-inverse text-fg-inverse p-10 md:p-16 lg:p-20"
        >
          {/* Background Pattern (optional) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-white to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-display text-3xl md:text-4xl lg:text-5xl mb-6"
            >
              Ready to start your next project?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-white/70 mb-8 max-w-xl"
            >
              Let&apos;s create something meaningful together. We&apos;d love to
              hear about your project and explore how we can help.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                href="/contact"
                className="bg-white text-bg-inverse hover:bg-white/90"
                size="lg"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                href="/workshop"
                variant="ghost"
                size="lg"
                className="text-white border-white/30 hover:bg-white/10"
              >
                Book a Workshop
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
