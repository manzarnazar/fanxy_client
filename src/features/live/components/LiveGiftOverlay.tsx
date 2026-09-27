"use client";

import Image from "next/image";
import { Gift } from "lucide-react";
import type { ReceivedGiftEvent } from "@/features/live/types/live.types";

interface LiveGiftOverlayProps {
  events: ReceivedGiftEvent[];
}

/**
 * Floating gift banners shown when a gift command arrives in the room
 * (equivalent of the Flutter GiftWidget; .svga animations render as the
 * gift's still image / icon since the web app has no SVGA player).
 */
export function LiveGiftOverlay({ events }: LiveGiftOverlayProps) {
  if (events.length === 0) return null;

  return (
    <div className="pointer-events-none absolute bottom-20 left-4 z-20 flex flex-col gap-2" aria-live="polite">
      {events.map((event) => (
        <div
          key={event.key}
          className="flex animate-[emptyFloat_2.4s_ease-in-out_infinite] items-center gap-2.5 rounded-full border border-primary/25 bg-surface-elevated/85 py-1.5 pr-4 pl-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/12">
            {event.gift.imageUrl && !event.gift.imageUrl.endsWith(".svga") ? (
              <Image src={event.gift.imageUrl} alt="" fill sizes="36px" className="object-contain" />
            ) : (
              <Gift className="h-4.5 w-4.5 text-primary-light" aria-hidden="true" />
            )}
          </span>
          <span className="font-sans text-[12px] text-text-primary">
            <span className="font-semibold">{event.fromUserName}</span> sent {event.gift.name}
          </span>
        </div>
      ))}
    </div>
  );
}
