// TEMPLATE: replace with your content
import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "iterra",
    slug: "iterra",
    title: "Iterra",
    client: "Iterra",
    year: "2025",
    industry: "Technology",
    description:
      "Complete brand identity and guidelines for a next-generation technology platform.",
    thumbnail: "/images/projects/iterra/vvl6xyIdUMskDBgstfyClKSxE8.svg",
    featured: true,
    tags: ["Logo", "Visual Identity", "Guidelines"],
    // enriched fields (fully populated in T005)
    categories: ["brand-identity"],
    services: [],
    sections: [],
    images: [],
  },
  {
    id: "biltfour",
    slug: "biltfour",
    title: "BILTFOUR",
    client: "BILTFOUR",
    year: "2024",
    industry: "Fashion",
    description:
      "Brand identity, e-commerce design, and community building for a premium streetwear brand.",
    thumbnail: "/images/projects/biltfour/ZwDzuAZjuENRwaTtArVGJQsGc.svg",
    featured: true,
    tags: ["Branding", "E-commerce", "Community"],
    // enriched fields (fully populated in T005)
    categories: ["brand-identity", "web-design"],
    services: [],
    sections: [],
    images: [],
  },
  {
    id: "google-cloud-next",
    slug: "google-cloud-next",
    title: "Google Cloud NEXT",
    client: "Google",
    year: "2024",
    industry: "Technology",
    description:
      "Demo design system and UX patterns for Google Cloud's annual developer conference.",
    thumbnail: "/images/projects/google-cloud-next/zwWkHCt1g0HSk5r9elbNigK55dk.svg",
    featured: true,
    tags: ["Design System", "UX", "Conference"],
    // enriched fields (fully populated in T005)
    categories: ["digital-design", "strategy"],
    services: [],
    sections: [],
    images: [],
  },
  {
    id: "google-gemini-infinite-nature",
    slug: "google-gemini-infinite-nature",
    title: "Google Gemini Infinite Nature",
    client: "Google",
    year: "2024",
    industry: "AI & Technology",
    description:
      "Art direction and UI design for Google's groundbreaking AI-powered nature visualization.",
    thumbnail: "/images/projects/google-gemini-infinite-nature/enyu0AxPncALYsOKGqBz5dcGo.svg",
    featured: false,
    tags: ["Art Direction", "UI Design", "AI"],
    // enriched fields (fully populated in T005)
    categories: ["art-direction", "digital-design"],
    services: [],
    sections: [],
    images: [],
  },
  {
    id: "universal-audio",
    slug: "universal-audio",
    title: "Universal Audio",
    client: "Universal Audio",
    year: "2023",
    industry: "Audio & Music",
    description:
      "Visual design and campaign work for a legendary pro audio equipment manufacturer.",
    thumbnail: "/images/projects/universal-audio/Cy7GHb48xSXmwdDJCZ48qHDRFF0.svg",
    featured: false,
    tags: ["Visual Design", "Campaigns", "Product"],
    // enriched fields (fully populated in T005)
    categories: ["art-direction", "strategy"],
    services: [],
    sections: [],
    images: [],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
