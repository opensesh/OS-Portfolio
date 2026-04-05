import { Hero } from "@/components/home/hero";
import { WhatWeDoSection } from "@/components/home/what-we-do-section";
import { LogoMarquee } from "@/components/home/logo-marquee";
import { StatsCounter } from "@/components/home/stats-counter";
import { ProcessSection } from "@/components/home/process-section";
import { FeaturedWork } from "@/components/home/featured-work";
import { WhySection } from "@/components/home/why-section";
import { FAQSection } from "@/components/home/faq-section";
import { CTASection } from "@/components/home/cta-section";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDoSection />
      <LogoMarquee />
      <StatsCounter />
      <ProcessSection />
      <FeaturedWork />
      <WhySection />
      <FAQSection />
      <CTASection />
    </>
  );
}
