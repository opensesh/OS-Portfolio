"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { wordContainer, wordReveal, fadeInUp } from "@/lib/motion";
import { devProps } from "@/utils/dev-props";

const headline = "We're a small team with big ideas and a passion for great design.";
const words = headline.split(" ");

export function AboutHero() {
  return (
    <section {...devProps('AboutHero')} className="py-20 md:py-32">
      <div className="container-main">
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="section-label mb-6"
        >
          About Us
        </motion.p>

        {/* Headline */}
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

        {/* Story */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-16"
        >
          <div>
            <p className="text-lg md:text-xl text-fg-secondary leading-relaxed">
              Open Session was founded on a simple belief: design should be
              thoughtful, purposeful, and human. We started as a small studio
              and grew into a team that works with companies around the world.
            </p>
          </div>
          <div>
            <p className="text-lg md:text-xl text-fg-secondary leading-relaxed">
              Today, we focus on three things: brand systems that scale,
              creative applications of AI, and building community around great
              design. We work with startups and Fortune 500s alike—what matters
              is the work.
            </p>
          </div>
        </motion.div>

        {/* Hero image */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] mt-16 lg:mt-24 overflow-hidden bg-bg-tertiary"
        >
          <Image
            src="/images/about/Sj4TYZrc68BDHPXs5O5D19mVik.jpg"
            alt="Open Session team at work"
            fill
            className="object-cover"
            sizes="100vw"
            quality={85}
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
