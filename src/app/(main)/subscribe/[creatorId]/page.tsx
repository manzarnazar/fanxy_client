import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { SubscribePlansContent } from "@/features/checkout/components/SubscribePlansContent";

export const metadata: Metadata = {
  title: "Subscribe | Fanxy",
  description: "Choose a subscription plan and unlock exclusive content.",
};

export default async function SubscribePlansPage({
  params,
}: {
  params: Promise<{ creatorId: string }>;
}) {
  const { creatorId } = await params;
  return (
    <Suspense
      fallback={
        <main className="flex min-w-0 flex-1 items-center justify-center">
          <Loader2
            className="h-8 w-8 animate-spin text-primary-light"
            aria-hidden="true"
          />
        </main>
      }
    >
      <SubscribePlansContent creatorId={creatorId} />
    </Suspense>
  );
}
