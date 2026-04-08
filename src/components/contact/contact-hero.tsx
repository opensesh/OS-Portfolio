"use client";

import { Mail01, MarkerPin01 } from "@untitledui-pro/icons/line";
import { SectionLabel } from "@/components/shared/section-label";
import { TextBlockReveal } from "@/components/shared/text-block-reveal";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { ActionButton } from "@/components/shared/action-button";
import { ContactForm } from "@/components/shared/contact-form";
import { devProps } from "@/utils/dev-props";

export function ContactHero() {
  return (
    <section
      {...devProps("ContactHero")}
      className="min-h-[calc(100dvh-80px)] flex items-center py-20 md:py-32"
    >
      <div className="container-main w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column — Intro & CTA */}
          <div>
            <SectionLabel className="mb-4">Connect</SectionLabel>

            <TextBlockReveal
              as="h1"
              className="text-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6"
              trigger="scroll"
            >
              {"Let's Talk"}
            </TextBlockReveal>

            <ScrollReveal className="mb-10">
              <p className="text-fg-secondary text-lg leading-relaxed">
                We&apos;re interested in collaborations and partnerships.
                We&apos;re not actively taking on clients, but we&apos;re
                always open to connecting and consulting.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="mb-12">
              <p className="text-fg-secondary text-base mb-4">
                Book a 15-minute intro call. Pick a time that works.
              </p>
              <ActionButton
                href="https://cal.com/opensession"
                external
                variant="brand"
                size="lg"
              >
                Schedule Call
              </ActionButton>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col gap-3 text-sm text-fg-secondary">
                <a
                  href="mailto:hello@opensession.co"
                  className="inline-flex items-center gap-2 hover:text-fg-brand transition-colors duration-200"
                >
                  <Mail01 className="w-4 h-4 text-fg-tertiary" />
                  hello@opensession.co
                </a>
                <span className="inline-flex items-center gap-2">
                  <MarkerPin01 className="w-4 h-4 text-fg-tertiary" />
                  Remote / San Diego, California
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column — Form */}
          <div>
            <ScrollReveal>
              <h2 className="text-heading text-2xl mb-8">Send a Message</h2>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <ContactForm />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
