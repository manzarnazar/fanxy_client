import {
  BadgeCheck,
  BarChart3,
  Crown,
  Gift,
  Lock,
  MessageCircle,
  Package,
  Radio,
  Wallet,
} from "lucide-react";

const BENEFITS = [
  { icon: Wallet, title: "Monthly Earnings", description: "Get paid from subscriptions, tips and gifts." },
  { icon: Lock, title: "Exclusive Content", description: "Publish premium posts only subscribers can see." },
  { icon: Radio, title: "Live Streaming", description: "Go live and earn gifts from your audience." },
  { icon: MessageCircle, title: "Private Chat", description: "Message your fans and subscribers directly." },
  { icon: Package, title: "Subscription Packages", description: "Create tiers with your own pricing." },
  { icon: BarChart3, title: "Creator Analytics", description: "Track revenue, subscribers and content stats." },
  { icon: Crown, title: "Creator Wallet", description: "Withdraw your coin earnings to your bank." },
  { icon: BadgeCheck, title: "Verified Badge", description: "Stand out with a verified creator profile." },
  { icon: Gift, title: "Gift System", description: "Receive gifts in live streams and chat." },
];

interface BecomeCreatorBenefitsStepProps {
  onStart: () => void;
}

export function BecomeCreatorBenefitsStep({ onStart }: BecomeCreatorBenefitsStepProps) {
  return (
    <div className="rounded-[20px] border border-primary/14 bg-surface/50 p-6">
      <h2 className="font-display text-xl font-semibold text-text-primary">Become a Premium Creator</h2>
      <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
        Turn your passion into a business with multiple ways to earn.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <div key={benefit.title} className="rounded-xl border border-primary/12 bg-surface-elevated/30 p-3.5">
            <span className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-md bg-primary/12 text-primary-light">
              <benefit.icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div className="font-sans text-[13px] font-semibold text-text-primary">{benefit.title}</div>
            <div className="mt-0.5 font-sans text-[11.5px] leading-relaxed font-light text-text-secondary/70">
              {benefit.description}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-6 w-full rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-3 font-sans text-[14px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5"
      >
        Start Application
      </button>
    </div>
  );
}
