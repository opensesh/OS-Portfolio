export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    image?: string;
  };
  date: string;
  category: BlogCategory;
  thumbnail: string;
  readingTime: string;
  featured?: boolean;
}

export type BlogCategory = "Design" | "AI" | "Process" | "Insights";

export const blogCategories: BlogCategory[] = [
  "Design",
  "AI",
  "Process",
  "Insights",
];
