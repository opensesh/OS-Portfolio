export default function ProjectsLoading() {
  return (
    <div className="py-20 md:py-32">
      <div className="container-main">
        {/* Header skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="h-4 w-24 bg-bg-secondary rounded mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-3/4 bg-bg-secondary rounded mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-2/3 bg-bg-secondary rounded mx-auto animate-pulse" />
        </div>

        {/* Filter skeleton */}
        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 w-24 bg-bg-secondary rounded animate-pulse"
            />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/3] bg-bg-secondary rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-bg-secondary rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-bg-secondary rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
