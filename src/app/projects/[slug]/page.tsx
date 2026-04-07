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

  // Get adjacent projects for navigation
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <ProjectDetail
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
