export interface WhatWeDoItem {
  id: string;
  title: string;
  description: string;
  imageBg: string;
}

export const whatWeDoItems: WhatWeDoItem[] = [
  {
    id: "brand-identity",
    title: "Brand Identity",
    description:
      "We craft visual identities that resonate — logos, color systems, typography, and brand guidelines built for consistency at scale. Every element is designed to communicate who you are before a single word is read.",
    imageBg: "bg-bg-brand-solid",
  },
  {
    id: "design-systems",
    title: "Design Systems",
    description:
      "Component libraries and design tokens that bridge design and engineering. We build systems that ensure every touchpoint feels cohesive, from your marketing site to your product UI.",
    imageBg: "bg-bg-tertiary",
  },
  {
    id: "content-strategy",
    title: "Content Strategy",
    description:
      "Defining what to say, where, and how. We develop editorial frameworks, content calendars, and messaging architecture that drive engagement and keep your voice consistent across every channel.",
    imageBg: "bg-fg-tertiary",
  },
  {
    id: "context-optimization",
    title: "Context Optimization",
    description:
      "Structuring your brand knowledge for AI-native workflows. We build context documents, prompt libraries, and retrieval systems that make every AI interaction on-brand and on-point.",
    imageBg: "bg-bg-secondary",
  },
  {
    id: "creative-ai",
    title: "Creative AI",
    description:
      "Integrating AI into creative production — from generative assets to automated design workflows. We help teams move faster without sacrificing craft, quality, or creative control.",
    imageBg: "bg-bg-brand-solid",
  },
];
