"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gift } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { sendLiveGift } from "@/store/slices/liveSlice";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { toast } from "@/lib/utils/toast";
import { ROUTES } from "@/lib/constants/routes";
import { useLiveWatch } from "@/features/live/hooks/useLiveWatch";
import { LiveAudienceStage } from "@/features/live/components/LiveAudienceStage";
import { LiveGiftTray } from "@/features/live/components/LiveGiftTray";
import { LiveGiftOverlay } from "@/features/live/components/LiveGiftOverlay";
import type { LiveGift, ReceivedGiftEvent } from "@/features/live/types/live.types";

const GIFT_BANNER_MS = 4000;

interface LiveWatchContentProps {
  roomId: string;
  hostId: string;
}

export function LiveWatchContent({ roomId, hostId }: LiveWatchContentProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, profile, error, access, zegoConfig, gifts, coinBalance, giftSending } = useLiveWatch(hostId);

  const [trayOpen, setTrayOpen] = useState(false);
  const [giftEvents, setGiftEvents] = useState<ReceivedGiftEvent[]>([]);
  const eventKeyRef = useRef(0);
  const giftsRef = useRef(gifts);
  useEffect(() => {
    giftsRef.current = gifts;
  }, [gifts]);

  const pushGiftEvent = useCallback((gift: LiveGift, fromUserName: string) => {
    const key = ++eventKeyRef.current;
    setGiftEvents((events) => [...events, { key, gift, fromUserName }]);
    window.setTimeout(() => {
      setGiftEvents((events) => events.filter((event) => event.key !== key));
    }, GIFT_BANNER_MS);
  }, []);

  // Gift broadcasts arrive as in-room commands whose gift_count carries the
  // gift id (the mobile app's convention — golive.dart onInRoomCommandReceived).
  const handleRoomCommand = useCallback(
    (command: string) => {
      try {
        const payload = JSON.parse(command) as { gift_count?: number | string; user_name?: string };
        if (payload.gift_count === undefined) return;
        const gift = giftsRef.current.find((item) => item.id === String(payload.gift_count));
        if (gift) pushGiftEvent(gift, payload.user_name?.trim() || "Someone");
      } catch {
        // Non-gift room commands are ignored.
      }
    },
    [pushGiftEvent],
  );

  const handleLiveEnded = useCallback(() => {
    toast.info("The live stream has ended.");
    router.push(ROUTES.LIVE);
  }, [router]);

  const handleSendGift = (gift: LiveGift) => {
    if (!user || !profile || !zegoConfig) return;
    if (gift.coin > 0 && coinBalance !== null && coinBalance < gift.coin) {
      toast.warning("Not enough coins. Recharge your wallet to send this gift.");
      router.push(ROUTES.WALLET);
      return;
    }
    dispatch(
      sendLiveGift({
        broadcast: {
          config: zegoConfig,
          roomId,
          userFirebaseId: user.firebaseId ?? user.id,
          userName: user.fullName,
          giftId: gift.id,
        },
        toUserId: profile.id,
        gift,
      }),
    )
      .unwrap()
      .then(() => {
        setTrayOpen(false);
        pushGiftEvent(gift, "You");
        toast.success(`${gift.name} sent!`);
      })
      .catch(() => undefined);
  };

  const stateWrapper = (children: React.ReactNode) => (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5">
      <div className="mx-auto max-w-[880px]">{children}</div>
    </main>
  );

  if (access === "checking") {
    return stateWrapper(
      <div className="h-[62vh] min-h-[380px] animate-pulse rounded-2xl bg-surface" role="status" aria-label="Loading stream" />,
    );
  }

  if (access === "failed") {
    return stateWrapper(
      <SectionStateMessage
        variant="error"
        title="Couldn't open this stream"
        body={error ?? "Something went wrong. Please try again."}
        minHeightClassName="min-h-[60vh]"
      />,
    );
  }

  if (access === "needs-auth") {
    return stateWrapper(
      <SectionStateMessage
        variant="empty"
        title="Sign in to watch live"
        body="Live streams are available to signed-in members."
        emptyHref={ROUTES.SIGN_IN}
        emptyLabel="Sign In"
        minHeightClassName="min-h-[60vh]"
      />,
    );
  }

  if (access === "needs-subscription" || access === "needs-upgrade") {
    return stateWrapper(
      <SectionStateMessage
        variant="empty"
        title={access === "needs-subscription" ? `Subscribe to watch ${profile?.name ?? "this creator"}` : "Upgrade your plan to watch live"}
        body={
          access === "needs-subscription"
            ? "This live stream is for subscribers only."
            : "Your current plan doesn't include live-stream access. Pick a plan that does."
        }
        emptyHref={profile ? ROUTES.SUBSCRIBE_PLANS(profile.id, profile.name) : ROUTES.LIVE}
        emptyLabel="View plans"
        minHeightClassName="min-h-[60vh]"
      />,
    );
  }

  if (!zegoConfig) {
    return stateWrapper(
      <SectionStateMessage
        variant="error"
        title="Live streaming isn't configured"
        body="The live credentials (live_appid / live_serversecret) are missing from the app settings. Add them in the admin panel."
        minHeightClassName="min-h-[60vh]"
      />,
    );
  }

  if (!user) return null;

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[880px]">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex animate-pulse items-center gap-1.5 rounded-full bg-gradient-to-br from-live to-secondary-dark px-3 py-1 font-sans text-[11px] font-bold tracking-wide text-white uppercase">
              Live
            </span>
            {profile && (
              <Link
                href={ROUTES.CREATOR_PROFILE(profile.id)}
                className="font-display text-lg font-semibold text-text-primary hover:text-primary-light"
              >
                {profile.name}
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => setTrayOpen(true)}
            className="flex items-center gap-2 rounded-md border border-accent-gold/35 bg-accent-gold/10 px-4.5 py-2.5 font-sans text-[12.5px] font-semibold text-accent-gold transition-colors hover:bg-accent-gold/16"
          >
            <Gift className="h-4 w-4" aria-hidden="true" />
            Send gift
          </button>
        </div>

        <div className="relative">
          <LiveAudienceStage
            config={zegoConfig}
            roomId={roomId}
            userId={user.firebaseId ?? user.id}
            userName={user.fullName}
            onLiveEnded={handleLiveEnded}
            onRoomCommand={handleRoomCommand}
          />
          <LiveGiftOverlay events={giftEvents} />
        </div>
      </div>

      <LiveGiftTray
        open={trayOpen}
        gifts={gifts}
        coinBalance={coinBalance}
        sending={giftSending}
        onSend={handleSendGift}
        onClose={() => setTrayOpen(false)}
      />
    </main>
  );
}
