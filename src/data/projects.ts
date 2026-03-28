import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "iterra",
    slug: "iterra",
    title: "Iterra",
    client: "Iterra",
    year: "2025",
    category: "Brand Identity",
    industry: "Technology",
    description:
      "Complete brand identity and guidelines for a next-generation technology platform.",
    thumbnail: "/images/projects/iterra-thumb.jpg",
    featured: true,
    tags: ["Logo", "Visual Identity", "Guidelines"],
  },
  {
    id: "biltfour",
    slug: "biltfour",
    title: "BILTFOUR",
    client: "BILTFOUR",
    year: "2024",
    category: "Brand Identity",
    industry: "Fashion",
    description:
      "Brand identity, e-commerce design, and community building for a premium streetwear brand.",
    thumbnail: "/images/projects/biltfour-thumb.jpg",
    featured: true,
    tags: ["Branding", "E-commerce", "Community"],
  },
  {
    id: "google-cloud-next",
    slug: "google-cloud-next",
    title: "Google Cloud NEXT",
    client: "Google",
    year: "2024",
    category: "Digital Design",
    industry: "Technology",
    description:
      "Demo design system and UX patterns for Google Cloud's annual developer conference.",
    thumbnail: "/images/projects/google-cloud-thumb.jpg",
    featured: true,
    tags: ["Design System", "UX", "Conference"],
  },
  {
    id: "gemini-infinite-nature",
    slug: "gemini-infinite-nature",
    title: "Google Gemini Infinite Nature",
    client: "Google",
    year: "2024",
    category: "Art Direction",
    industry: "AI & Technology",
    description:
      "Art direction and UI design for Google's groundbreaking AI-powered nature visualization.",
    thumbnail: "/images/projects/gemini-thumb.jpg",
    featured: false,
    tags: ["Art Direction", "UI Design", "AI"],
  },
  {
    id: "universal-audio",
    slug: "universal-audio",
    title: "Universal Audio",
    client: "Universal Audio",
    year: "2023",
    category: "Art Direction",
    industry: "Audio & Music",
    description:
      "Visual design and campaign work for a legendary pro audio equipment manufacturer.",
    thumbnail: "/images/projects/ua-thumb.jpg",
    featured: false,
    tags: ["Visual Design", "Campaigns", "Product"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
