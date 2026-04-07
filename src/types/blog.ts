// TEMPLATE: replace with your content

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string;   // path to MDX file, e.g. "blog/ep02-creative-ai-framework.mdx"
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

export type BlogCategory =
  | 'Creative Philosophy'
  | 'About Us'
  | 'Digital Design'
  | 'Design Strategy'
  | 'Brand Identity';

export const blogCategories: BlogCategory[] = [
  'Creative Philosophy',
  'About Us',
  'Digital Design',
  'Design Strategy',
  'Brand Identity',
];
