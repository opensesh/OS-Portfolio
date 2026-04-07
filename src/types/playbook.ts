// TEMPLATE: replace with your content

export interface Playbook {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string;   // path to MDX file, e.g. "playbooks/slug.mdx"
  author: {
    name: string;
    image?: string;
  };
  date: string;
  category: string;
  thumbnail: string;
  readingTime: string;
}
