import { Metadata } from "next";
import { playbooks } from "@/data/playbooks";

export const metadata: Metadata = {
  title: "Playbooks | Open Session",
  description: "Step-by-step design playbooks for founders and creative teams.",
};

export default function PlaybooksPage() {
  return (
    <div className="min-h-screen py-20 md:py-32">
      <div className="container-main">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="section-label mb-4">Playbooks</p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl mb-6">
            Design Playbooks
          </h1>
          <p className="text-fg-secondary text-lg max-w-2xl">
            Step-by-step playbooks for building brands, products, and systems
            that scale.
          </p>
        </div>

        {/* Content */}
        {playbooks.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-fg-secondary text-lg">
              Playbooks are coming soon. Check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playbooks.map((playbook) => (
              <div key={playbook.id}>
                <p>{playbook.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
