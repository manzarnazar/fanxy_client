import Image from "next/image";
import { Play } from "lucide-react";

export function face(id: string) {
  return `https://images.unsplash.com/photo-${id}?w=120&h=120&fit=crop&crop=faces&q=80`;
}

export function cover(id: string) {
  return `https://images.unsplash.com/photo-${id}?w=420&h=240&fit=crop&q=80`;
}

export function LiveCreatorCard() {
  return (
    <div
      data-parallax
      data-depth="1.5"
      className="absolute top-[7%] right-[5.5%] z-[3] w-[250px] animate-[float_8s_ease-in-out_infinite] rounded-lg border border-primary/20 bg-surface/62 p-3.5 shadow-card backdrop-blur-2xl"
    >
      <div className="flex items-center gap-2.5">
        <div className="relative h-[46px] w-[46px] shrink-0">
          <Image
            src={face("1517841905240-472988babdf9")}
            alt=""
            fill
            sizes="46px"
            className="rounded-full border-2 border-live object-cover"
          />
          <span className="absolute right-[-2px] bottom-[-2px] h-[13px] w-[13px] rounded-full border-2 border-surface bg-live" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate font-display text-[17px] font-semibold text-text-primary">
              Velvet Rose
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-primary)" aria-hidden="true">
              <path d="M12 2l2.4 1.8 3 .2.9 2.9 2.1 2.1-1 2.9 1 2.9-2.1 2.1-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.6 15l1-2.9-1-2.9 2.1-2.1.9-2.9 3-.2z" />
              <path
                d="M8.5 12l2.3 2.3 4.2-4.6"
                fill="none"
                stroke="var(--color-surface)"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="font-sans text-[11px] font-light text-text-secondary/70">@velvetrose</div>
        </div>
        <span className="flex items-center gap-1 rounded-sm bg-live px-2 py-0.5 font-sans text-[8px] font-bold tracking-wide text-white">
          <span className="h-1 w-1 rounded-full bg-white" />
          LIVE
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-sans text-[11.5px] font-light text-text-secondary/80">
          2.1K watching now
        </span>
        <span className="font-sans text-[11.5px] font-semibold text-primary-light">$24.99</span>
      </div>
    </div>
  );
}

export function StoryPreviewCard() {
  return (
    <div
      data-parallax
      data-depth="2.1"
      className="absolute top-[10%] left-[5%] z-[3] animate-[floatReverse_7s_ease-in-out_infinite]"
    >
      <div className="flex items-center gap-2.5 rounded-lg border border-primary/18 bg-surface/60 py-2.5 pr-3.5 pl-2.5 shadow-card backdrop-blur-xl">
        <div
          className="h-12 w-12 rounded-full p-[2.5px]"
          style={{ background: "conic-gradient(from 210deg, #ff5b78, #c1a3ff, #7fd4f5, #ff5b78)" }}
        >
          <div className="relative h-full w-full rounded-full border-2 border-surface">
            <Image
              src={face("1500648767791-00dcc994a43e")}
              alt=""
              fill
              sizes="48px"
              className="rounded-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className="font-sans text-[12.5px] font-medium text-text-primary">New story</div>
          <div className="font-sans text-[11px] font-light text-text-secondary/70">
            Aria Sky · 2m ago
          </div>
        </div>
      </div>
    </div>
  );
}

