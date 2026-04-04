"use client";

import { motion } from "framer-motion";
import { BlogPost } from "@/types/blog";
import { BlogCard } from "./blog-card";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { devProps } from "@/utils/dev-props";

interface BlogGridProps {
  posts: BlogPost[];
  showFeatured?: boolean;
}

export function BlogGrid({ posts, showFeatured = false }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-fg-secondary">No posts found.</p>
      </div>
    );
  }

  // If showing featured, split the first post
  const [featuredPost, ...remainingPosts] = showFeatured
    ? posts
    : [undefined, ...posts];

  return (
    <div {...devProps('BlogGrid')}>
      {/* Featured Post */}
      {showFeatured && featuredPost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <BlogCard post={featuredPost} featured />
        </motion.div>
      )}

      {/* Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {remainingPosts
          .filter((post): post is BlogPost => post !== undefined)
          .map((post) => (
            <motion.div key={post.id} variants={fadeInUp}>
              <BlogCard post={post} />
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
}
