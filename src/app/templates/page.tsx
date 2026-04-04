import { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download01, ArrowRight } from "@untitledui-pro/icons/line";
import { templates } from "@/data/templates";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Free design templates and resources for designers and developers.",
};

export default function TemplatesPage() {
  return (
    <div {...devProps('TemplatesPage')} className="py-20 md:py-32">
      <div className="container-main">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="section-label mb-4">Resources</p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl mb-6">
            Free Templates
          </h1>
          <p className="text-fg-secondary text-lg max-w-2xl">
            Design templates, starter kits, and resources to help you work
            faster and build better.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "group border border-border-secondary",
                "hover:border-border-primary transition-colors duration-200"
              )}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] bg-bg-tertiary">
                {template.comingSoon && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-bg-inverse text-fg-inverse text-xs font-medium">
                    Coming Soon
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-fg-tertiary text-sm">
                    {template.title}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="text-xs text-fg-tertiary font-mono uppercase mb-2 block">
                  {template.category}
                </span>
                <h3 className="text-heading text-xl mb-2">{template.title}</h3>
                <p className="text-fg-secondary text-sm mb-4">
                  {template.description}
                </p>

                {template.comingSoon ? (
                  <span className="text-fg-tertiary text-sm">
                    Sign up for updates →
                  </span>
                ) : (
                  <a
                    href={template.downloadUrl}
                    className={cn(
                      "inline-flex items-center gap-2",
                      "text-fg-brand text-sm font-medium",
                      "group-hover:underline"
                    )}
                  >
                    <Download01 className="w-4 h-4" />
                    Download Free
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