export function SubscriptionCard() {
  return (
    <div
      data-parallax
      data-depth="1.8"
      className="absolute bottom-[9%] left-[4.5%] z-[3] w-[238px] animate-[float_9s_ease-in-out_infinite]"
    >
      <div className="relative overflow-hidden rounded-lg border-[1.5px] border-secondary-light/32 bg-[linear-gradient(150deg,rgba(226,29,91,.16),rgba(8,20,31,.66))] p-4 shadow-card backdrop-blur-2xl">
        <span className="absolute top-3.5 right-[-30px] w-[120px] rotate-[38deg] bg-gradient-to-r from-[#ff8a3d] to-[#e2455f] py-0.5 text-center font-sans text-[8px] font-bold tracking-wide text-white uppercase">
          Popular
        </span>
        <div className="flex items-center gap-2.5">
          <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#ff8fc0] to-[#c2185b] shadow-[0_10px_22px_-8px_rgba(226,69,120,.55)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <path d="M4 8l4 4 4-7 4 7 4-4-1.5 10h-13z" />
            </svg>
          </span>
          <div>
            <div className="font-display text-[18px] font-semibold text-text-primary">Premium VIP</div>
            <div className="font-sans text-[10.5px] font-light text-text-secondary/70">
              Private chat · exclusives
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="font-display text-[27px] font-semibold text-white">$24.99</span>
          <span className="font-sans text-[11px] font-light text-text-secondary/70">/ month</span>
        </div>
      </div>
    </div>
  );
}

export function LiveStreamCard() {
  return (
    <div
      data-parallax
      data-depth="2.4"
      className="absolute right-[8%] bottom-[16%] z-[3] w-[210px] animate-[floatReverse_8.5s_ease-in-out_infinite] overflow-hidden rounded-lg border border-primary/20 bg-surface/60 shadow-card backdrop-blur-xl"
    >
      <div className="relative h-[112px]">
        <Image
          src={cover("1503104834685-7205e8607eb9")}
          alt=""
          fill
          sizes="210px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04142033] to-surface/80" />
        <span className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-sm bg-live px-2 py-0.5 font-sans text-[8px] font-bold tracking-wide text-white">
          <span className="h-1 w-1 rounded-full bg-white" />
          LIVE
        </span>
        <span className="absolute top-2.5 right-2.5 rounded-sm bg-black/60 px-2 py-0.5 font-sans text-[9px] font-medium text-text-primary">
          👁 12.4K
        </span>
        <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary/90 shadow-[0_8px_20px_-6px_rgba(0,175,240,.8)]">
          <Play className="h-[18px] w-[18px] fill-[#03283a] text-[#03283a]" aria-hidden="true" />
        </span>
      </div>
      <div className="px-3.5 py-2.5">
        <div className="font-sans text-[12.5px] font-medium text-text-primary">Late Night Session</div>
        <div className="mt-0.5 font-sans text-[10.5px] font-light text-text-secondary/70">
          Nova Lane · Music
        </div>
      </div>
    </div>
  );
}

export function WalletPreviewCard() {
  return (
    <div
      data-parallax
      data-depth="1.9"
      className="absolute top-[39%] right-[7.5%] z-[3] w-[214px] animate-[float_9.5s_ease-in-out_infinite] overflow-hidden rounded-lg bg-[linear-gradient(150deg,#0b3550,#00AFF0_66%,#0085c7)] p-3.5 shadow-[0_26px_54px_-26px_rgba(0,0,0,.8),0_18px_40px_-22px_rgba(0,175,240,.5)]"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-sans text-[11px] font-normal text-white/85">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" aria-hidden="true">
            <path d="M3 8a2 2 0 0 1 2-2h12l2 3H5" strokeLinejoin="round" />
            <rect x="3" y="8" width="18" height="12" rx="2.5" />
            <circle cx="16.5" cy="14" r="1.5" fill="#fff" stroke="none" />
          </svg>
          Wallet Balance
        </span>
        <span className="rounded-md bg-white/18 px-2 py-0.5 font-sans text-[9px] font-medium text-white">USD</span>
      </div>
      <div className="mt-2.5 font-display text-[30px] leading-none font-semibold text-white">$4,286.50</div>
      <div className="mt-2 flex items-center gap-1.5 font-sans text-[10.5px] font-normal text-white/82">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path
            d="M12 7.2v9.6M14.4 9.2c-.6-1-1.6-1.4-2.6-1.4-1.4 0-2.4.8-2.4 1.9s.9 1.6 2.5 2 2.6.9 2.6 2.1-1.1 1.9-2.5 1.9c-1.1 0-2.1-.5-2.7-1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        12,480 coins
      </div>
    </div>
  );
}
