"use client";

import { clients } from "@/data/clients";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

export function LogoMarquee() {
  // Duplicate the list for seamless infinite scroll
  const duplicatedClients = [...clients, ...clients];

  return (
    <section className="py-16 md:py-20 border-y border-border-secondary overflow-hidden" {...devProps('LogoMarquee')}>
      <div className="container-main mb-8">
        <p className="section-label">Trusted By</p>
      </div>

      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-bg-primary to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-bg-primary to-transparent z-10" />

        {/* Marquee */}
        <div className="flex animate-marquee">
          {duplicatedClients.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className={cn(
                "flex-shrink-0 px-8 md:px-12",
                "flex items-center justify-center"
              )}
            >
              {/* Placeholder for logo - showing text for now */}
              <span className="text-lg md:text-xl font-display font-medium text-fg-tertiary whitespace-nowrap">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-main mt-8">
        <p className="text-sm text-fg-tertiary text-center">+ Many more</p>
      </div>
    </section>
  );
}
