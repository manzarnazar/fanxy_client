import { ShimmerBlock } from "@/components/shared/ShimmerBlock";

export function MessagesConversationsSkeleton() {
  return (
    <div role="status" aria-label="Loading conversations" className="flex flex-col gap-2.5">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="flex items-center gap-2.5 rounded-xl p-2.5">
          <ShimmerBlock className="h-12 w-12 shrink-0 rounded-full" />
          <div className="flex-1">
            <ShimmerBlock className="mb-2 h-3 w-[55%] rounded-md" />
            <ShimmerBlock className="h-2.5 w-[80%] rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
