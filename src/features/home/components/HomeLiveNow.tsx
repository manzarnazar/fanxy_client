import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Eye, Radio, User } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { formatCount } from "@/lib/formatter/count";
import type { LiveCreator } from "@/features/home/types/home.types";

interface HomeLiveNowProps {
  liveCreators: LiveCreator[];
}

export function HomeLiveNow({ liveCreators }: HomeLiveNowProps) {
  if (liveCreators.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-[17px] w-[17px] text-live" aria-hidden="true" />
          <h2 className="font-display text-xl font-semibold text-text-primary">Live now</h2>
        </div>
        <Link
          href={ROUTES.LIVE}
          className="flex items-center gap-1 font-sans text-xs font-medium text-primary-light hover:text-primary"
        >
          See all
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="flex gap-3.5 overflow-x-auto pb-1">
        {liveCreators.map((creator) => (
          <Link
            key={creator.streamId}
            href={creator.canView ? ROUTES.LIVE_WATCH(creator.roomId, creator.id) : ROUTES.SUBSCRIBE_PLANS(creator.id, creator.fullName)}
            className="w-[210px] shrink-0 overflow-hidden rounded-lg border border-primary/14 bg-surface/50 transition hover:-translate-y-1 hover:border-primary/35"
          >
            <div className="relative flex h-[118px] items-center justify-center bg-gradient-to-br from-primary-dark to-surface-elevated">
              {creator.avatarUrl ? (
                <Image src={creator.avatarUrl} alt="" fill sizes="210px" className="object-cover opacity-80" />
              ) : (
                <User className="h-10 w-10 text-text-secondary/40" aria-hidden="true" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-45% to-surface/85" />
              <span className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-sm bg-live px-2 py-0.5 font-sans text-[8px] font-bold tracking-wide text-white">
                <span className="h-1 w-1 rounded-full bg-white" />
                LIVE
              </span>
              <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-sm bg-black/45 px-2 py-0.5 font-sans text-[9px] font-semibold text-white backdrop-blur-sm">
                <Eye className="h-2.5 w-2.5 text-danger" aria-hidden="true" />
                {formatCount(creator.viewerCount)}
              </span>
              <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
                <div className="relative h-[38px] w-[38px] overflow-hidden rounded-full border-[1.5px] border-surface bg-surface-elevated">
                  {creator.avatarUrl && <Image src={creator.avatarUrl} alt="" fill sizes="38px" className="object-cover" />}
                </div>
                <span className="font-sans text-[13px] font-semibold text-white">{creator.fullName}</span>
              </div>
            </div>
            <div className="p-2.5">
              <div className="flex h-9 items-center justify-center gap-1.5 rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark font-sans text-[12.5px] font-semibold text-white">
                <Radio className="h-3.5 w-3.5" aria-hidden="true" />
                {creator.canView ? "Watch Live" : "Subscribe to watch"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
