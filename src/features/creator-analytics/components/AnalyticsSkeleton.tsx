export function AnalyticsSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mb-4.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-[104px] animate-pulse rounded-xl border border-primary/10 bg-surface/40" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="h-[260px] animate-pulse rounded-xl border border-primary/10 bg-surface/40" />
        <div className="h-[260px] animate-pulse rounded-xl border border-primary/10 bg-surface/40" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="h-[220px] animate-pulse rounded-xl border border-primary/10 bg-surface/40" />
        <div className="h-[220px] animate-pulse rounded-xl border border-primary/10 bg-surface/40" />
      </div>
    </div>
  );
}
