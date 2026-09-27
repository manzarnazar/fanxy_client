import { ShimmerBlock } from "@/components/shared/ShimmerBlock";

export function PackagesSkeleton() {
  return (
    <div role="status" aria-label="Loading packages" className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-primary/10 bg-surface/40 p-4">
          <ShimmerBlock className="h-11 w-11 rounded-md" />
          <ShimmerBlock className="mt-4 h-3 w-[70%] rounded-md" />
          <ShimmerBlock className="mt-2 h-5 w-[45%] rounded-md" />
        </div>
      ))}
    </div>
  );
}
