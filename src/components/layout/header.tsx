"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu01, XClose } from "@untitledui-pro/icons/line";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { OverlayMenu } from "./overlay-menu";
import { ActionButton } from "@/components/shared/action-button";
import { menuTriggerText } from "@/lib/motion";
import { devProps } from "@/utils/dev-props";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const progress = Math.min(latest / 100, 1);
    setScrollProgress(progress);
  });

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Scroll-driven interpolations
  const bgOpacity = scrollProgress * 0.95;
  const blurAmount = scrollProgress * 20;
  const borderRadius = scrollProgress * 12;
  const logoScale = 1 - scrollProgress * 0.1;
  const navHeight = 80 - scrollProgress * 16; // 80px -> 64px
  // Pinch: at scroll=0, full viewport width (padding only).
  // At scroll=1, constrained to container-main width with visible bg.
  const topPadding = scrollProgress * 8; // 0 -> 8px top gap

  return (
    <>
      <motion.header
        {...devProps("Header")}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ paddingTop: `${topPadding}px` }}
      >
        {/*
          Pinch container:
          - At scroll=0: full width, no max-width, edge-to-edge
          - At scroll=1: max-width 1280px, centered, with bg/blur/radius
        */}
        <div
          className="relative mx-auto transition-all duration-300 ease-out"
          style={{
            maxWidth: scrollProgress > 0
              ? `${1280 + (1 - scrollProgress) * 2000}px`
              : "none",
            borderRadius: `${borderRadius}px`,
          }}
        >
          {/* Background fill — fades in on scroll */}
          <div
            className="absolute inset-0 bg-bg-primary"
            style={{
              opacity: bgOpacity,
              borderRadius: `${borderRadius}px`,
            }}
          />

          {/* Backdrop blur */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backdropFilter: `blur(${blurAmount}px)`,
              WebkitBackdropFilter: `blur(${blurAmount}px)`,
              borderRadius: `${borderRadius}px`,
            }}
          />

          {/* Bottom border — fades in on scroll */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px bg-border-secondary"
            style={{ opacity: scrollProgress }}
          />

          <nav
            className="relative flex items-center justify-between px-6 md:px-8 lg:px-10 transition-all duration-100"
            style={{ height: `${navHeight}px` }}
          >
            {/* Logo */}
            <div
              className="transition-transform duration-100 origin-left"
              style={{ transform: `scale(${logoScale})` }}
            >
              <Logo />
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle className="hidden sm:flex" />

              {/* MENU / CLOSE trigger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg",
                  "text-fg-primary hover:bg-bg-secondary",
                  "transition-colors duration-200"
                )}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                <span className="text-accent text-xs">
                  <AnimatePresence mode="wait" initial={false}>
                    {isMenuOpen ? (
                      <motion.span
                        key="close"
                        variants={menuTriggerText}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="flex items-center gap-2"
                      >
                        CLOSE
                        <XClose className="w-4 h-4" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="menu"
                        variants={menuTriggerText}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="flex items-center gap-2"
                      >
                        MENU
                        <Menu01 className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>

              {/* CTA Button */}
              <ActionButton
                href="/contact"
                variant="brand"
                className="hidden sm:inline-flex"
              >
                Let&apos;s Connect
              </ActionButton>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Overlay menu — blurred backdrop + content panel below header */}
      <OverlayMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
