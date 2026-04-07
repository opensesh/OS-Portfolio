"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "@untitledui-pro/icons/line";
import { FreeResource } from "@/types/free-resources";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

interface FreeResourceCardProps {
  resource: FreeResource;
}

export function FreeResourceCard({ resource }: FreeResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      {...devProps("FreeResourceCard")}
      href={resource.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-tertiary mb-4">
        {/* Primary media */}
        {resource.media.type === "video" ? (
          <video
            src={resource.media.src}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src={resource.media.src}
            alt={resource.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* Hover crossfade image */}
        {resource.hoverImage && (
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <Image
                  src={resource.hoverImage}
                  alt={`${resource.title} preview`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1",
              "font-accent text-xs uppercase tracking-wider",
              resource.badge === "live"
                ? "bg-bg-brand-solid text-white"
                : "bg-bg-secondary text-fg-secondary"
            )}
          >
            {resource.badge === "live" && (
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
            {resource.badge === "live" ? "Live" : "Coming Soon"}
          </span>
        </div>

        {/* Arrow indicator */}
        <div
          className={cn(
            "absolute bottom-3 right-3 z-10",
            "flex items-center justify-center w-9 h-9",
            "bg-bg-primary text-fg-primary",
            "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
            "transition-all duration-300"
          )}
        >
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-fg-primary font-semibold text-lg group-hover:text-fg-brand transition-colors duration-200">
            {resource.title}
          </h3>
          <span className="flex-shrink-0 font-accent text-xs uppercase tracking-wider text-fg-tertiary mt-1">
            {resource.buttonLabel}
          </span>
        </div>
        <p className="text-fg-secondary text-sm leading-relaxed">
          {resource.description}
        </p>
      </div>
    </Link>
  );
}
