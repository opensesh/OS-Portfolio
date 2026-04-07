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

  // Interpolate values based on scroll progress
  const bgOpacity = scrollProgress * 0.95;
  const blurAmount = scrollProgress * 20;
  const borderRadius = scrollProgress * 12;
  const logoScale = 1 - scrollProgress * 0.1;
  const navHeight = 80 - scrollProgress * 16; // 80px -> 64px

  return (
    <>
      <motion.header
        {...devProps("Header")}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 p-2 md:p-3"
      >
        {/* Pinch container — gains bg, blur, and rounding on scroll */}
        <div
          className="relative transition-[border-radius] duration-100"
          style={{
            borderRadius: `${borderRadius}px`,
          }}
        >
          {/* Background fill */}
          <div
            className="absolute inset-0 bg-bg-primary transition-opacity duration-100"
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

          {/* Bottom border */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px bg-border-secondary transition-opacity duration-100"
            style={{
              opacity: scrollProgress,
              borderRadius: `${borderRadius}px`,
            }}
          />

          <nav
            className="relative flex items-center justify-between px-4 md:px-6 lg:px-8 transition-all duration-100"
            style={{ height: `${navHeight}px` }}
          >
            {/* Logo with scale transform */}
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

      {/* Full-screen overlay menu */}
      <OverlayMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
