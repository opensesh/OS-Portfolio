"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { ActionButton } from "@/components/shared/action-button";
import { UnderlineLink } from "@/components/shared/underline-link";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { fadeInUp } from "@/lib/motion";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useCameraStream } from "@/hooks/use-camera-stream";

import { useBreakpoint } from "@/hooks/use-breakpoint";
import { usePageLoaded } from "@/hooks/use-page-loaded";
import { useTheme } from "@/components/providers/theme-provider";
import { devProps } from "@/utils/dev-props";
import { TVChannelMenu } from "@/components/home/tv-channel-menu";
import { DEFAULT_CHANNEL, LIVE_CHANNEL_SLUG } from "@/lib/tv-channels";
import Image from "next/image";

const CLIENTS = [
  { name: "Google", src: "/logos/clients/google.svg", url: "https://google.com" },
  { name: "Fitbit", src: "/logos/clients/fitbit.svg", url: "https://www.fitbit.com" },
  { name: "Salesforce", src: "/logos/clients/salesforce.svg", url: "https://www.salesforce.com" },
  { name: "Universal Audio", src: "/logos/clients/universal-audio.svg", url: "https://www.uaudio.com" },
];

const CRTTVScene = dynamic(
  () =>
    import("@/components/three/crt-tv-scene").then((mod) => ({
      default: mod.CRTTVScene,
    })),
  { ssr: false }
);

const FaultyTerminal = dynamic(
  () => import("@/components/backgrounds/faulty-terminal"),
  { ssr: false }
);


