import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "15+ brand, digital design, and creative direction projects shipped across startups and Fortune 500 companies.",
  alternates: {
    canonical: "https://opensession.co/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
