"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ActionButton } from "@/components/shared/action-button";
import { ArrowUpRight, Mail01 } from "@untitledui-pro/icons/line";
import { SectionLabel } from "@/components/shared/section-label";
import { ScrambleText } from "@/components/shared/scramble-text";
import { devProps } from "@/utils/dev-props";

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-20 md:py-32" {...devProps('CTASection')}>
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-bg-inverse text-fg-inverse rounded-2xl overflow-hidden"
        >
          {/* Background gradient accents */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -right-1/4 w-1/2 h-full bg-gradient-radial from-brand-500/20 to-transparent blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 w-1/2 h-full bg-gradient-radial from-brand-500/10 to-transparent blur-3xl" />
          </div>

          {/* Content Grid */}
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-10 md:p-16 lg:p-20">
            {/* Left side - Main content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <SectionLabel className="mb-4 text-brand-400" variant="brand">
                  Start a Project
                </SectionLabel>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-display text-3xl md:text-4xl lg:text-5xl mb-6"
              >
                Let&apos;s build something
                <br />
                <span className="text-brand-400">remarkable</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-white/70 mb-8 max-w-lg"
              >
                Whether you need a complete brand overhaul or a focused design sprint,
                we&apos;re ready to collaborate.
              </motion.p>

              {/* Email link with scramble */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mb-8"
              >
                <a
                  href="mailto:hello@opensession.co"
                  className="inline-flex items-center gap-3 text-2xl md:text-3xl font-display font-bold group"
                >
                  <Mail01 className="w-6 h-6 text-brand-400" />
                  <ScrambleText className="group-hover:text-brand-400 transition-colors duration-200">
                    hello@opensession.co
                  </ScrambleText>
                  <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                </a>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <ActionButton href="/contact" size="lg" variant="light">
                  Get in Touch
                </ActionButton>
                <ActionButton href="/workshop" size="lg" variant="light">
                  Book a Workshop
                </ActionButton>
              </motion.div>
            </div>

            {/* Right side - Decorative element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full aspect-square max-w-md">
                {/* Abstract decorative circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-white/10" />
                </div>
                <div className="absolute inset-8 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-white/10" />
                </div>
                <div className="absolute inset-16 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-brand-500/30 bg-brand-500/5" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-display font-bold text-brand-400/20">
                    OS
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