export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<number>(0);
  const mouseRef = useMousePosition();
  const isDesktop = useBreakpoint("lg");
  const { resolvedTheme } = useTheme();
  const pageLoaded = usePageLoaded();
  const terminalBg = resolvedTheme === "dark" ? "#191919" : "#faf8f5";
  const [activeChannel, setActiveChannel] = useState(DEFAULT_CHANNEL);
  const [isLive, setIsLive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const cameraStream = useCameraStream();
  const snapshotRequestRef = useRef<(() => void) | null>(null);

  const handleGoLive = useCallback(async () => {
    setCameraError(null);
    const result = await cameraStream.start();
    if (result.success) {
      setIsLive(true);
      setActiveChannel(LIVE_CHANNEL_SLUG);
    } else {
      setCameraError(result.error ?? "Camera access failed.");
    }
  }, [cameraStream]);

  const handleStopLive = useCallback(() => {
    cameraStream.stop();
    setIsLive(false);
  }, [cameraStream]);

  const handleSnapshot = useCallback(() => {
    snapshotRequestRef.current?.();
  }, []);

  const handleChannelChange = useCallback(
    (slug: string) => {
      if (isLive && slug !== LIVE_CHANNEL_SLUG) {
        handleStopLive();
      }
      setActiveChannel(slug);
    },
    [isLive, handleStopLive]
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // All hero content fades together — unified, smooth, delightful.
  // Ease-out fade over 0–14% scroll so content is fully gone before
  // Phase 1 end (15%) and well before fullscreen mode (35%).
  // The curve decelerates naturally: fast initial drop, gentle tail.
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.02, 0.05, 0.08, 0.11, 0.14],
    [1, 0.8,  0.5,  0.25, 0.08, 0]
  );
  // Hide from layout once fully faded so elements can't interfere
  const contentVisibility = useTransform(scrollYProgress, (v) => v > 0.15 ? "hidden" as const : "visible" as const);

  // Canvas translateX: slides from right-offset to centered during Phase 1
  const tvX = useTransform(
    scrollYProgress,
    [0, 0.15],
    [isDesktop ? "20%" : "0%", "0%"]
  );

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="relative h-[300vh] -mt-16 md:-mt-20" {...devProps('Hero')}>
      <div className="sticky top-0 h-screen" style={{ overflowX: 'clip', overflowY: 'visible' }}>
        {/* Faulty Terminal background — full-bleed behind everything */}
        <div className="absolute inset-0 z-[-1] opacity-15">
          <FaultyTerminal
            tint="#fe5102"
            backgroundColor={terminalBg}
            scale={3}
            digitSize={0.6}
            timeScale={0.3}
            noiseAmp={0.3}
            brightness={1}
            scanlineIntensity={0.3}
            glitchAmount={1}
            flickerAmount={1}
            curvature={0}
            mouseStrength={0.5}
            mouseReact
            pageLoadAnimation
          />
        </div>

        {/* 3D Canvas — full viewport, pointer-events-none so FAB stays clickable */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ x: tvX }}
        >
          <CRTTVScene
            scrollRef={scrollRef}
            mouseRef={mouseRef}
            activeChannel={activeChannel}
            cameraTextureRef={cameraStream.textureRef}
            isLiveRef={cameraStream.isActiveRef}
            onSnapshotRequest={snapshotRequestRef}
            className="h-full w-full pointer-events-auto"
          />
        </motion.div>

        {/* Hero text — left half, fades on scroll and hides once gone */}
        <motion.div
          style={{ opacity: contentOpacity, visibility: contentVisibility }}
          className="relative z-10 h-full pointer-events-none"
        >
          <div className="container-wide h-full flex items-start pt-28 md:pt-32 lg:items-center lg:pt-0 pb-[10vh]">
            <div className="w-full lg:w-[60%] xl:w-1/2">
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={pageLoaded ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="section-label mb-6"
            >
              A modern design studio.
            </motion.p>

            {/* Headline — block-wipe reveal */}
            <TextBlockReveal
              as="h1"
              trigger="after-loader"
              delay={0.1}
              stagger={0.15}
              className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] 2xl:text-[4.25rem]"
            >
              {"Brand strategy meets\ndesign systems"}
            </TextBlockReveal>

            {/* Description — narrower for staircase taper */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate={pageLoaded ? "visible" : undefined}
              transition={{ delay: 1.2 }}
              className="text-base md:text-lg text-fg-secondary max-w-sm mb-10"
            >
              We focus on brand identity, content production, and digital
              products. Our edge is human-centered design and creative context
              engineering.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={pageLoaded ? "visible" : undefined}
              transition={{ delay: 1.35 }}
              className="flex gap-4 pointer-events-auto"
            >
              <ActionButton href="/contact" size="lg" variant="brand">
                Start a Project
              </ActionButton>
              <UnderlineLink
                href="/projects"
                className="self-center text-sm font-body font-medium uppercase tracking-normal text-fg-primary"
              >
                View Our Work
              </UnderlineLink>
            </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom gradient fade — generous height for a delightful blend into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
          style={{
            height: "40vh",
            background: "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--bg-primary) 40%, transparent) 40%, color-mix(in srgb, var(--bg-primary) 75%, transparent) 65%, var(--bg-primary) 100%)",
          }}
        />

        {/* Client credibility bar */}
        <motion.div
          style={{ opacity: contentOpacity, visibility: contentVisibility }}
          className="absolute bottom-10 left-0 z-30 w-full hidden lg:block pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={pageLoaded ? { opacity: 1 } : undefined}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="container-wide"
          >
            <div className="flex items-center gap-4">
              <p className="font-accent text-sm font-bold uppercase tracking-widest text-fg-tertiary leading-tight whitespace-nowrap">
                Past Design
                <br />
                Work With
              </p>
              <div className="flex items-center gap-10 pointer-events-auto">
                {CLIENTS.map((client) => (
                  <a
                    key={client.name}
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={client.name}
                    className="group relative"
                  >
                    <Image
                      src={client.src}
                      alt={client.name}
                      width={200}
                      height={40}
                      className="h-7 w-auto opacity-70 hover:opacity-100 transition-opacity invert dark:invert-0"
                    />
                    <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-bg-secondary px-2 py-1 text-xs text-fg-secondary opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-border-secondary">
                      {client.name}
                    </span>
                  </a>
                ))}
                <span className="font-accent text-xs font-bold uppercase tracking-widest text-fg-tertiary opacity-50 whitespace-nowrap ml-1">
                  + More
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: contentOpacity, visibility: contentVisibility }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={pageLoaded ? { opacity: 1 } : undefined}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-6 h-10 border-2 border-border-primary rounded-full flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-fg-tertiary rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* TV Channel Menu — floating FAB + dropdown */}
        <TVChannelMenu
          scrollYProgress={scrollYProgress}
          sectionRef={sectionRef}
          onChannelChange={handleChannelChange}
          isLive={isLive}
          onGoLive={handleGoLive}
          onStopLive={handleStopLive}
          onSnapshot={handleSnapshot}
          cameraError={cameraError}
        />

      </div>
    </section>
  );
}
