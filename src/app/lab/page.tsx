import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import { playbooks } from "@/data/playbooks";
import { freeResources } from "@/data/free-resources";
import { LabHero } from "@/components/lab/LabHero";
import { FreeResourcesGrid } from "@/components/resources/free-resources-grid";
import { BlogCard } from "@/components/blog/blog-card";

export const metadata: Metadata = {
  title: "The Lab",
  description:
    "Free design resources, articles, and playbooks from Open Session.",
};

export default function LabPage() {
  return (
    <div className="min-h-screen py-20 md:py-32">
      <div className="container-main">
        <LabHero />

        {/* Free Resources */}
        <section className="mb-20 md:mb-28">
          <div className="mb-8 md:mb-12">
            <p className="section-label mb-3">Free Resources</p>
            <h2 className="text-display text-2xl md:text-3xl">
              Built to Share
            </h2>
          </div>
          <FreeResourcesGrid resources={freeResources} />
        </section>

        {/* Blog Posts */}
        <section className="mb-20 md:mb-28">
          <div className="mb-8 md:mb-12">
            <p className="section-label mb-3">Writing</p>
            <h2 className="text-display text-2xl md:text-3xl">
              From the Studio
            </h2>
          </div>
          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-border-secondary">
              <p className="text-fg-secondary text-lg">
                Articles coming soon.
              </p>
            </div>
          )}
        </section>

        {/* Playbooks */}
        <section>
          <div className="mb-8 md:mb-12">
            <p className="section-label mb-3">Playbooks</p>
            <h2 className="text-display text-2xl md:text-3xl">
              Step-by-Step Guides
            </h2>
          </div>
          {playbooks.length === 0 ? (
            <div className="border border-border-secondary p-12 text-center">
              <p className="section-label mb-3">Coming Soon</p>
              <h3 className="text-heading text-xl mb-2">
                Playbooks in Production
              </h3>
              <p className="text-fg-secondary text-sm max-w-sm mx-auto">
                Step-by-step guides on brand strategy, design systems, and
                creative AI. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playbooks.map((playbook) => (
                <div key={playbook.id}>
                  <p className="text-fg-primary">{playbook.title}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
