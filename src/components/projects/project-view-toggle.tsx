"use client";

import { cn } from "@/lib/utils";
import { ViewMode } from "@/types/project";
import { devProps } from "@/utils/dev-props";

interface ProjectViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

function SliderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="4" width="6" height="8" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="4" width="6" height="8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TwoColumnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="6" height="14" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="6" y="1" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="1" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="6" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="6" y="6" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="6" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="11" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="6" y="11" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const VIEW_MODES: { mode: ViewMode; label: string; icon: React.ReactNode; hideOnMobile?: boolean }[] = [
  { mode: "carousel", label: "Slider view", icon: <SliderIcon /> },
  { mode: "two-column", label: "Two column view", icon: <TwoColumnIcon />, hideOnMobile: true },
  { mode: "grid", label: "Grid view", icon: <GridIcon /> },
];

export function ProjectViewToggle({ viewMode, onViewModeChange }: ProjectViewToggleProps) {
  return (
    <div
      {...devProps("ProjectViewToggle")}
      className="flex items-center gap-1"
      role="group"
      aria-label="View mode"
    >
      {VIEW_MODES.map(({ mode, label, icon, hideOnMobile }) => (
        <button
          key={mode}
          type="button"
          onClick={() => onViewModeChange(mode)}
          className={cn(
            "flex items-center justify-center w-8 h-8 transition-colors duration-300",
            viewMode === mode
              ? "bg-bg-brand-solid text-white"
              : "bg-bg-secondary text-fg-secondary hover:bg-bg-tertiary",
            hideOnMobile && "hidden md:flex"
          )}
          aria-label={label}
          aria-pressed={viewMode === mode}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
