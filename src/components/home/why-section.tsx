"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, XClose, Minus } from "@untitledui-pro/icons/line";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/shared/section-label";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { devProps } from "@/utils/dev-props";

interface ComparisonRow {
  aspect: string;
  agency: "yes" | "no" | "partial";
  agencyNote?: string;
  freelancer: "yes" | "no" | "partial";
  freelancerNote?: string;
  openSession: "yes" | "no" | "partial";
  openSessionNote?: string;
}

const comparisonData: ComparisonRow[] = [
  {
    aspect: "Dedicated attention",
    agency: "no",
    agencyNote: "Juggling multiple clients",
    freelancer: "partial",
    freelancerNote: "Limited capacity",
    openSession: "yes",
    openSessionNote: "Focused partnership",
  },
  {
    aspect: "Direct communication",
    agency: "no",
    agencyNote: "Account managers",
    freelancer: "yes",
    freelancerNote: "Direct, but solo",
    openSession: "yes",
    openSessionNote: "Direct with team",
  },
  {
    aspect: "Diverse perspectives",
    agency: "partial",
    agencyNote: "Siloed departments",
    freelancer: "no",
    freelancerNote: "Single viewpoint",
    openSession: "yes",
    openSessionNote: "Collaborative craft",
  },
  {
    aspect: "Consistent quality",
    agency: "partial",
    agencyNote: "Varies by team",
    freelancer: "partial",
    freelancerNote: "Capacity limits",
    openSession: "yes",
    openSessionNote: "Senior-led work",
  },
  {
    aspect: "Flexible engagement",
    agency: "no",
    agencyNote: "Rigid contracts",
    freelancer: "yes",
    freelancerNote: "Adaptable",
    openSession: "yes",
    openSessionNote: "Tailored approach",
  },
  {
    aspect: "Strategic thinking",
    agency: "yes",
    agencyNote: "Process-heavy",
    freelancer: "partial",
    freelancerNote: "Execution focus",
    openSession: "yes",
    openSessionNote: "Strategy + execution",
  },
];

function StatusIcon({ status }: { status: "yes" | "no" | "partial" }) {
  if (status === "yes") {
    return (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10">
        <Check className="w-4 h-4 text-green-500" />
      </div>
    );
  }
  if (status === "no") {
    return (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/10">
        <XClose className="w-4 h-4 text-red-500" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/10">
      <Minus className="w-4 h-4 text-yellow-500" />
    </div>
  );
}

export function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-bg-primary" {...devProps('WhySection')}>
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel className="mb-4">Why Open Session</SectionLabel>
          </motion.div>
          <TextBlockReveal
            as="h2"
            trigger="scroll"
            className="text-display text-3xl md:text-4xl lg:text-5xl max-w-3xl mx-auto"
          >
            The best of both worlds
          </TextBlockReveal>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-fg-secondary text-lg mt-4 max-w-2xl mx-auto"
          >
            We combine the strategic depth of an agency with the agility and
            personal attention of a freelancer.
          </motion.p>
        </div>

        {/* Comparison Table */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[640px]">
            {/* Header */}
            <thead>
              <tr className="border-b border-border-secondary">
                <th className="text-left py-4 px-4 text-sm font-medium text-fg-tertiary w-1/4">
                  Aspect
                </th>
                <th className="py-4 px-4 text-sm font-medium text-fg-tertiary w-1/4">
                  Agency
                </th>
                <th className="py-4 px-4 text-sm font-medium text-fg-tertiary w-1/4">
                  Freelancer
                </th>
                <th className={cn(
                  "py-4 px-4 text-sm font-medium w-1/4",
                  "text-fg-brand"
                )}>
                  Open Session
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {comparisonData.map((row, index) => (
                <motion.tr
                  key={row.aspect}
                  variants={fadeInUp}
                  custom={index}
                  className={cn(
                    "border-b border-border-tertiary",
                    "hover:bg-bg-secondary/50 transition-colors duration-200"
                  )}
                >
                  <td className="py-4 px-4 text-fg-primary font-medium">
                    {row.aspect}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col items-center gap-1">
                      <StatusIcon status={row.agency} />
                      {row.agencyNote && (
                        <span className="text-xs text-fg-tertiary text-center">
                          {row.agencyNote}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col items-center gap-1">
                      <StatusIcon status={row.freelancer} />
                      {row.freelancerNote && (
                        <span className="text-xs text-fg-tertiary text-center">
                          {row.freelancerNote}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={cn(
                    "py-4 px-4",
                    "bg-bg-brand-subtle/30"
                  )}>
                    <div className="flex flex-col items-center gap-1">
                      <StatusIcon status={row.openSession} />
                      {row.openSessionNote && (
                        <span className="text-xs text-fg-brand text-center font-medium">
                          {row.openSessionNote}
                        </span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
