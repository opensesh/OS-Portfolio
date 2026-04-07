import Image from "next/image";
import { ProjectImage } from "@/types/project";

interface ProjectGalleryProps {
  images: ProjectImage[];
  layout?: "single" | "grid-2";
}

export function ProjectGallery({ images, layout }: ProjectGalleryProps) {
  if (images.length === 0) return null;

  const effectiveLayout = layout ?? (images.length >= 2 ? "grid-2" : "single");

  if (effectiveLayout === "grid-2") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img) => (
          <div
            key={img.src}
            className="relative aspect-[4/3] bg-bg-tertiary overflow-hidden"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {images.map((img) => (
        <div
          key={img.src}
          className="relative aspect-[16/9] bg-bg-tertiary overflow-hidden"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>
      ))}
    </div>
  );
}
