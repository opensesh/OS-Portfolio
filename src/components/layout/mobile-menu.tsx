"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { XClose } from "@untitledui-pro/icons/line";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/button";
import { ThemeToggle } from "./theme-toggle";
import { mainNavItems, socialLinks } from "@/data/navigation";
import {
  menuOverlay,
  menuContent,
  menuItem,
  menuItemsContainer,
} from "@/lib/motion";

interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap
  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      // Simple focus trap
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        variants={menuOverlay}
        initial="closed"
        animate="open"
        exit="closed"
        className="fixed inset-0 z-50 bg-bg-inverse/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <motion.div
        ref={menuRef}
        variants={menuContent}
        initial="closed"
        animate="open"
        exit="closed"
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm",
          "bg-bg-primary",
          "flex flex-col",
          "lg:hidden"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border-secondary">
          <span className="text-lg font-display font-semibold text-fg-primary">
            Menu
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className={cn(
                "flex items-center justify-center",
                "w-10 h-10 rounded-full",
                "text-fg-primary hover:bg-bg-secondary",
                "transition-colors duration-200"
              )}
              aria-label="Close menu"
            >
              <XClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <motion.nav
          variants={menuItemsContainer}
          initial="closed"
          animate="open"
          exit="closed"
          className="flex-1 px-6 py-8 overflow-y-auto"
        >
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <motion.li key={item.href} variants={menuItem}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "block py-3 text-2xl font-display font-medium",
                    "transition-colors duration-200",
                    pathname === item.href
                      ? "text-fg-brand"
                      : "text-fg-primary hover:text-fg-brand"
                  )}
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-border-secondary space-y-6">
          <Button href="/contact" onClick={onClose} className="w-full">
            Get in Touch
          </Button>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            {socialLinks.slice(0, 4).map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-fg-secondary hover:text-fg-brand",
                  "transition-colors duration-200"
                )}
                aria-label={link.label}
              >
                <span className="text-sm">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
