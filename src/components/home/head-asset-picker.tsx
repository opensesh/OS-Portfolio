"use client";

import { motion } from "framer-motion";
import { HEAD_ASSETS } from "@/lib/head-assets";
import { XClose } from "@untitledui-pro/icons/line";

const OFFBIT = "'OffBit', 'SF Mono', monospace";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

interface HeadAssetPickerProps {
  activeAsset: string | null;
  onAssetChange: (assetId: string | null) => void;
  isLoading?: boolean;
}

export function HeadAssetPicker({
  activeAsset,
  onAssetChange,
  isLoading = false,
}: HeadAssetPickerProps) {
  return (
    <div className="border-t border-fg-primary/8 px-4 pt-4 pb-3">
      {/* Section header */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className="text-[10px] font-bold uppercase text-fg-primary/40"
          style={{ letterSpacing: "0.15em", fontFamily: OFFBIT }}
        >
          Head Swap
        </span>
        {isLoading && (
          <span
            className="text-[9px] uppercase tracking-wider text-[#fe5102]/70"
            style={{ fontFamily: OFFBIT }}
          >
            Loading...
          </span>
        )}
      </div>

      {/* Asset thumbnails */}
      <motion.div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* "None" option */}
        <motion.button
          variants={itemVariants}
          className={`relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 lg:h-12 lg:w-12 ${
            activeAsset === null
              ? "border-[#fe5102] bg-fg-primary/8"
              : "border-fg-primary/10 bg-fg-primary/[0.03] hover:border-fg-primary/20"
          }`}
          onClick={() => onAssetChange(null)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Disable head swap"
        >
          <XClose
            className={`h-3.5 w-3.5 lg:h-4 lg:w-4 ${
              activeAsset === null ? "text-[#fe5102]" : "text-fg-primary/30"
            }`}
          />
        </motion.button>

        {HEAD_ASSETS.map((asset) => {
          const isActive = activeAsset === asset.id;
          return (
            <motion.button
              key={asset.id}
              variants={itemVariants}
              className={`relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-200 lg:h-12 lg:w-12 ${
                isActive
                  ? "border-[#fe5102] bg-fg-primary/8"
                  : "border-fg-primary/10 bg-fg-primary/[0.03] hover:border-fg-primary/20"
              }`}
              onClick={() => onAssetChange(asset.id)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`${asset.label} head swap`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.src}
                alt={asset.label}
                className="h-7 w-7 object-contain lg:h-8 lg:w-8"
                draggable={false}
              />
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
