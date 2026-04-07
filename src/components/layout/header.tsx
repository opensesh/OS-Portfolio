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

  const bgOpacity = isMenuOpen ? 1 : scrollProgress;
  // On scroll (or menu open): 12px horizontal inset on the bg shape
  const bgInset = isMenuOpen ? 12 : scrollProgress * 12;
  const bottomRadius = isMenuOpen ? 6 : scrollProgress * 6;
  // Content pinch: extra padding pushes logo/buttons inward
  const contentPinch = isMenuOpen ? 16 : scrollProgress * 16;

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
            Background shape:
            - Centered, max-width matches container-main (1280px)
            - Pinches inward by bgInset on scroll
            - Flush with top, bottom corners round
          */}
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-full bg-bg-secondary transition-all duration-300 ease-out"
            style={{
              maxWidth: `calc(1280px - ${bgInset * 2}px)`,
              opacity: bgOpacity,
              borderBottomLeftRadius: `${bottomRadius}px`,
              borderBottomRightRadius: `${bottomRadius}px`,
            }}
          />

          {/*
            Content wrapper: container-wide to exactly match section widths.
            Extra padding via contentPinch shifts content inward on scroll.
          */}
          <div className="relative">
            {/* Nav bar */}
            <nav
              className="container-wide flex items-center justify-between h-20 transition-[padding] duration-300 ease-out"
              style={{
                paddingLeft: `calc(max(1.5rem, 5%) + ${contentPinch}px)`,
                paddingRight: `calc(max(1.5rem, 5%) + ${contentPinch}px)`,
              }}
            >
              <Logo />

              <div className="flex items-center gap-2 md:gap-3">
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

                <ActionButton
                  href="/contact"
                  variant="brand"
                  className="hidden sm:inline-flex"
                >
                  Let&apos;s Connect
                </ActionButton>
              </div>
            </nav>

            {/* Menu content — expands inside same bg shape */}
            <AnimatePresence>
              {isMenuOpen && (
                <OverlayMenu onClose={() => setIsMenuOpen(false)} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Blurred backdrop */}
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
