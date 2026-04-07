import { FreeResource } from "@/types/free-resources";
import { FreeResourceCard } from "./free-resource-card";
import { devProps } from "@/utils/dev-props";

interface FreeResourcesGridProps {
  resources: FreeResource[];
}

export function FreeResourcesGrid({ resources }: FreeResourcesGridProps) {
  if (resources.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-fg-secondary text-lg">
          Resources are coming soon. Check back later.
        </p>
      </div>
    );
  }

  return (
    <div
      {...devProps("FreeResourcesGrid")}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {resources.map((resource) => (
        <FreeResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
