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
  const bgOpacity = scrollProgress * 1; // 0 -> 1
  const logoScale = 1 - scrollProgress * 0.1;
  const navHeight = 80 - scrollProgress * 16; // 80px -> 64px
  // Pinch: extra inline padding as container forms (0 -> 16px)
  const pinchPadding = scrollProgress * 16;
  // Container shape: rounded-[6px] matching ActionButton
  const borderRadius = scrollProgress * 6;
  // Top offset to float the container down slightly
  const topOffset = scrollProgress * 6;

  return (
    <>
      <motion.header
        {...devProps("Header")}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ paddingTop: `${topOffset}px` }}
      >
        {/*
          Container: always container-main width (1280px centered).
          On scroll, bg-bg-secondary fills in and corners round.
        */}
        <div
          className="relative mx-auto w-full transition-all duration-200 ease-out"
          style={{
            maxWidth: "1280px",
            borderRadius: `${borderRadius}px`,
            paddingLeft: `${pinchPadding}px`,
            paddingRight: `${pinchPadding}px`,
          }}
        >
          {/* Background fill — bg-secondary, fades in on scroll */}
          <div
            className="absolute inset-0 bg-bg-secondary transition-opacity duration-200"
            style={{
              opacity: bgOpacity,
              borderRadius: `${borderRadius}px`,
            }}
          />

          {/* Subtle bottom border on scroll */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px bg-border-secondary"
            style={{
              opacity: scrollProgress,
              marginLeft: `${borderRadius}px`,
              marginRight: `${borderRadius}px`,
            }}
          />

          <nav
            className="relative flex items-center justify-between px-6 md:px-8 lg:px-16 transition-all duration-200"
            style={{ height: `${navHeight}px` }}
          >
            {/* Logo */}
            <div
              className="transition-transform duration-200 origin-left"
              style={{ transform: `scale(${logoScale})` }}
            >
              <Logo />
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* MENU / CLOSE trigger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-[6px]",
                  "text-fg-primary hover:bg-bg-tertiary",
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
