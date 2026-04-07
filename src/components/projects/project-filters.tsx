"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CATEGORY_SLUGS, categoryLabel } from "@/data/categories";
import { devProps } from "@/utils/dev-props";

interface ProjectFiltersProps {
  activeFilter: string | "All";
  onFilterChange: (filter: string | "All") => void;
}

const ALL_FILTERS: (string | "All")[] = ["All", ...CATEGORY_SLUGS];

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 4L6 8L10 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function ProjectFilters({
  activeFilter,
  onFilterChange,
}: ProjectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
          setFocusedIndex(ALL_FILTERS.indexOf(activeFilter));
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < ALL_FILTERS.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : ALL_FILTERS.length - 1
          );
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0) {
            onFilterChange(ALL_FILTERS[focusedIndex]);
            setIsOpen(false);
          }
          break;
      }
    },
    [isOpen, focusedIndex, activeFilter, onFilterChange]
  );

  // Scroll focused option into view
  useEffect(() => {
    if (!isOpen || focusedIndex < 0 || !listRef.current) return;
    const option = listRef.current.children[focusedIndex] as HTMLElement;
    option?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex, isOpen]);

  const handleSelect = (filter: string | "All") => {
    onFilterChange(filter);
    setIsOpen(false);
  };

  return (
    <div
      {...devProps("ProjectFilters")}
      ref={containerRef}
      className="relative"
      onKeyDown={handleKeyDown}
    >
      {/* Trigger button */}
      <button
        type="button"
        className={cn(
          "group inline-flex items-center gap-1.5",
          "cursor-pointer outline-none",
          "focus-visible:ring-2 focus-visible:ring-fg-brand/50"
        )}
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) setFocusedIndex(ALL_FILTERS.indexOf(activeFilter));
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span
          className={cn(
            "flex items-center justify-center",
            "h-10 px-4 lg:h-12 lg:px-5",
            "bg-bg-secondary text-fg-primary",
            "transition-colors duration-300"
          )}
        >
          <span className="font-accent text-xs uppercase tracking-wider">
            {activeFilter === "All" ? "FILTER" : categoryLabel(activeFilter).toUpperCase()}
          </span>
        </span>
        <span
          className={cn(
            "flex items-center justify-center",
            "w-10 h-10 lg:w-12 lg:h-12",
            "bg-bg-secondary text-fg-primary",
            "transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        >
          <ChevronDownIcon className="w-3 h-3" />
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            className={cn(
              "absolute top-full left-0 z-50 mt-2",
              "min-w-[200px] bg-bg-secondary py-2",
              "shadow-lg"
            )}
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {ALL_FILTERS.map((filter, index) => {
              const isActive = filter === activeFilter;
              const isFocused = index === focusedIndex;
              return (
                <div
                  key={filter}
                  role="option"
                  aria-selected={isActive}
                  tabIndex={0}
                  onClick={() => handleSelect(filter)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2",
                    "cursor-pointer transition-colors",
                    "text-fg-primary",
                    isFocused && "bg-bg-tertiary",
                    isActive && "text-fg-brand"
                  )}
                >
                  {isActive && (
                    <span className="w-2 h-2 bg-bg-brand-solid flex-shrink-0" />
                  )}
                  <span className="font-accent text-xs uppercase tracking-wider">
                    [{filter === "All" ? "ALL" : categoryLabel(filter).toUpperCase()}]
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
