export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  category: ProjectCategory;
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  tags: string[];
}

export type ProjectCategory =
  | "Brand Identity"
  | "Digital Design"
  | "Art Direction"
  | "Strategy";

export const projectCategories: ProjectCategory[] = [
  "Brand Identity",
  "Digital Design",
  "Art Direction",
  "Strategy",
];
