import { notFound } from "next/navigation";
import { Metadata } from "next";
import { projects } from "@/data/projects";
import { ProjectDetail } from "@/components/projects/project-detail";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const baseUrl = "https://opensession.co";
  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `${baseUrl}/projects/${slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      ...(project.thumbnail
        ? {
            images: [
              {
                url: `${baseUrl}${project.thumbnail}`,
                width: 1200,
                height: 630,
                alt: project.title,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Get other projects for the "Latest Projects" section
  const latestProjects = projects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <ProjectDetail
      project={project}
      latestProjects={latestProjects}
    />
  );
}
