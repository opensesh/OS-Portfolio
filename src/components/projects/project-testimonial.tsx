import { ProjectTestimonial } from "@/types/project";

interface ProjectTestimonialProps {
  testimonials: ProjectTestimonial[];
}

export function ProjectTestimonialBlock({ testimonials }: ProjectTestimonialProps) {
  if (testimonials.length === 0) return null;

  return (
    <div className="space-y-8">
      {testimonials.map((testimonial, index) => (
        <blockquote
          key={index}
          className="border-l-4 border-bg-brand-solid pl-8 py-2"
        >
          <p className="text-fg-primary text-xl md:text-2xl italic leading-relaxed mb-4">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <footer className="text-fg-secondary text-sm">
            <span className="font-semibold text-fg-primary">
              {testimonial.author}
            </span>
            {testimonial.role && (
              <span className="text-fg-tertiary">, {testimonial.role}</span>
            )}
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
