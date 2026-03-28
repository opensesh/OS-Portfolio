"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/shared/button";
import { wordContainer, wordReveal, fadeInUp } from "@/lib/motion";

const headline = "We're a design company focused on brand systems, creative AI, and community.";
const words = headline.split(" ");

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="container-main py-20 md:py-32">
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="section-label mb-6"
        >
          Design & Technology
        </motion.p>

        {/* Headline with word-by-word animation */}
        <motion.h1
          variants={wordContainer}
          initial="hidden"
          animate="visible"
          className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mb-8"
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              variants={wordReveal}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-fg-secondary max-w-2xl mb-10"
        >
          We help the world make the most of design and technology. From brand
          identity to digital products, we craft experiences that matter.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-4"
        >
          <Button href="/contact" size="lg">
            Start a Project
          </Button>
          <Button href="/projects" variant="secondary" size="lg">
            View Our Work
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-border-primary rounded-full flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-fg-tertiary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
