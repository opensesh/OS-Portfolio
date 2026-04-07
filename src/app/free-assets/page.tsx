import { Metadata } from "next";
import { freeResources } from "@/data/free-resources";
import { FreeResourcesGrid } from "@/components/resources/free-resources-grid";

export const metadata: Metadata = {
  title: "Free Assets | Open Session",
  description:
    "Free design templates, tools, and resources from Open Session. Open-source and ready to use.",
};

export default function FreeAssetsPage() {
  return (
    <div className="min-h-screen py-20 md:py-32">
      <div className="container-main">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="section-label mb-4">Free Assets</p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl mb-6">
            Built to Share
          </h1>
          <p className="text-fg-secondary text-lg max-w-2xl">
            Templates, tools, and frameworks we&apos;ve built and open-sourced.
            Free to use, adapt, and make your own.
          </p>
        </div>

        {/* Resources grid */}
        <FreeResourcesGrid resources={freeResources} />
      </div>
    </div>
  );
}
