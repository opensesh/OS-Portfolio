"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { footerNavItems, socialLinks } from "@/data/navigation";
import { socialIcons } from "@/components/shared/social-icons";
import { TriplingText } from "@/components/shared/tripling-text";
import { SectionLabel } from "@/components/shared/section-label";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { InputBase } from "@/components/uui/base/input/input";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { useInView } from "@/hooks/use-in-view";
import { devProps } from "@/utils/dev-props";

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
    // Force dark theme on footer regardless of site theme
    <footer {...devProps('Footer')} ref={footerRef} className="dark">
      {/* ================================================================
          Zone A — Brand Statement + Navigation
          ================================================================ */}
      <div className="bg-bg-primary text-fg-primary">
        <div className="container-main py-12 md:py-16 lg:py-20">
          {/* Top: Logo + Headline side by side on desktop */}
          <div className="mb-10 md:mb-12">
            <ScrollReveal delay={0} duration={0.5} direction="up">
              <Logo logoType="combo" className="mb-6" />
            </ScrollReveal>
            <TextBlockReveal
              as="h2"
              className="font-display text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight"
              trigger="scroll"
              delay={0.1}
              stagger={0.15}
            >
              {"We help the world make the most\nof design and technology."}
            </TextBlockReveal>
          </div>

          {/* Navigation Grid: 2 link columns + CTA */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16">
            {/* Company Links */}
            <ScrollReveal delay={0.1} duration={0.6} direction="up">
              <SectionLabel className="mb-4" animate={false} variant="brand">
                Company
              </SectionLabel>
              <ul className="space-y-2.5">
                {footerNavItems.company.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm inline-block text-fg-secondary hover:text-fg-primary transition-colors duration-200">
                      <TriplingText>{item.label}</TriplingText>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            {/* Resources Links */}
            <ScrollReveal delay={0.2} duration={0.6} direction="up">
              <SectionLabel className="mb-4" animate={false} variant="brand">
                Resources
              </SectionLabel>
              <ul className="space-y-2.5">
                {footerNavItems.resources.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm inline-block text-fg-secondary hover:text-fg-primary transition-colors duration-200">
                      <TriplingText>{item.label}</TriplingText>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            {/* CTA */}
            <ScrollReveal delay={0.3} duration={0.6} direction="up" className="col-span-2 md:col-span-1">
              <SectionLabel className="mb-4" animate={false} variant="brand">
                Get in touch
              </SectionLabel>
              <p className="text-sm text-fg-secondary mb-5">
                Have a project in mind? Let&apos;s build something together.
              </p>
              <Link
                href="/contact"
                className={cn(
                  "inline-flex items-center justify-center",
                  "h-10 px-6 text-sm font-medium",
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
          Zone B — Aperol Orange Block (newsletter + socials + legal)
          ================================================================ */}
      <div className="bg-bg-brand-solid" ref={orangeRef}>
        <motion.div
          className="container-main py-8 md:py-10"
          variants={staggerContainer}
          initial="hidden"
          animate={orangeInView ? "visible" : "hidden"}
        >
          {/* Top row: newsletter + social icons */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            {/* Newsletter */}
            <motion.div variants={fadeInUp} className="max-w-sm">
              <p className="text-sm font-medium text-fg-on-brand mb-1">
                Stay in the loop
              </p>
              <p className="text-xs text-fg-on-brand/70 mb-3">
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
                    "bg-bg-primary text-fg-primary",
                    "hover:opacity-90 transition-opacity duration-200"
                  )}
                >
                  Subscribe
                </button>
              </form>
            </motion.div>

            {/* Social Icons */}
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
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
                      "w-9 h-9 rounded-full",
                      "bg-bg-primary/10 hover:bg-bg-primary/20",
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

          {/* Bottom row: copyright + legal (inside orange block) */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-6 border-t border-fg-on-brand/15"
          >
            <p className="text-xs text-fg-on-brand/60">
              &copy; {currentYear} Open Session. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {footerNavItems.legal.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs text-fg-on-brand/60 hover:text-fg-on-brand transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ================================================================
          Zone C — Giant Brand Text (parallax)
          ================================================================ */}
      <div className="bg-bg-primary overflow-hidden">
        <motion.div
          style={{ y: brandTextY, opacity: brandTextOpacity }}
          className="container-main py-8 md:py-10"
        >
          <p className="font-display font-bold tracking-tighter leading-none select-none text-center text-fg-primary/[0.06]">
            {/* Mobile: stacked */}
            <span className="block md:hidden text-7xl">
              OPEN
              <br />
              SESSION
            </span>
            {/* Tablet+: single line */}
            <span className="hidden md:block text-8xl lg:text-[10rem] xl:text-[12rem] whitespace-nowrap">
              OPEN SESSION
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
