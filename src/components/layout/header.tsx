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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
  const bottomRadius = isMenuOpen ? 6 : scrollProgress * 6;
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
        {/*
          container-wide: matches section widths exactly.
          The bg fill sits inside this container as an absolutely-
          positioned child, so it inherits the same width.
        */}
        <div className="container-wide relative">
          {/* Background fill — exactly matches container-wide content box */}
          <div
            className="absolute top-0 bottom-0 -left-[5%] -right-[5%] lg:-left-[6%] lg:-right-[6%] bg-bg-secondary transition-all duration-300 ease-out"
            style={{
              opacity: bgOpacity,
              borderBottomLeftRadius: `${bottomRadius}px`,
              borderBottomRightRadius: `${bottomRadius}px`,
            }}
          />

          {/* Nav bar */}
          <nav
            className="relative flex items-center justify-between h-20 transition-[padding] duration-300 ease-out"
            style={{
              paddingLeft: `${contentPinch}px`,
              paddingRight: `${contentPinch}px`,
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

          {/* Menu content — expands inside same container */}
          <AnimatePresence>
            {isMenuOpen && (
              <OverlayMenu onClose={() => setIsMenuOpen(false)} />
            )}
          </AnimatePresence>
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
