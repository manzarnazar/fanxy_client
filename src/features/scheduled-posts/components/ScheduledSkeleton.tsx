export function ScheduledSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mb-4.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[104px] animate-pulse rounded-xl border border-primary/10 bg-surface/40" />
        ))}
      </div>
      <div className="h-[420px] animate-pulse rounded-xl border border-primary/10 bg-surface/40" />
    </div>
  );
}
