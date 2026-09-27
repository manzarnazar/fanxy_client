import { ShimmerBlock } from "@/components/shared/ShimmerBlock";

export function SubscribersSkeleton() {
  return (
    <div role="status" aria-label="Loading subscribers" className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-primary/10 bg-surface/40 p-4">
          <div className="flex flex-col items-center">
            <ShimmerBlock className="h-16 w-16 rounded-full" />
            <ShimmerBlock className="mt-3 h-3 w-[70%] rounded-md" />
            <ShimmerBlock className="mt-2 h-2.5 w-[45%] rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
