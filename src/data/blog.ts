import { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "design-systems-2025",
    slug: "design-systems-in-2025",
    title: "Design Systems in 2025: What's Changed and What's Next",
    excerpt:
      "A look at how design systems have evolved and where they're headed as AI becomes a bigger part of the design workflow.",
    content: `
      Design systems have come a long way since the early days of style guides and pattern libraries. Today, they're sophisticated ecosystems that power some of the world's largest digital products.

      ## The Evolution

      When we first started building design systems, they were primarily documentation—a way to keep track of colors, typography, and basic components. Now, they're living systems that bridge design and development.

      ## AI Integration

      The biggest shift we're seeing is the integration of AI tools directly into design systems. From automated accessibility checks to intelligent component suggestions, AI is becoming an essential part of the workflow.

      ## What's Next

      Looking ahead, we expect to see even tighter integration between design systems and code generation tools. The gap between design and implementation will continue to shrink.
    `,
    author: {
      name: "Alex Bouhdary",
    },
    date: "2025-03-15",
    category: "Design",
    thumbnail: "/images/blog/design-systems.jpg",
    readingTime: "5 min read",
    featured: true,
  },
  {
    id: "ai-brand-identity",
    slug: "ai-in-brand-identity",
    title: "How We Use AI in Brand Identity Work",
    excerpt:
      "AI isn't replacing designers—it's augmenting our capabilities. Here's how we integrate AI tools into our brand identity process.",
    content: `
      There's been a lot of discussion about AI in design, much of it focused on image generation. But the real opportunity lies in how AI can enhance—not replace—human creativity.

      ## Research and Discovery

      We use AI to accelerate our research phase. From analyzing competitor positioning to identifying market trends, AI helps us gather insights faster.

      ## Exploration

      During the exploration phase, AI helps us generate variations and explore directions we might not have considered. It's a brainstorming partner that never gets tired.

      ## Refinement

      The actual refinement and decision-making remains deeply human. We use our judgment to select, combine, and perfect the work.
    `,
    author: {
      name: "Alex Bouhdary",
    },
    date: "2025-03-01",
    category: "AI",
    thumbnail: "/images/blog/ai-brand.jpg",
    readingTime: "4 min read",
    featured: true,
  },
  {
    id: "collaboration-remote",
    slug: "effective-remote-collaboration",
    title: "Making Remote Design Collaboration Actually Work",
    excerpt:
      "After years of remote work, we've learned what actually makes distributed design collaboration effective.",
    content: `
      Remote work is here to stay, and design teams need to adapt. Here's what we've learned about making distributed collaboration work.

      ## Async-First Communication

      The biggest mindset shift is moving from real-time to async-first communication. Not everything needs a meeting.

      ## Visual Documentation

      We've invested heavily in visual documentation. Screenshots, recordings, and annotated designs replace lengthy written explanations.

      ## Intentional Sync Time

      When we do meet synchronously, it's intentional. Design critiques, brainstorming sessions, and team bonding work best in real-time.
    `,
    author: {
      name: "Alex Bouhdary",
    },
    date: "2025-02-15",
    category: "Process",
    thumbnail: "/images/blog/remote-collab.jpg",
    readingTime: "6 min read",
    featured: false,
  },
];

export const featuredBlogPosts = blogPosts.filter((p) => p.featured);
