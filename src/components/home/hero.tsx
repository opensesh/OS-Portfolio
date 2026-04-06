"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { ActionButton } from "@/components/shared/action-button";
import { UnderlineLink } from "@/components/shared/underline-link";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { fadeInUp } from "@/lib/motion";
import { useMousePosition } from "@/hooks/use-mouse-position";

import { useBreakpoint } from "@/hooks/use-breakpoint";
import { usePageLoaded } from "@/hooks/use-page-loaded";
import { useTheme } from "@/components/providers/theme-provider";
import { devProps } from "@/utils/dev-props";
import { TVChannelMenu } from "@/components/home/tv-channel-menu";
import { DEFAULT_CHANNEL } from "@/lib/tv-channels";
import Image from "next/image";

const CLIENTS = [
  { name: "Google", src: "/logos/clients/google.svg" },
  { name: "Fitbit", src: "/logos/clients/fitbit.svg" },
  { name: "Salesforce", src: "/logos/clients/salesforce.svg" },
  { name: "Universal Audio", src: "/logos/clients/universal-audio.svg" },
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Phase 1 (0–15%): text fades, TV slides to center
  // Phase 2 (15–55%): TV holds centered — dwell time
  // Phase 3 (55–100%): zoom into screen, transition out
  // Clamp to 0 after fade — these must never reappear
  const clientBarOpacity = useTransform(scrollYProgress, [0, 0.08, 1], [1, 0, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.10, 1], [1, 0, 0]);
  // Hide text/client bar from layout once faded so they can't interfere
  const textVisibility = useTransform(scrollYProgress, (v) => v > 0.12 ? "hidden" as const : "visible" as const);
  const clientBarVisibility = useTransform(scrollYProgress, (v) => v > 0.10 ? "hidden" as const : "visible" as const);

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

        {/* 3D Canvas — full viewport, translated right on desktop so TV starts in right half */}
        <motion.div
          className="absolute inset-0 lg:bottom-[10vh] z-0"
          style={{ x: tvX }}
        >
          <CRTTVScene
            scrollRef={scrollRef}
            mouseRef={mouseRef}
            activeChannel={activeChannel}
            className="h-full w-full"
          />
        </motion.div>

        {/* Hero text — left half, fades on scroll and hides once gone */}
        <motion.div
          style={{ opacity: textOpacity, visibility: textVisibility }}
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
              We help the world make the most of design and technology. From
              brand identity to digital products, we craft experiences that
              matter.
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
          style={{ opacity: clientBarOpacity, visibility: clientBarVisibility }}
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
              <div className="flex items-center gap-1.5">
                {CLIENTS.map((client) => (
                  <Image
                    key={client.name}
                    src={client.src}
                    alt={client.name}
                    width={680}
                    height={336}
                    className="h-14 w-auto opacity-70"
                  />
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
          style={{ opacity: textOpacity, visibility: textVisibility }}
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
          onChannelChange={setActiveChannel}
        />

      </div>
    </section>
  );
}
