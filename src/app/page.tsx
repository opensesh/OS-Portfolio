import { Hero } from "@/components/home/hero";
import { ImpactSection } from "@/components/home/impact-section";
import { ThesisSection } from "@/components/home/thesis-section";
import { OurExpertiseSection } from "@/components/home/what-we-do-section";
import { LogoMarquee } from "@/components/home/logo-marquee";
import { FeaturedWork } from "@/components/home/featured-work";
import { FAQSection } from "@/components/home/faq-section";
export default function Home() {
  return (
    <>
      <Hero />
      <ImpactSection />
      <ThesisSection />
      <OurExpertiseSection />
      <LogoMarquee />
      <FeaturedWork />
      <FAQSection />
    </>
  );
}
