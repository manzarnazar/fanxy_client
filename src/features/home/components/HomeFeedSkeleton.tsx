import { ShimmerBlock } from "@/components/shared/ShimmerBlock";

export function HomeFeedSkeleton() {
  return (
    <div role="status" aria-label="Loading posts" className="rounded-xl border border-primary/10 bg-surface/40 p-4">
      <div className="mb-3.5 flex items-center gap-2.5">
        <ShimmerBlock className="h-11 w-11 rounded-full" />
        <div className="flex-1">
          <ShimmerBlock className="mb-1.5 h-[13px] w-[130px] rounded-md" />
          <ShimmerBlock className="h-2.5 w-20 rounded-md" />
        </div>
      </div>
      <ShimmerBlock className="h-[240px] w-full rounded-md" />
    </div>
  );
}
