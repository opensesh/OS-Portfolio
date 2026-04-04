"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BlogPost } from "@/types/blog";
import { imageHover } from "@/lib/motion";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link {...devProps('BlogCard')} href={`/blog/${post.slug}`} className="group block">
      <article className={cn(featured && "md:grid md:grid-cols-2 md:gap-8")}>
        {/* Image */}
        <motion.div
          variants={imageHover}
          initial="initial"
          whileHover="hover"
          className={cn(
            "relative overflow-hidden bg-bg-tertiary mb-4",
            featured ? "aspect-[16/10]" : "aspect-[16/9]"
          )}
        >
          {/* Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-fg-tertiary text-sm">Blog Image</span>
          </div>
          {/* Uncomment when images are available
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
          />
          */}
        </motion.div>

        {/* Content */}
        <div className={cn(featured && "flex flex-col justify-center")}>
          {/* Meta */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-fg-brand font-mono uppercase">
              {post.category}
            </span>
            <span className="text-fg-tertiary">·</span>
            <span className="text-xs text-fg-tertiary">
              {post.readingTime}
            </span>
          </div>

          {/* Title */}
          <h3
            className={cn(
              "text-heading group-hover:text-fg-brand transition-colors duration-200 mb-2",
              featured ? "text-2xl md:text-3xl" : "text-xl"
            )}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          <p
            className={cn(
              "text-fg-secondary leading-relaxed",
              featured ? "text-base mb-4" : "text-sm mb-3 line-clamp-2"
            )}
          >
            {post.excerpt}
          </p>

          {/* Date */}
          <p className="text-xs text-fg-tertiary">{formatDate(post.date)}</p>
        </div>
      </article>
    </Link>
  );
}
