// TEMPLATE: replace with your content

export interface ProjectSection {
  heading: string;     // e.g. "The Challenge"
  headline: string;    // Bold intro sentence
  body: string;        // Full paragraph
}

export interface ProjectImage {
  src: string;         // e.g. /images/projects/iterra/filename.jpg
  alt: string;
  context: 'hero' | 'gallery' | 'mockup';
  section?: 'challenge' | 'solution' | 'impact';
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  tags: string[];
  // --- enriched fields ---
  categories: string[];           // replaces single category enum
  services: string[];
  duration?: string;
  buttonText?: string;
  buttonHref?: string;
  sections: ProjectSection[];
  images: ProjectImage[];
  testimonials?: ProjectTestimonial[];
  results?: string[];
}

export type ViewMode = "carousel" | "two-column" | "grid";
