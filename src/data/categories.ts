export const CATEGORY_SLUGS = [
  "art-direction",
  "strategy",
  "digital-design",
  "brand-identity",
  "web-design",
] as const;

export type Category = (typeof CATEGORY_SLUGS)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  "art-direction": "Art Direction",
  strategy: "Strategy",
  "digital-design": "Digital Design",
  "brand-identity": "Brand Identity",
  "web-design": "Web Design",
};

export function categoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug as Category] ?? slug;
}
