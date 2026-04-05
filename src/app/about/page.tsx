import { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { TeamSection } from "@/components/about/team-section";
import { ValuesSection } from "@/components/about/values-section";
import { StatsCounter } from "@/components/home/stats-counter";
export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Open Session, a design company focused on brand systems, creative AI, and community.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <TeamSection />
      <ValuesSection />
      <StatsCounter />
    </>
  );
}
