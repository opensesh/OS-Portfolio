"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Figma, Youtube } from "@untitledui-pro/icons/line";
import { Logo } from "./logo";
import { footerNavItems, socialLinks } from "@/data/navigation";
import { TriplingText } from "@/components/shared/tripling-text";
import { SectionLabel } from "@/components/shared/section-label";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { InputBase } from "@/components/uui/base/input/input";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { useInView } from "@/hooks/use-in-view";
import { devProps } from "@/utils/dev-props";

// Simple SVG icons for social platforms
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function FigmaIcon({ className }: { className?: string }) {
  return <Figma className={className} />;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return <Youtube className={className} />;
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  figma: FigmaIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const { ref: orangeRef, isInView: orangeInView } = useInView({ threshold: 0.2, triggerOnce: true });

  // Parallax scroll for giant brand text (Zone C)
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const brandTextY = useTransform(scrollYProgress, [0, 0.8], ["40%", "0%"]);
  const brandTextOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <footer {...devProps('Footer')} ref={footerRef}>
      {/* ================================================================
          Zone A — Dark Brand Statement + Navigation
          ================================================================ */}
      <div className="bg-bg-inverse text-fg-inverse">
        <div className="container-main py-16 md:py-24 lg:py-32">
          {/* Brand Statement */}
          <div className="mb-16 md:mb-20">
            <ScrollReveal delay={0} duration={0.5} direction="up">
              <Logo logoType="combo" className="mb-8" />
            </ScrollReveal>
            <TextBlockReveal
              as="h2"
              className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-3xl"
              trigger="scroll"
              delay={0.1}
              stagger={0.2}
            >
              {"We help the world make\nthe most of design\nand technology."}
            </TextBlockReveal>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Links */}
            <ScrollReveal delay={0.1} duration={0.6} direction="up">
              <SectionLabel className="mb-5" animate={false} variant="brand">
                Company
              </SectionLabel>
              <ul className="space-y-3">
                {footerNavItems.company.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm inline-block text-fg-inverse/70 hover:text-fg-inverse transition-colors duration-200">
                      <TriplingText>{item.label}</TriplingText>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            {/* Resources Links */}
            <ScrollReveal delay={0.2} duration={0.6} direction="up">
              <SectionLabel className="mb-5" animate={false} variant="brand">
                Resources
              </SectionLabel>
              <ul className="space-y-3">
                {footerNavItems.resources.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm inline-block text-fg-inverse/70 hover:text-fg-inverse transition-colors duration-200">
                      <TriplingText>{item.label}</TriplingText>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            {/* Social Links */}
            <ScrollReveal delay={0.3} duration={0.6} direction="up">
              <SectionLabel className="mb-5" animate={false} variant="brand">
                Social
              </SectionLabel>
              <ul className="space-y-3">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm inline-block text-fg-inverse/70 hover:text-fg-inverse transition-colors duration-200"
                    >
                      <TriplingText>{link.label}</TriplingText>
                    </a>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            {/* CTA */}
            <ScrollReveal delay={0.4} duration={0.6} direction="up">
              <SectionLabel className="mb-5" animate={false} variant="brand">
                Get in touch
              </SectionLabel>
              <p className="text-sm text-fg-inverse/60 mb-6">
                Have a project in mind? Let&apos;s build something together.
              </p>
              <Link
                href="/contact"
                className={cn(
                  "inline-flex items-center justify-center",
                  "h-11 px-6 text-sm font-medium",
                  "bg-bg-brand-solid text-white",
                  "hover:opacity-90 transition-opacity duration-200"
                )}
              >
                Start a conversation
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* ================================================================
          Zone B — Aperol Orange Block
          ================================================================ */}
      <div className="bg-bg-brand-solid" ref={orangeRef}>
        <motion.div
          className="container-main py-10 md:py-14"
          variants={staggerContainer}
          initial="hidden"
          animate={orangeInView ? "visible" : "hidden"}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Newsletter */}
            <motion.div variants={fadeInUp} className="max-w-md">
              <p className="text-sm font-medium text-fg-on-brand mb-1">
                Stay in the loop
              </p>
              <p className="text-xs text-fg-on-brand/70 mb-4">
                Get updates on design, AI, and creative tools.
              </p>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <InputBase
                  type="email"
                  placeholder="your@email.com"
                  size="sm"
                  wrapperClassName="flex-1"
                />
                <button
                  type="submit"
                  className={cn(
                    "h-10 px-5 text-sm font-medium whitespace-nowrap",
                    "bg-bg-inverse text-fg-inverse",
                    "hover:opacity-90 transition-opacity duration-200"
                  )}
                >
                  Subscribe
                </button>
              </form>
            </motion.div>

            {/* Social Icons */}
            <motion.div variants={fadeInUp} className="flex items-center gap-4">
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.icon];
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center justify-center",
                      "w-10 h-10 rounded-full",
                      "bg-bg-inverse/10 hover:bg-bg-inverse/20",
                      "text-fg-on-brand hover:text-white",
                      "transition-all duration-200"
                    )}
                    aria-label={link.label}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                  </a>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ================================================================
          Zone C — Giant Brand Text + Copyright
          ================================================================ */}
      <div className="bg-bg-inverse overflow-hidden relative">
        {/* Giant parallax brand text */}
        <div className="pt-12 md:pt-16 pb-20 md:pb-24">
          <motion.div
            style={{ y: brandTextY, opacity: brandTextOpacity }}
            className="container-main"
          >
            <p className="font-display font-bold tracking-tighter leading-none select-none text-center text-fg-inverse/10">
              {/* Mobile: stacked */}
              <span className="block md:hidden text-7xl">
                OPEN
                <br />
                SESSION
              </span>
              {/* Tablet+ : single line */}
              <span className="hidden md:block text-9xl lg:text-[10rem] xl:text-[12rem] whitespace-nowrap">
                OPEN SESSION
              </span>
            </p>
          </motion.div>
        </div>

        {/* Copyright bar */}
        <div className="absolute bottom-0 inset-x-0 py-5">
          <div className="container-main flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-fg-inverse/40">
              &copy; {currentYear} Open Session. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {footerNavItems.legal.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs text-fg-inverse/40 hover:text-fg-inverse/70 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
