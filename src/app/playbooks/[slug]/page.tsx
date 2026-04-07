import { notFound } from "next/navigation";
import { Metadata } from "next";
import { playbooks } from "@/data/playbooks";

interface PlaybookPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return playbooks.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PlaybookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const playbook = playbooks.find((p) => p.slug === slug);

  if (!playbook) {
    return { title: "Playbook Not Found" };
  }

  const baseUrl = "https://opensession.co";
  return {
    title: playbook.title,
    description: playbook.excerpt,
    alternates: {
      canonical: `${baseUrl}/playbooks/${slug}`,
    },
    ...(playbook.thumbnail
      ? {
          openGraph: {
            title: playbook.title,
            description: playbook.excerpt,
            images: [
              {
                url: `${baseUrl}${playbook.thumbnail}`,
                width: 1200,
                height: 630,
                alt: playbook.title,
              },
            ],
          },
        }
      : {}),
  };
}

export default async function PlaybookPage({ params }: PlaybookPageProps) {
  const { slug } = await params;
  const playbook = playbooks.find((p) => p.slug === slug);

  if (!playbook) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20 md:py-32">
      <div className="container-main max-w-3xl">
        <h1 className="text-display text-4xl md:text-5xl mb-6">
          {playbook.title}
        </h1>
        <p className="text-fg-secondary text-lg mb-8">{playbook.excerpt}</p>
        {/* MDX rendering will be added in a future task */}
        <p className="text-fg-tertiary text-sm">
          Content rendering coming soon.
        </p>
      </div>
    </div>
  );
}
