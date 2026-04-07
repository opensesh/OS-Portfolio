import { Metadata } from "next";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blog";
import { BlogGrid } from "@/components/blog/blog-grid";
import { devProps } from "@/utils/dev-props";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on design, AI, process, and building meaningful brands.",
  alternates: {
    canonical: "https://opensession.co/blog",
  },
};

export default function BlogPage() {
  return (
    <div {...devProps('BlogPage')} className="py-20 md:py-32">
      <div className="container-main">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="section-label mb-4">Blog</p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl mb-6">
            Thoughts & Insights
          </h1>
          <p className="text-fg-secondary text-lg max-w-2xl">
            Perspectives on design, AI, process, and building meaningful brands
            and products.
          </p>
        </div>

        {/* Blog Grid */}
        <BlogGrid posts={blogPosts} showFeatured />
      </div>
    </div>
  );
}
