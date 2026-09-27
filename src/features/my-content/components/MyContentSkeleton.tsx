import { ShimmerBlock } from "@/components/shared/ShimmerBlock";

export function MyContentSkeleton() {
  return (
    <div role="status" aria-label="Loading content" className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-primary/10 bg-surface/40">
          <ShimmerBlock className="h-[120px] w-full" />
          <div className="p-3.5">
            <ShimmerBlock className="mb-2 h-3 w-[70%] rounded-md" />
            <ShimmerBlock className="h-2.5 w-[45%] rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
