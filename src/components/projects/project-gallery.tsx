import Image from "next/image";
import { ProjectImage } from "@/types/project";

interface ProjectGalleryProps {
  images: ProjectImage[];
  sectionKey?: string;
}

export function ProjectGallery({ images, sectionKey }: ProjectGalleryProps) {
  if (images.length === 0) return null;

  // Challenge: 2x2 grid (4 images, two rows of two)
  if (sectionKey === "challenge" && images.length >= 4) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.slice(0, 4).map((img) => (
          <div
            key={img.src}
            className="relative aspect-[4/3] bg-bg-tertiary overflow-hidden rounded-lg"
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

  // Solution: 1 full-width + 2 side-by-side below
  if (sectionKey === "solution" && images.length >= 3) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-[16/9] bg-bg-tertiary overflow-hidden rounded-lg">
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.slice(1, 3).map((img) => (
            <div
              key={img.src}
              className="relative aspect-[4/3] bg-bg-tertiary overflow-hidden rounded-lg"
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
      </div>
    );
  }

  // Fallback: stack all images full-width
  return (
    <div className="space-y-4">
      {images.map((img) => (
        <div
          key={img.src}
          className="relative aspect-[16/9] bg-bg-tertiary overflow-hidden rounded-lg"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>
      ))}
    </div>
  );
}
