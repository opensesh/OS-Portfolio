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

  // Scroll-driven: only the background container changes.
  // Content never moves, shrinks, or rescales.
  const bgOpacity = scrollProgress;
  // Horizontal margin on the bg container (0 -> 12px) creates "pinch" look
  const bgMargin = scrollProgress * 12;
  // Only bottom corners round (top stays flush with browser edge)
  const bgBottomRadius = scrollProgress * 6;

  return (
    <>
      <motion.header
        {...devProps("Header")}

        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="relative">
          {/*
            Background container:
            - Flush against top of viewport (borderRadius top = 0)
            - Slight horizontal margins on scroll create pinch look
            - Bottom corners round to 6px
            - bg-secondary fills in on scroll
          */}
          <div
            className="absolute inset-0 bg-bg-secondary transition-all duration-300 ease-out"
            style={{
              opacity: bgOpacity,
              marginLeft: `${bgMargin}px`,
              marginRight: `${bgMargin}px`,
              borderBottomLeftRadius: `${bgBottomRadius}px`,
              borderBottomRightRadius: `${bgBottomRadius}px`,
            }}
          />

          {/* Nav content — uses container-wide to match hero/impact sections */}
          <nav className="container-wide relative flex items-center justify-between h-20">
            {/* Logo */}
            <Logo />

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

        {/* Menu panel — expands down from header as unified container */}
        <AnimatePresence>
          {isMenuOpen && (
            <OverlayMenu onClose={() => setIsMenuOpen(false)} />
          )}
        </AnimatePresence>
      </motion.header>

      {/* Blurred backdrop when menu is open */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-bg-inverse/40 backdrop-blur-md"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}
