"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ChevronDown } from "@untitledui/icons";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/shared/section-label";
import { socialIcons } from "@/components/shared/social-icons";
import {
  overlayNavItems,
  contactEmails,
  statusLines,
  socialLinks,
} from "@/data/navigation";
import type { NavItem } from "@/data/navigation";
import {
  overlayFullscreen,
  overlayColumn,
  overlayNavItem,
  accordionContent,
  springTransition,
} from "@/lib/motion";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { devProps } from "@/utils/dev-props";

interface OverlayMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OverlayMenu({ isOpen, onClose }: OverlayMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Focus trap & escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

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
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blurred backdrop — covers entire viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-bg-inverse/40 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Content panel — positioned below header, container-width */}
          <motion.div
            {...devProps("OverlayMenu")}
            ref={menuRef}
            variants={overlayFullscreen}
            initial="closed"
            animate="open"
            exit="closed"
            className={cn(
              "fixed left-0 right-0 z-40",
              "top-[88px] md:top-[92px]",
              "max-h-[calc(100vh-96px)] overflow-y-auto"
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="mx-auto max-w-[1280px] px-4 md:px-6 pb-4">
              <div
                className={cn(
                  "bg-bg-secondary rounded-xl",
                  "border border-border-secondary",
                  "px-8 py-10 md:px-10 md:py-12 lg:px-14 lg:py-14"
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
                  {/* Column 1: Navigation */}
                  <NavColumn onClose={onClose} />

                  {/* Column 2: Contact & Status */}
                  <ContactColumn />

                  {/* Column 3: Featured (desktop only) */}
                  <FeaturedColumn onClose={onClose} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// Nav Column
// =============================================================================

function NavColumn({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const isDesktop = useBreakpoint("lg");

  const activeIndex = overlayNavItems.findIndex(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  const indicatorIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  return (
    <motion.nav variants={overlayColumn} className="flex flex-col">
      <LayoutGroup>
        <ul
          className="space-y-1 md:space-y-2"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {overlayNavItems.map((item, index) => (
            <motion.li key={item.href} variants={overlayNavItem}>
              <div
                className="flex items-center gap-3 md:gap-4"
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  if (isDesktop && item.children) {
                    setExpandedItem(item.label);
                  }
                }}
                onMouseLeave={() => {
                  if (isDesktop && item.children && expandedItem === item.label) {
                    setExpandedItem(null);
                  }
                }}
              >
                {/* Orange square indicator */}
                <div className="w-3 h-3 md:w-4 md:h-4 shrink-0">
                  {indicatorIndex === index && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="w-full h-full bg-bg-brand-solid"
                      transition={springTransition}
                    />
                  )}
                </div>

                {/* Nav link + chevron */}
                <div className="flex items-center gap-3">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "font-display font-bold leading-none",
                      "text-3xl md:text-4xl lg:text-5xl",
                      "transition-colors duration-200",
                      indicatorIndex === index
                        ? "text-fg-brand"
                        : "text-fg-primary"
                    )}
                  >
                    {item.label}
                  </Link>

                  {item.children && (
                    <button
                      onClick={() =>
                        setExpandedItem(
                          expandedItem === item.label ? null : item.label
                        )
                      }
                      className={cn(
                        "p-1 rounded transition-all duration-200",
                        "text-fg-secondary hover:text-fg-primary",
                        expandedItem === item.label && "rotate-180"
                      )}
                      aria-expanded={expandedItem === item.label}
                      aria-label={`Toggle ${item.label} submenu`}
                    >
                      <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-items accordion */}
              {item.children && (
                <AnimatePresence>
                  {expandedItem === item.label && (
                    <SubNav
                      items={item.children}
                      onClose={onClose}
                      pathname={pathname}
                    />
                  )}
                </AnimatePresence>
              )}
            </motion.li>
          ))}
        </ul>
      </LayoutGroup>
    </motion.nav>
  );
}

// =============================================================================
// SubNav (The Lab dropdown children)
// =============================================================================

function SubNav({
  items,
  onClose,
  pathname,
}: {
  items: NavItem[];
  onClose: () => void;
  pathname: string;
}) {
  return (
    <motion.ul
      variants={accordionContent}
      initial="collapsed"
      animate="expanded"
      exit="collapsed"
      className="ml-7 md:ml-8 mt-2 space-y-1 overflow-hidden"
    >
      {items.map((child) => (
        <li key={child.href}>
          <Link
            href={child.href}
            onClick={onClose}
            className={cn(
              "block py-1.5 text-lg md:text-xl font-display font-medium",
              "transition-colors duration-200",
              pathname === child.href
                ? "text-fg-brand"
                : "text-fg-secondary hover:text-fg-brand"
            )}
          >
            {child.label}
          </Link>
        </li>
      ))}
    </motion.ul>
  );
}

// =============================================================================
// Contact Column
// =============================================================================

function ContactColumn() {
  return (
    <motion.div variants={overlayColumn} className="space-y-8 md:space-y-10">
      {/* Emails */}
      <div>
        <SectionLabel animate={false} className="mb-4">
          Say Hello
        </SectionLabel>
        <ul className="space-y-2">
          {contactEmails.map((contact) => (
            <li key={contact.email}>
              <a
                href={`mailto:${contact.email}`}
                className={cn(
                  "text-sm md:text-base text-fg-secondary",
                  "hover:text-fg-brand transition-colors duration-200"
                )}
              >
                <span className="text-fg-primary font-medium">
                  {contact.name}:
                </span>{" "}
                {contact.email}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Social Links */}
      <div>
        <SectionLabel animate={false} className="mb-4">
          Connect
        </SectionLabel>
        <div className="flex items-center gap-3">
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
      </div>

      {/* Status */}
      <div>
        <ul className="space-y-2">
          {statusLines.map((line) => (
            <li key={line} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-bg-brand-solid shrink-0" />
              <span className="text-accent text-xs text-fg-secondary">
                {line}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// =============================================================================
// Featured Column (desktop only)
// =============================================================================

function FeaturedColumn({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      variants={overlayColumn}
      className="hidden lg:flex flex-col gap-6"
    >
      {/* About the Studio */}
      <Link
        href="/about"
        onClick={onClose}
        className="group relative block overflow-hidden rounded-lg aspect-[4/3]"
      >
        <Image
          src="/images/team/karim.webp"
          alt="About the Studio"
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute bottom-4 left-4 text-accent text-xs text-white">
          About the Studio
        </span>
      </Link>

      {/* Featured Project */}
      <Link
        href="/projects"
        onClick={onClose}
        className="group relative block overflow-hidden rounded-lg aspect-[4/3]"
      >
        <Image
          src="/images/team/morgan.webp"
          alt="Featured Project"
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute bottom-4 left-4 text-accent text-xs text-white">
          Featured Project
        </span>
      </Link>
    </motion.div>
  );
}
