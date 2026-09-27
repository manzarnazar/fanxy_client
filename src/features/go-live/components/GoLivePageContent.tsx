"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Radio } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { goLivePhaseChanged } from "@/store/slices/goLiveSlice";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { useGoLive } from "@/features/go-live/hooks/useGoLive";
import { GoLiveSetup } from "@/features/go-live/components/GoLiveSetup";
import { GoLiveStage } from "@/features/go-live/components/GoLiveStage";
import { GoLiveSummary } from "@/features/go-live/components/GoLiveSummary";

const PHASE_CHIP: Record<string, string> = {
  setup: "Ready to stream",
  live: "You are live now",
  summary: "Stream ended",
};

export function GoLivePageContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const isCreator = user?.role === "creator";

  const goLive = useGoLive();

  useEffect(() => {
    if (isBootstrapped && !isCreator) {
      router.replace(ROUTES.HOME);
    }
  }, [isBootstrapped, isCreator, router]);

  if (!isBootstrapped || !isCreator) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  const isLoading = goLive.initStatus === "loading" || goLive.initStatus === "idle";

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-6">
          <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-secondary/24 bg-secondary/10 px-3 py-0.5 font-sans text-[10.5px] font-medium tracking-wide text-secondary-light">
            <Radio className="h-3 w-3" aria-hidden="true" />
            {PHASE_CHIP[goLive.phase]}
          </span>
          <h1 className="font-display text-[28px] leading-tight font-semibold text-text-primary">Live Dashboard</h1>
          <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
            Start, manage and grow your live streaming audience.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
          </div>
        ) : goLive.initStatus === "failed" ? (
          <SectionStateMessage
            variant="error"
            title="Unable to load live settings"
            body={goLive.error ?? "Something went wrong. Please try again."}
          />
        ) : goLive.phase === "live" && goLive.zegoConfig && goLive.roomId && goLive.startedAt ? (
          <GoLiveStage
            config={goLive.zegoConfig}
            roomId={goLive.roomId}
            userName={user.fullName}
            startedAt={goLive.startedAt}
            ending={goLive.ending}
            onEnd={() => void goLive.end()}
          />
        ) : goLive.phase === "summary" && goLive.summary ? (
          <GoLiveSummary summary={goLive.summary} onNewStream={() => dispatch(goLivePhaseChanged("setup"))} />
        ) : (
          <GoLiveSetup
            gifts={goLive.gifts}
            starting={goLive.starting}
            liveConfigured={Boolean(goLive.zegoConfig && goLive.roomId)}
            onStart={() => void goLive.start()}
          />
        )}
      </div>
    </main>
  );
}
