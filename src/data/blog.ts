// TEMPLATE: replace with your content
import { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "ep02-creative-ai-framework",
    slug: "ep02-creative-ai-framework",
    title: "EP02: The Creative AI Framework",
    excerpt:
      "How we think about AI as a creative partner — not a replacement. A framework for integrating AI into design workflows without losing the human edge.",
    contentPath: "blog/ep02-creative-ai-framework.mdx",
    content: "",  // BRIDGE: empty string prevents blog-post.tsx crash before T011 lands
    author: {
      name: "Karim Bouhdary",
    },
    date: "2026-02-03",
    category: "Creative Philosophy",
    thumbnail: "/images/blog/KKSflaBzLhQtCCknGCHsQqbqU2s.jpg",
    readingTime: "5 min read",
    featured: true,
  },
  {
    id: "ep01-creativity-over-compute",
    slug: "ep01-creativity-over-compute",
    title: "EP01: Creativity Over Compute",
    excerpt:
      "Why the best AI-assisted work still requires a strong creative vision. On not outsourcing your taste to a model.",
    contentPath: "blog/ep01-creativity-over-compute.mdx",
    content: "",  // BRIDGE: empty string prevents blog-post.tsx crash before T011 lands
    author: {
      name: "Karim Bouhdary",
    },
    date: "2026-01-20",
    category: "Creative Philosophy",
    thumbnail: "/images/blog/dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg",
    readingTime: "4 min read",
    featured: true,
  },
  {
    id: "democratizing-fortune-500-design",
    slug: "democratizing-fortune-500-design",
    title: "Democratizing Fortune 500 Design",
    excerpt:
      "The tools that used to be locked behind agency retainers are now accessible to every founder. Here's what that means for the design industry.",
    contentPath: "blog/democratizing-fortune-500-design.mdx",
    content: "",  // BRIDGE: empty string prevents blog-post.tsx crash before T011 lands
    author: {
      name: "Karim Bouhdary",
    },
    date: "2025-12-10",
    category: "Design Strategy",
    thumbnail: "/images/blog/c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg",
    readingTime: "6 min read",
    featured: false,
  },
  {
    id: "mcp-for-designers",
    slug: "mcp-for-designers",
    title: "MCP for Designers: A Practical Guide",
    excerpt:
      "Model Context Protocol is changing how designers interact with AI tools. A plain-English guide to what it is and why it matters.",
    contentPath: "blog/mcp-for-designers.mdx",
    content: "",  // BRIDGE: empty string prevents blog-post.tsx crash before T011 lands
    author: {
      name: "Karim Bouhdary",
    },
    date: "2026-03-15",
    category: "Digital Design",
    thumbnail: "/images/blog/6zZWCJwMNLKAwcShUSZbwsO7prA.jpg",
    readingTime: "7 min read",
    featured: false,
  },
];

export const featuredBlogPosts = blogPosts.filter((p) => p.featured);
