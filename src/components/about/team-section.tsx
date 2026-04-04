"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { team } from "@/data/team";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

export function TeamSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section {...devProps('TeamSection')} ref={ref} className="py-20 md:py-32 bg-bg-secondary">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <p className="section-label mb-4">Team</p>
          <h2 className="text-display text-3xl md:text-4xl lg:text-5xl">
            The people behind the work
          </h2>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {team.map((member) => (
            <motion.div
              key={member.id}
              variants={fadeInUp}
              className="group"
            >
              {/* Photo */}
              <div
                className={cn(
                  "relative aspect-[3/4] mb-4 overflow-hidden",
                  "bg-bg-tertiary"
                )}
              >
                {/* Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-fg-tertiary text-sm">{member.name}</span>
                </div>
                {/* Uncomment when images are available
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
                */}
              </div>

              {/* Info */}
              <h3 className="text-heading text-xl mb-1">{member.name}</h3>
              <p className="text-fg-secondary text-sm mb-3">{member.role}</p>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {member.bio}
              </p>

              {/* Social links */}
              {member.social && (
                <div className="flex items-center gap-4 mt-4">
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fg-tertiary hover:text-fg-brand transition-colors text-sm"
                    >
                      LinkedIn
                    </a>
                  )}
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fg-tertiary hover:text-fg-brand transition-colors text-sm"
                    >
                      GitHub
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fg-tertiary hover:text-fg-brand transition-colors text-sm"
                    >
                      Twitter
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
