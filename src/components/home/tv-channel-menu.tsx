"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Monitor03 } from "@untitledui-pro/icons/line";
import { Expand06 } from "@untitledui-pro/icons/line";
import { Camera01 } from "@untitledui-pro/icons/line";
import { XClose } from "@untitledui-pro/icons/line";
import { usePageLoaded } from "@/hooks/use-page-loaded";
import { devProps } from "@/utils/dev-props";
import { TV_CHANNELS, DEFAULT_CHANNEL, LIVE_CHANNEL_SLUG } from "@/lib/tv-channels";

const OFFBIT = "'OffBit', 'SF Mono', monospace";
const IDLE_CLOSE_DESKTOP_MS = 2500;
const IDLE_CLOSE_MOBILE_MS = 4500;

const menuCardVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.85, y: 10 },
};

const channelListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.08 },
  },
};

const channelItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
};

const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.92, y: 12 },
};

interface TVChannelMenuProps {
  scrollYProgress: MotionValue<number>;
  sectionRef: React.RefObject<HTMLElement | null>;
  onChannelChange?: (channelSlug: string) => void;
  isLive?: boolean;
  onGoLive?: () => void;
  onStopLive?: () => void;
  onSnapshot?: () => void;
  cameraError?: string | null;
}

export function TVChannelMenu({
  scrollYProgress,
  sectionRef,
  onChannelChange,
  isLive = false,
  onGoLive,
  onStopLive,
  onSnapshot,
  cameraError,
}: TVChannelMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(DEFAULT_CHANNEL);
  const [isVisible, setIsVisible] = useState(true);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const pageLoaded = usePageLoaded();
  const menuRef = useRef<HTMLDivElement>(null);

  // Visible while TV is in frame, fades as zoom-into-screen begins (55-65%)
  const menuOpacity = useTransform(scrollYProgress, [0.55, 0.65], [1, 0]);

  // Orange glow intensity: ramps up as TV centers (10-18%), holds during dwell, fades as zoom starts (50-58%)
  const glowOpacity = useTransform(scrollYProgress, [0.10, 0.18, 0.50, 0.58], [0, 1, 1, 0]);
  const [isGlowing, setIsGlowing] = useState(false);

  // Track opacity to disable pointer events when faded out
  useEffect(() => {
    const unsubscribe = menuOpacity.on("change", (v) => {
      setIsVisible(v > 0.1);
    });
    return unsubscribe;
  }, [menuOpacity]);

  // Track glow state for CSS animation toggle
  useEffect(() => {
    const unsubscribe = glowOpacity.on("change", (v) => {
      setIsGlowing(v > 0.1);
    });
    return unsubscribe;
  }, [glowOpacity]);

  // Sync activeChannel when live mode changes
  useEffect(() => {
    if (isLive) {
      setActiveChannel(LIVE_CHANNEL_SLUG);
    }
  }, [isLive]);

  // Auto-close menu after idle — stays open while hovering inside
  useEffect(() => {
    if (!isOpen) return;
    let timer: ReturnType<typeof setTimeout>;

    const container = menuRef.current;
    if (!container) return;

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const idleMs = isTouchDevice ? IDLE_CLOSE_MOBILE_MS : IDLE_CLOSE_DESKTOP_MS;

    const startTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setIsOpen(false), idleMs);
    };
    const clearTimerFn = () => clearTimeout(timer);

    // Only start the idle timer if the mouse isn't already inside
    // (e.g. user just clicked the FAB — mouse is still over the container)
    if (!container.matches(":hover")) {
      startTimer();
    }

    container.addEventListener("mouseenter", clearTimerFn);
    container.addEventListener("mouseleave", startTimer);

    return () => {
      clearTimeout(timer);
      container.removeEventListener("mouseenter", clearTimerFn);
      container.removeEventListener("mouseleave", startTimer);
    };
  }, [isOpen]);

  // Close on click outside or Escape
  useEffect(() => {
    if (!isOpen && !showCameraModal) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showCameraModal) setShowCameraModal(false);
        else setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!isOpen) return;
      const container = menuRef.current;
      if (container && !container.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, showCameraModal]);

  const scrollToFullScreen = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = sectionHeight - viewportHeight;
    const target = sectionTop + scrollableDistance * 0.35;
    window.scrollTo({ top: target, behavior: "smooth" });
    setIsOpen(false);
  }, [sectionRef]);

  const handleChannelSelect = useCallback(
    (slug: string) => {
      // If selecting a normal channel while live, stop live first
      if (isLive && slug !== LIVE_CHANNEL_SLUG) {
        onStopLive?.();
      }
      setActiveChannel(slug);
      onChannelChange?.(slug);
    },
    [onChannelChange, isLive, onStopLive]
  );

  const handleGoLive = useCallback(() => {
    onGoLive?.();
    setShowCameraModal(false);
  }, [onGoLive]);

  return (
    <>
      <motion.div
        ref={menuRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:bottom-10 z-40 flex flex-col items-center max-sm:bottom-6"
        style={{
          opacity: menuOpacity,
          pointerEvents: isVisible ? "auto" : "none",
        }}
        {...devProps("TVChannelMenu")}
      >
        {/* Channel menu card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="mb-3 w-80 origin-bottom overflow-hidden rounded-[6px] border border-fg-primary/10 bg-bg-secondary/95 backdrop-blur-xl max-sm:w-72"
              variants={menuCardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              role="menu"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-5 pb-4">
                <span
                  className="text-base font-bold uppercase text-fg-primary"
                  style={{ letterSpacing: "0.15em", fontFamily: OFFBIT }}
                >
                  TV Menu
                </span>
                <div className="flex items-center gap-2">
                  {/* Live indicator or channel count */}
                  {isLive ? (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-red-500"
                      style={{ fontFamily: OFFBIT }}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                      </span>
                      Live
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center rounded-full border border-[#fe5102]/20 bg-[#fe5102]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#fe5102]"
                      style={{ fontFamily: OFFBIT }}
                    >
                      {TV_CHANNELS.length} total
                    </span>
                  )}
                  {/* Camera / Go Live button */}
                  <button
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-fg-primary/10 bg-fg-primary/5 text-fg-primary/40 transition-all duration-200 hover:border-[#fe5102]/25 hover:bg-[#fe5102]/10 hover:text-[#fe5102]"
                    onClick={() => setShowCameraModal(true)}
                    aria-label="Go live on TV"
                  >
                    <Camera01 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Channel list */}
              <motion.div
                className="max-h-[200px] overflow-y-auto px-2 pt-1 pb-2"
                variants={channelListVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex flex-col gap-1">
                  {/* Live "You" channel — shown when live */}
                  {isLive && (
                    <motion.button
                      variants={channelItemVariants}
                      className="group/row flex w-full cursor-pointer items-center justify-between rounded-[6px] bg-fg-primary/8 px-3 py-3 transition-all duration-200"
                      role="menuitem"
                      onClick={() => handleChannelSelect(LIVE_CHANNEL_SLUG)}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-4 w-0.5 rounded-full bg-red-500" />
                        <span className="text-sm font-semibold text-fg-primary">
                          You
                        </span>
                      </div>
                      <span
                        className="flex items-center gap-1.5 text-xs tracking-widest text-red-500"
                        style={{ fontFamily: OFFBIT }}
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                        </span>
                        LIVE
                      </span>
                    </motion.button>
                  )}

                  {TV_CHANNELS.map((channel) => {
                    const isActive = !isLive && activeChannel === channel.slug;
                    return (
                      <motion.button
                        key={channel.slug}
                        variants={channelItemVariants}
                        className={`group/row flex w-full cursor-pointer items-center justify-between rounded-[6px] px-3 py-3 transition-all duration-200 ${
                          isActive
                            ? "bg-fg-primary/8"
                            : "hover:bg-fg-primary/5"
                        }`}
                        role="menuitem"
                        onClick={() => handleChannelSelect(channel.slug)}
                        whileHover={{ x: isActive ? 0 : 3 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Active indicator bar */}
                          <div
                            className={`h-4 w-0.5 rounded-full transition-colors duration-200 ${
                              isActive ? "bg-[#fe5102]" : "bg-transparent group-hover/row:bg-fg-primary/15"
                            }`}
                          />
                          <span
                            className={`text-sm transition-colors duration-200 ${
                              isActive
                                ? "font-semibold text-fg-primary"
                                : "font-medium text-fg-primary/55 group-hover/row:text-fg-primary/80"
                            }`}
                          >
                            {channel.label}
                          </span>
                        </div>
                        <span
                          className={`text-xs tracking-widest transition-colors duration-200 ${
                            isActive
                              ? "text-[#fe5102]"
                              : "text-fg-primary/30 group-hover/row:text-fg-primary/45"
                          }`}
                          style={{ fontFamily: OFFBIT }}
                        >
                          {channel.number}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Footer */}
              <div className="border-t border-fg-primary/8 px-2 py-2">
                <div className="flex flex-col gap-1">
                  <button
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] px-3 py-3 text-fg-primary/35 transition-all duration-200 hover:bg-fg-primary/5 hover:text-fg-primary/60"
                    onClick={scrollToFullScreen}
                  >
                    <Expand06 className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium tracking-wide">
                      View Full Screen
                    </span>
                  </button>

                  {/* Take a Snapshot — only visible when live */}
                  {isLive && onSnapshot && (
                    <button
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] px-3 py-3 text-fg-primary/35 transition-all duration-200 hover:bg-[#fe5102]/8 hover:text-[#fe5102]"
                      onClick={onSnapshot}
                    >
                      <Camera01 className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium tracking-wide">
                        Take a Snapshot
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB — ghost style with orange glow behind during TV hold phase */}
        <div className="relative">
          {/* Glow aura — pulsing orange behind the button, no fill on the button itself */}
          <motion.div
            className="absolute inset-[-8px] rounded-full pointer-events-none"
            style={{ opacity: glowOpacity }}
            animate={isGlowing ? {
              boxShadow: [
                "0 0 24px 8px rgba(254,81,2,0.35), 0 0 48px 16px rgba(254,81,2,0.15)",
                "0 0 32px 12px rgba(254,81,2,0.5), 0 0 64px 24px rgba(254,81,2,0.2)",
                "0 0 24px 8px rgba(254,81,2,0.35), 0 0 48px 16px rgba(254,81,2,0.15)",
              ],
            } : {
              boxShadow: "0 0 0px 0px rgba(254,81,2,0), 0 0 0px 0px rgba(254,81,2,0)",
            }}
            transition={isGlowing ? {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            } : { duration: 0.3 }}
            aria-hidden
          />
          <motion.button
            className="relative group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-fg-primary/20 text-fg-primary/50 transition-all duration-300 hover:border-fg-primary/40 hover:bg-fg-primary/10 hover:text-fg-primary/80"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={pageLoaded ? { opacity: 1, scale: 1 } : undefined}
            transition={{ delay: 1.8, type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle TV channel menu"
            aria-expanded={isOpen}
          >
            <Monitor03 className="h-4.5 w-4.5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Camera / Go Live modal */}
      <AnimatePresence>
        {showCameraModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowCameraModal(false)}
            />

            {/* Modal content */}
            <motion.div
              className="relative w-full max-w-sm overflow-hidden rounded-[6px] border border-fg-primary/10 bg-bg-secondary p-6"
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-fg-primary/40 transition-colors duration-200 hover:text-fg-primary/80"
                onClick={() => setShowCameraModal(false)}
                aria-label="Close"
              >
                <XClose className="h-4 w-4" />
              </button>

              {/* Icon */}
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#fe5102]/20 bg-[#fe5102]/10">
                <Camera01 className="h-5 w-5 text-[#fe5102]" />
              </div>

              {/* Heading */}
              <h3
                className="mb-2 text-lg font-bold uppercase text-fg-primary"
                style={{ letterSpacing: "0.12em", fontFamily: OFFBIT }}
              >
                Join the Session
              </h3>

              {/* Description */}
              <p className="mb-4 text-sm leading-relaxed text-fg-primary/55">
                Put yourself on the screen. Your camera feed plays live on the
                CRT — just a creative experiment between you and the TV.
              </p>

              {/* Privacy notice */}
              <div className="mb-5 rounded-[6px] border border-fg-primary/8 bg-fg-primary/[0.03] px-4 py-3">
                <p className="text-xs leading-relaxed text-fg-primary/45">
                  <span className="font-semibold text-fg-primary/60">Privacy first.</span>{" "}
                  Your camera stays on your device — nothing is recorded, stored, or sent anywhere.
                </p>
              </div>

              {/* Error message */}
              {cameraError && (
                <div className="mb-4 rounded-[6px] border border-red-500/15 bg-red-500/5 px-4 py-3">
                  <p className="text-xs leading-relaxed text-red-400">
                    {cameraError}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="flex-1 cursor-pointer rounded-[6px] bg-[#fe5102] px-4 py-2.5 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleGoLive}
                  disabled={!!cameraError}
                >
                  {cameraError ? "Try Again" : "Go Live"}
                </button>
                <button
                  className="flex-1 cursor-pointer rounded-[6px] border border-fg-primary/10 bg-fg-primary/5 px-4 py-2.5 text-sm font-medium text-fg-primary/60 transition-all duration-200 hover:border-fg-primary/20 hover:text-fg-primary/80"
                  onClick={() => setShowCameraModal(false)}
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
