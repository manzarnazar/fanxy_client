import { ShimmerBlock } from "@/components/shared/ShimmerBlock";

export function CreatorProfileSkeleton() {
  return (
    <div role="status" aria-label="Loading creator profile" className="mx-auto max-w-[720px] px-5 py-5">
      <div className="overflow-hidden rounded-2xl border border-primary/13">
        <ShimmerBlock className="h-[220px] w-full" />
        <div className="bg-surface-elevated px-6 pb-5.5">
          <div className="-mt-13 flex items-end gap-4">
            <ShimmerBlock className="h-28 w-28 rounded-full border-4 border-surface-elevated" />
            <div className="flex-1 pb-2">
              <ShimmerBlock className="mb-2 h-6 w-48 rounded-md" />
              <ShimmerBlock className="h-3.5 w-64 rounded-md" />
            </div>
          </div>
          <ShimmerBlock className="mt-4.5 h-20 w-full rounded-xl" />
          <ShimmerBlock className="mt-4 h-[46px] w-full rounded-md" />
        </div>
      </div>
      <ShimmerBlock className="mt-4.5 h-24 w-full rounded-xl" />
    </div>
  );
}
