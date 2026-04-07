"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { footerNavItems, socialLinks } from "@/data/navigation";
import { socialIcons } from "@/components/shared/social-icons";
import { TriplingText } from "@/components/shared/tripling-text";
import { SectionLabel } from "@/components/shared/section-label";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { useInView } from "@/hooks/use-in-view";
import { devProps } from "@/utils/dev-props";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { ref: orangeRef, isInView: orangeInView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <footer {...devProps('Footer')} className="dark">
      {/* ================================================================
          Zone A — Navigation + Social + Newsletter
          ================================================================ */}
      <div className="bg-bg-primary text-fg-primary">
        <div className="container-main py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
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

            {/* The Lab Links */}
            <ScrollReveal delay={0.15} duration={0.6} direction="up">
              <SectionLabel className="mb-4" animate={false} variant="brand">
                The Lab
              </SectionLabel>
              <ul className="space-y-2.5">
                {footerNavItems.theLab.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm inline-block text-fg-secondary hover:text-fg-primary transition-colors duration-200">
                      <TriplingText>{item.label}</TriplingText>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            {/* Social Links as grid */}
            <ScrollReveal delay={0.2} duration={0.6} direction="up">
              <SectionLabel className="mb-4" animate={false} variant="brand">
                Social
              </SectionLabel>
              <div className="grid grid-cols-3 gap-2.5">
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
                        "bg-bg-tertiary hover:bg-bg-brand-solid",
                        "text-fg-secondary hover:text-white",
                        "transition-all duration-200"
                      )}
                      aria-label={link.label}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                    </a>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* Newsletter */}
            <ScrollReveal delay={0.25} duration={0.6} direction="up" className="col-span-2 md:col-span-1">
              <SectionLabel className="mb-4" animate={false} variant="brand">
                Stay in the loop
              </SectionLabel>
              <p className="text-xs text-fg-secondary mb-3">
                Get updates on design, AI, and creative tools.
              </p>
              <form
                className="flex items-end gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className={cn(
                    "flex-1 bg-transparent border-0 border-b border-border-secondary",
                    "py-2 text-sm text-fg-primary placeholder:text-fg-tertiary",
                    "focus:outline-none focus:border-b-2 focus:border-fg-brand",
                    "transition-colors duration-200"
                  )}
                />
                <button
                  type="submit"
                  className={cn(
                    "pb-2 text-sm font-medium whitespace-nowrap",
                    "text-fg-brand hover:text-fg-primary",
                    "transition-colors duration-200"
                  )}
                >
                  Subscribe
                </button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* ================================================================
          Zone B — Aperol Orange Bar (copyright + legal)
          ================================================================ */}
      <div className="bg-bg-brand-solid" ref={orangeRef}>
        <motion.div
          className="container-main py-5"
          variants={staggerContainer}
          initial="hidden"
          animate={orangeInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
          >
            <p className="text-xs text-fg-on-brand/70">
              &copy; {currentYear} Open Session. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {footerNavItems.legal.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs text-fg-on-brand/70 hover:text-fg-on-brand transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
