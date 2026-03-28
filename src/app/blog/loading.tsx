export default function BlogLoading() {
  return (
    <div className="py-20 md:py-32">
      <div className="container-main">
        {/* Header skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="h-4 w-16 bg-bg-secondary rounded mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-2/3 bg-bg-secondary rounded mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-1/2 bg-bg-secondary rounded mx-auto animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[16/9] bg-bg-secondary rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-bg-secondary rounded animate-pulse" />
              <div className="h-6 w-full bg-bg-secondary rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-bg-secondary rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
