import { Hero } from "@/components/home/hero";
import { LogoMarquee } from "@/components/home/logo-marquee";
import { StatsCounter } from "@/components/home/stats-counter";
import { ProcessSection } from "@/components/home/process-section";
import { FeaturedWork } from "@/components/home/featured-work";
import { ServicesSection } from "@/components/home/services-section";
import { FAQSection } from "@/components/home/faq-section";
import { CTASection } from "@/components/home/cta-section";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <StatsCounter />
      <ProcessSection />
      <FeaturedWork />
      <ServicesSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
