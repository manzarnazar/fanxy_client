import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { TRUST_STATS } from "@/features/landing/constants/landing";

export function LandingTrustStats() {
  return (
    <div className="mx-auto grid max-w-[760px] grid-cols-2 gap-6 rounded-md border border-white/12 bg-white/6 px-6 py-6 backdrop-blur-sm sm:grid-cols-4">
      {TRUST_STATS.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
          <AnimatedNumber value={stat.value} className="font-display text-[26px] font-semibold text-white" />
          <span className="font-sans text-[12px] font-light text-white/60">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
