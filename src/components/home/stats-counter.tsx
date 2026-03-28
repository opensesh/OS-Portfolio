"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { stats } from "@/data/stats";
import { staggerContainer, fadeInUp } from "@/lib/motion";

function useCounter(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, duration, start]);

  return count;
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
  const count = useCounter(value, 2000, isInView);

  return (
    <motion.div variants={fadeInUp} className="text-center">
      <div className="text-display text-5xl md:text-6xl lg:text-7xl mb-2">
        <span>{count}</span>
        <span className="text-fg-brand">{suffix}</span>
      </div>
      <p className="text-fg-secondary text-sm md:text-base">{label}</p>
    </motion.div>
  );
}

export function StatsCounter() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.3 });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-bg-secondary">
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
