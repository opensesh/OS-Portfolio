"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft } from "@untitledui-pro/icons/line";
import { BlogPost } from "@/types/blog";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { formatDate } from "@/lib/utils";
import { BlogCard } from "./blog-card";
import { devProps } from "@/utils/dev-props";

interface BlogPostViewProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogPostView({ post, relatedPosts }: BlogPostViewProps) {
  return (
    <article {...devProps('BlogPostView')}>
      {/* Hero */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="py-20 md:py-32"
      >
        <div className="container-main max-w-4xl mx-auto">
          {/* Back link */}
          <motion.div variants={fadeInUp} className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-fg-secondary hover:text-fg-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Posts
            </Link>
          </motion.div>

          {/* Meta */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-2 mb-4"
          >
            <span className="text-sm text-fg-brand font-mono uppercase">
              {post.category}
            </span>
            <span className="text-fg-tertiary">·</span>
            <span className="text-sm text-fg-tertiary">{post.readingTime}</span>
            <span className="text-fg-tertiary">·</span>
            <span className="text-sm text-fg-tertiary">
              {formatDate(post.date)}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-display text-3xl md:text-4xl lg:text-5xl mb-6"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            variants={fadeInUp}
            className="text-fg-secondary text-lg md:text-xl mb-8"
          >
            {post.excerpt}
          </motion.p>

          {/* Author */}
          <motion.div variants={fadeInUp} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center">
              <span className="text-sm text-fg-tertiary">
                {post.author.name.charAt(0)}
              </span>
            </div>
            <span className="text-fg-primary font-medium">
              {post.author.name}
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* Hero Image */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-16 md:mb-24"
      >
        <div className="container-main">
          <div className="relative aspect-[21/9] bg-bg-tertiary">
            {/* Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-fg-tertiary">Hero Image</span>
            </div>
            {/* Uncomment when images are available
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            */}
          </div>
        </div>
      </motion.section>

      {/* Content */}
      <section className="pb-20 md:pb-32">
        <div className="container-main max-w-3xl mx-auto">
          <div className="prose">
            {/* Render markdown content - simplified for now */}
            {post.content.split("\n\n").map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-heading text-2xl mt-12 mb-4">
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }

              return (
                <p
                  key={index}
                  className="text-fg-secondary text-lg leading-relaxed mb-6"
                >
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 md:py-32 border-t border-border-secondary bg-bg-secondary">
          <div className="container-main">
            <h2 className="text-display text-2xl md:text-3xl mb-8">
              More Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.slice(0, 3).map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
