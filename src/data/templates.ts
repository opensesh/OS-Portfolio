export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  downloadUrl?: string;
  comingSoon?: boolean;
}

export const templates: Template[] = [
  {
    id: "brand-guidelines",
    title: "Brand Guidelines Template",
    description:
      "A comprehensive Figma template for creating professional brand guidelines.",
    category: "Figma",
    thumbnail: "/images/templates/brand-guidelines.jpg",
    downloadUrl: "#",
  },
  {
    id: "pitch-deck",
    title: "Pitch Deck Template",
    description:
      "Clean, minimal pitch deck template perfect for startups and agencies.",
    category: "Figma",
    thumbnail: "/images/templates/pitch-deck.jpg",
    downloadUrl: "#",
  },
  {
    id: "design-system-starter",
    title: "Design System Starter",
    description:
      "A starter kit for building scalable design systems in Figma.",
    category: "Figma",
    thumbnail: "/images/templates/design-system.jpg",
    comingSoon: true,
  },
  {
    id: "portfolio-template",
    title: "Portfolio Website Template",
    description:
      "Next.js portfolio template with animations and dark mode support.",
    category: "Code",
    thumbnail: "/images/templates/portfolio.jpg",
    comingSoon: true,
  },
];
