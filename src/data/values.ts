export interface Value {
  id: string;
  title: string;
  description: string;
}

export const values: Value[] = [
  {
    id: "craft",
    title: "Craft Over Speed",
    description:
      "We believe great design takes time. We don't rush to deliver; we take the time to get it right, because details matter.",
  },
  {
    id: "collaboration",
    title: "True Collaboration",
    description:
      "The best work happens when we work alongside you, not just for you. We see every project as a partnership.",
  },
  {
    id: "clarity",
    title: "Clarity in Everything",
    description:
      "From our process to our deliverables, we strive for clarity. No jargon, no confusion—just honest, direct communication.",
  },
  {
    id: "impact",
    title: "Meaningful Impact",
    description:
      "We care about making work that matters. Every project should move the needle and create lasting value.",
  },
];
