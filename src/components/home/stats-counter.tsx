"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/data/stats";
import { staggerContainer, fadeInUp } from "@/lib/motion";

// Slot machine digit - displays a column of 0-9 that scrolls
function SlotDigit({
  targetDigit,
  delay = 0,
  isAnimating,
}: {
  targetDigit: number;
  delay?: number;
  isAnimating: boolean;
}) {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [currentOffset, setCurrentOffset] = useState(0);
  const animationRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Only animate once when isAnimating becomes true
    if (!isAnimating || hasAnimated.current) {
      return;
    }
    hasAnimated.current = true;

    const startTime = Date.now();
    const duration = 1200 + delay; // Base duration + stagger delay
    const spins = 2 + Math.random(); // Random number of full rotations

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const delayedElapsed = Math.max(0, elapsed - delay);
      const adjustedDuration = duration - delay;
      const progress = Math.min(delayedElapsed / adjustedDuration, 1);

      // Spring easing with overshoot
      const eased = progress < 1
        ? 1 - Math.pow(1 - progress, 4) + Math.sin(progress * Math.PI) * 0.08
        : 1;

      // Calculate position: spin through multiple rotations then settle on target
      const totalRotation = spins + targetDigit / 10;
      const currentPosition = eased * totalRotation * 10;
      setCurrentOffset(currentPosition % 10);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentOffset(targetDigit);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, targetDigit, delay]);

  // Height of each digit cell
  const digitHeight = 1; // in em units

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: `${digitHeight}em`, width: "0.65em" }}
    >
      <div
        className="absolute left-0 right-0 transition-none"
        style={{
          transform: `translateY(-${currentOffset * digitHeight}em)`,
        }}
      >
        {digits.map((digit) => (
          <div
            key={digit}
            className="flex items-center justify-center"
            style={{ height: `${digitHeight}em` }}
          >
            {digit}
          </div>
        ))}
        {/* Repeat first few digits for seamless looping */}
        {digits.slice(0, 3).map((digit) => (
          <div
            key={`repeat-${digit}`}
            className="flex items-center justify-center"
            style={{ height: `${digitHeight}em` }}
          >
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
}

// Slot machine number - breaks number into digits and animates each
function SlotNumber({
  value,
  isAnimating,
}: {
  value: number;
  isAnimating: boolean;
}) {
  const digits = useMemo(() => {
    return value.toString().split("").map(Number);
  }, [value]);

  return (
    <div className="flex items-center justify-center">
      {digits.map((digit, index) => (
        <SlotDigit
          key={index}
          targetDigit={digit}
          delay={index * 80} // Stagger each digit by 80ms
          isAnimating={isAnimating}
        />
      ))}
    </div>
  );
}

function StatItem({
  value,
  suffix,
  label,
  isInView,
}: {
  value: number;
  suffix: string;
  label: string;
  isInView: boolean;
}) {
  return (
    <motion.div variants={fadeInUp} className="text-center">
      <div className="text-display text-5xl md:text-6xl lg:text-7xl mb-2">
        <SlotNumber value={value} isAnimating={isInView} />
        <span className="text-fg-brand">{suffix}</span>
      </div>
      <p className="text-fg-secondary text-sm md:text-base">{label}</p>
    </motion.div>
  );
}

export function StatsCounter() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-bg-secondary">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container-main"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              isInView={isInView}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
