export interface WhatWeDoItem {
  id: string;
  title: string;
  description: string;
}

export const whatWeDoItems: WhatWeDoItem[] = [
  {
    id: "workshops",
    title: "Workshops",
    description:
      "We host enterprise-grade workshops onboarding large teams to complex AI workflows and tools, specializing on brand content production systems and design systems for product design.",
  },
  {
    id: "work",
    title: "Work",
    description:
      "We offer premium creative services focused on brand identity, design systems, and creative AI.",
  },
  {
    id: "products",
    title: "Products",
    description:
      "We're a product design studio helping clients build products and currently deploying our own.",
  },
];
