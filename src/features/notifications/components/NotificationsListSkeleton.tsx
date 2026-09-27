import { ShimmerBlock } from "@/components/shared/ShimmerBlock";

export function NotificationsListSkeleton() {
  return (
    <div role="status" aria-label="Loading notifications" className="flex flex-col gap-2.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3.5 rounded-xl border border-primary/10 bg-surface/40 p-3.5">
          <ShimmerBlock className="h-11.5 w-11.5 shrink-0 rounded-full" />
          <div className="flex-1">
            <ShimmerBlock className="mb-2 h-3.5 w-[60%] rounded-md" />
            <ShimmerBlock className="h-2.5 w-[85%] rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
