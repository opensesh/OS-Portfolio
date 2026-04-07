import { notFound } from "next/navigation";
import { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { blogPosts } from "@/data/blog";
import { BlogPostView } from "@/components/blog/blog-post";
import { getMdxContent } from "@/lib/mdx";
import { getMDXComponents } from "@/components/blog/mdx-components";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Open Session Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.thumbnail ? [{ url: post.thumbnail }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  const mdxSource = await getMdxContent(post.contentPath);
  const { content } = await compileMDX({
    source: mdxSource,
    components: getMDXComponents(),
  });

  return (
    <BlogPostView post={post} relatedPosts={relatedPosts}>
      {content}
    </BlogPostView>
  );
}
