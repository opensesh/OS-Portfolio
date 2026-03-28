export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description:
      "We start by listening. Through research and conversation, we uncover the insights that will shape your brand.",
  },
  {
    number: "02",
    title: "Define",
    description:
      "We translate insights into strategy. Clear positioning, structured thinking, and a roadmap for success.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "Ideas take form through thoughtful iteration. Every detail considered, every element purposeful.",
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "We hand off with care. Complete documentation, flexible assets, and ongoing support when you need it.",
  },
];
