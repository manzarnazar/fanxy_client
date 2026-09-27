import Link from "next/link";
import { Radio } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { useGreeting } from "@/features/home/hooks/useGreeting";

interface HomeHeroWelcomeProps {
  userName: string | null;
  isCreator: boolean;
}

export function HomeHeroWelcome({ userName, isCreator }: HomeHeroWelcomeProps) {
  const greeting = useGreeting();

  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-[linear-gradient(135deg,#0b3550,#062033_55%,#0a1a2e)] px-6.5 py-6">
      <div className="pointer-events-none absolute -top-[50px] -right-5 h-[220px] w-[220px] animate-[float_14s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(0,175,240,.28),transparent_66%)]" />
      <div className="pointer-events-none absolute right-[130px] -bottom-[70px] h-[180px] w-[180px] animate-[floatReverse_17s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(226,29,91,.16),transparent_66%)]" />

      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-sans text-[13px] font-light text-[#dceefa]/70">
            {greeting}
          </div>
          <h1 className="mt-0.5 font-display text-[34px] leading-[1.05] font-semibold text-white">
            {userName
              ? `Welcome back, ${userName}`
              : "Discover premium creators on Fanxy"}
          </h1>
          {!userName && (
            <p className="mt-2 max-w-[26rem] font-sans text-sm font-light text-[#dceefa]/75">
              Sign in to see your personalized feed, subscriptions and wallet.
            </p>
          )}
        </div>

        {userName && isCreator && (
          <Link
            href={ROUTES.GO_LIVE}
            className="flex items-center gap-2 rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark px-5.5 py-3.5 font-sans text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(226,29,91,.7)] transition hover:-translate-y-0.5"
          >
            <Radio className="h-[17px] w-[17px]" aria-hidden="true" />
            Go Live
          </Link>
        )}

        {!userName && (
          <div className="flex shrink-0 gap-2.5">
            <Link
              href={ROUTES.SIGN_IN}
              className="rounded-md bg-gradient-to-br from-primary-light to-primary px-4 py-2.5 font-sans text-sm font-semibold text-[#03283a] transition hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
