import { Hero } from "@/components/home/hero";
import { ImpactSection } from "@/components/home/impact-section";
import { PerspectiveSection } from "@/components/home/perspective-section";
import { OurExpertiseSection } from "@/components/home/what-we-do-section";
import { LogoMarquee } from "@/components/home/logo-marquee";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FeaturedWork } from "@/components/home/featured-work";
import { FAQSection } from "@/components/home/faq-section";
export default function Home() {
  return (
    <>
      <Hero />
      <PerspectiveSection />
      <OurExpertiseSection />
      <ImpactSection />
      <LogoMarquee />
      <TestimonialsSection />
      <FeaturedWork />
      <FAQSection />
    </>
  );
}
