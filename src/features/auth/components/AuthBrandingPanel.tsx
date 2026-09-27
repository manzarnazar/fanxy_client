import { AppLogo } from "@/components/shared/AppLogo";
import { BrandingPanelShell } from "@/features/auth/components/branding/BrandingPanelShell";
import {
  LiveCreatorCard,
  LiveStreamCard,
  StoryPreviewCard,
  SubscriptionCard,
} from "@/features/auth/components/branding/FloatingCards";

const STATS = [
  { value: "50K+", label: "Creators" },
  { value: "2M+", label: "Subscribers" },
  { value: "100M+", label: "Content Views" },
  { value: "500K+", label: "Live Sessions" },
];

export function AuthBrandingPanel() {
  return (
    <BrandingPanelShell
      flexGrow={1.14}
      floatingCards={
        <>
          <LiveCreatorCard />
          <StoryPreviewCard />
          <SubscriptionCard />
          <LiveStreamCard />
        </>
      }
    >
      <div className="flex items-center gap-3">
        {/* <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_28%,#052436,#02101a)] shadow-[inset_0_0_0_1.5px_rgba(0,175,240,.7),0_0_22px_-6px_rgba(0,175,240,.6)]"> */}
        <AppLogo size={40} />
        {/* </span> */}
        <span className="bg-gradient-to-b from-white to-primary-light bg-clip-text font-display text-[27px] font-medium tracking-wide text-transparent">
          Fanxy
        </span>
      </div>

      <div className="mt-7 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5">
        <span className="h-1.5 w-1.5 animate-[glow_1.8s_ease-in-out_infinite] rounded-full bg-success shadow-[0_0_8px_var(--color-success)]" />
        <span className="font-sans text-[11px] font-medium tracking-wide text-primary-light">
          The premium creator platform
        </span>
      </div>

      <h1 className="mt-5 text-pretty font-display text-[52px] leading-[1.03] font-semibold tracking-tight text-white xl:text-[62px]">
        Welcome back to
        <br />
        Fanxy
      </h1>

      <p className="mt-[18px] max-w-[30rem] font-sans text-[17px] leading-relaxed font-light text-[#dceefa]/80">
        Discover premium creators, exclusive content, live streaming and private
        communities — all in one cinematic space.
      </p>

      <div className="mt-9 flex">
        {STATS.map((stat, index) => (
          <div
            key={stat.label}
            className={
              index === 0
                ? "flex-1 px-5"
                : "flex-1 border-l border-primary/20 px-5"
            }
          >
            <div className="font-display text-[34px] leading-none font-semibold text-white">
              {stat.value}
            </div>
            <div className="mt-1.5 font-sans text-xs font-light tracking-wide text-primary-light/70">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </BrandingPanelShell>
  );
}
