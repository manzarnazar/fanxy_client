import { ShimmerBlock } from "@/components/shared/ShimmerBlock";

export function ReelsFeedSkeleton() {
  return (
    <div role="status" aria-label="Loading reels" className="flex flex-col items-center gap-3">
      <ShimmerBlock className="aspect-[9/16] w-full max-w-[378px] rounded-xl" />
      <div className="mt-3.5 w-full max-w-[420px]">
        <ShimmerBlock className="mb-2.5 h-5.5 w-[70%] rounded-md" />
        <ShimmerBlock className="mb-1.5 h-3.5 w-full rounded-md" />
        <ShimmerBlock className="h-3.5 w-[85%] rounded-md" />
      </div>
    </div>
  );
}
