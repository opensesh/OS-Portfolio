import { notFound } from "next/navigation";
import { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import { BlogPostView } from "@/components/blog/blog-post";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Open Session Blog`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts.filter(
    (p) => p.id !== post.id && p.category === post.category
  );

  // If not enough from same category, add recent posts
  if (relatedPosts.length < 3) {
    const otherPosts = blogPosts.filter(
      (p) => p.id !== post.id && !relatedPosts.includes(p)
    );
    relatedPosts.push(...otherPosts.slice(0, 3 - relatedPosts.length));
  }

  return <BlogPostView post={post} relatedPosts={relatedPosts} />;
}
