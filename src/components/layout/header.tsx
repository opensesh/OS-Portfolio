"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";
import { Button } from "@/components/shared/button";
import { mainNavItems } from "@/data/navigation";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  // Track scroll position
  const { scrollY } = useScroll();

  // Update scroll progress (0 to 1)
  useMotionValueEvent(scrollY, "change", (latest) => {
    const progress = Math.min(latest / 100, 1);
    setScrollProgress(progress);
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Interpolate values based on scroll progress
  const bgOpacity = scrollProgress * 0.95;
  const blurAmount = scrollProgress * 20;
  const borderOpacity = scrollProgress;
  const logoScale = 1 - scrollProgress * 0.1; // 1 -> 0.9
  const navHeight = 80 - scrollProgress * 16; // 80px -> 64px

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Background with progressive opacity */}
        <div
          className="absolute inset-0 bg-bg-primary transition-opacity duration-100"
          style={{ opacity: bgOpacity }}
        />

        {/* Progressive backdrop blur */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
          }}
        />

        {/* Bottom border with animated opacity */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-border-secondary transition-opacity duration-100"
          style={{ opacity: borderOpacity }}
        />

        <div className="container-main relative">
          <nav
            className="flex items-center justify-between transition-all duration-100"
            style={{ height: `${navHeight}px` }}
          >
            {/* Logo with scale transform */}
            <div
              className="transition-transform duration-100 origin-left"
              style={{ transform: `scale(${logoScale})` }}
            >
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg",
                    "transition-colors duration-200",
                    pathname === item.href
                      ? "text-fg-brand"
                      : "text-fg-secondary hover:text-fg-primary hover:bg-bg-secondary"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle className="hidden sm:flex" />

              {/* CTA Button - Desktop */}
              <Button href="/contact" className="hidden lg:inline-flex">
                Get in Touch
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  "lg:hidden flex items-center justify-center",
                  "w-10 h-10 rounded-full",
                  "text-fg-primary hover:bg-bg-secondary",
                  "transition-colors duration-200"
                )}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
