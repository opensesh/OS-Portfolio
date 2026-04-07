import { ProjectSection, ProjectImage } from "@/types/project";
import { ProjectGallery } from "./project-gallery";

interface ProjectSectionProps {
  section: ProjectSection;
  images: ProjectImage[];
}

export function ProjectSectionBlock({ section, images }: ProjectSectionProps) {
  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h2 className="text-heading text-2xl md:text-3xl mb-3">
          {section.heading}
        </h2>
        <p className="text-fg-primary font-semibold text-lg md:text-xl mb-4">
          {section.headline}
        </p>
        <p className="text-fg-secondary text-base md:text-lg leading-relaxed">
          {section.body}
        </p>
      </div>

      {/* Section images */}
      {images.length > 0 && <ProjectGallery images={images} />}
    </div>
  );
}
