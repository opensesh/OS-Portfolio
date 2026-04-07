import { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { TeamShowcase } from "@/components/about/team-showcase";
import { ThesisSection } from "@/components/home/thesis-section";
import { ValuesSection } from "@/components/about/values-section";
import { BeliefsSection } from "@/components/home/beliefs-section";
export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Open Session, a design company focused on brand systems, creative AI, and community.",
  alternates: {
    canonical: "https://opensession.co/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <TeamShowcase />
      <ThesisSection />
      <ValuesSection />
      <BeliefsSection />
    </>
  );
}
