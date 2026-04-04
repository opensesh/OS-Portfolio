import { Metadata } from "next";
import { Check, ArrowRight } from "@untitledui-pro/icons/line";
import { Button } from "@/components/shared/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Workshop",
  description:
    "Intensive design workshops and consulting sessions to elevate your brand.",
};

const workshops = [
  {
    id: "brand-sprint",
    title: "Brand Sprint",
    description:
      "A focused 2-day workshop to define your brand strategy, positioning, and visual direction.",
    duration: "2 days",
    price: "Starting at $5,000",
    features: [
      "Brand positioning workshop",
      "Competitive analysis",
      "Visual direction exploration",
      "Strategy documentation",
      "Action plan & next steps",
    ],
    popular: true,
  },
  {
    id: "design-system",
    title: "Design System Workshop",
    description:
      "Build the foundation for a scalable design system with your team.",
    duration: "3 days",
    price: "Starting at $7,500",
    features: [
      "Component audit",
      "Token architecture",
      "Documentation setup",
      "Team training",
      "Implementation roadmap",
    ],
    popular: false,
  },
  {
    id: "advisory",
    title: "Design Advisory",
    description:
      "Ongoing strategic guidance for your design team and product.",
    duration: "Monthly",
    price: "Starting at $3,000/mo",
    features: [
      "Weekly strategy calls",
      "Design reviews",
      "Team mentorship",
      "Resource recommendations",
      "Priority support",
    ],
    popular: false,
  },
];

export default function WorkshopPage() {
  return (
    <div className="py-20 md:py-32">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="section-label mb-4">Workshop</p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl mb-6 max-w-3xl mx-auto">
            Intensive Design Sessions
          </h1>
          <p className="text-fg-secondary text-lg max-w-2xl mx-auto">
            Collaborative workshops designed to solve specific challenges and
            elevate your team&apos;s design capabilities.
          </p>
        </div>

        {/* Workshop Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className={cn(
                "relative border border-border-secondary p-8",
                "flex flex-col",
                workshop.popular && "border-brand-500"
              )}
            >
              {workshop.popular && (
                <div className="absolute -top-3 left-8 px-3 py-1 bg-bg-brand-solid text-white text-xs font-medium">
                  Most Popular
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <span className="text-xs text-fg-tertiary font-mono uppercase block mb-2">
                  {workshop.duration}
                </span>
                <h3 className="text-heading text-2xl mb-2">{workshop.title}</h3>
                <p className="text-fg-secondary text-sm">
                  {workshop.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-display text-2xl">{workshop.price}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {workshop.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-fg-secondary"
                  >
                    <Check className="w-4 h-4 text-fg-brand flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                href="/contact"
                variant={workshop.popular ? "primary" : "secondary"}
                className="w-full"
              >
                Book a Call
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Custom Section */}
        <div className="mt-20 p-8 md:p-12 bg-bg-secondary text-center">
          <h2 className="text-heading text-2xl md:text-3xl mb-4">
            Need something custom?
          </h2>
          <p className="text-fg-secondary mb-6 max-w-xl mx-auto">
            We design custom workshops tailored to your team&apos;s specific
            needs and challenges. Let&apos;s talk about what you&apos;re trying
            to solve.
          </p>
          <Button href="/contact">
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
