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
