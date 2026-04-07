interface ProjectResultsProps {
  results: string[];
}

export function ProjectResults({ results }: ProjectResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="bg-bg-secondary p-8 md:p-12">
      <h3 className="text-heading text-xl md:text-2xl mb-8 uppercase tracking-wider font-accent text-fg-primary">
        Results
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result, index) => (
          <li key={index} className="flex items-start gap-4">
            <span className="flex-shrink-0 w-6 h-6 bg-bg-brand-solid flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">{index + 1}</span>
            </span>
            <span className="text-fg-secondary text-base leading-relaxed">
              {result}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
