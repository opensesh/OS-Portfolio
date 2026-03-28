export interface Service {
  id: string;
  title: string;
  description: string;
  items: string[];
}

export const services: Service[] = [
  {
    id: "brand-identity",
    title: "Brand Identity",
    description:
      "We create distinctive brand identities that resonate with your audience and stand the test of time.",
    items: [
      "Logo Design",
      "Visual Systems",
      "Brand Guidelines",
      "Typography",
      "Color Systems",
      "Iconography",
    ],
  },
  {
    id: "digital-design",
    title: "Digital Design",
    description:
      "Crafting digital experiences that are intuitive, beautiful, and built to perform.",
    items: [
      "Web Design",
      "App Design",
      "UX/UI Design",
      "Design Systems",
      "Prototyping",
      "Interaction Design",
    ],
  },
  {
    id: "art-direction",
    title: "Art Direction",
    description:
      "Bringing creative vision to life through thoughtful direction and visual storytelling.",
    items: [
      "Creative Direction",
      "Campaign Design",
      "Visual Storytelling",
      "Photography Direction",
      "Motion Design",
      "Content Strategy",
    ],
  },
  {
    id: "strategy",
    title: "Strategy & Consulting",
    description:
      "Strategic thinking that positions your brand for growth and long-term success.",
    items: [
      "Brand Positioning",
      "Market Research",
      "Competitive Analysis",
      "Brand Audits",
      "Naming",
      "Workshops",
    ],
  },
];
