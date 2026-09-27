import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

export function BecomeCreatorSuccessStep() {
  return (
    <div className="mx-auto max-w-[520px] rounded-[20px] border border-success/26 bg-surface/50 p-8 text-center">
      <span className="relative mx-auto inline-flex">
        <span className="absolute inset-0 animate-ping rounded-full bg-success/20" />
        <CheckCircle2 className="relative h-14 w-14 text-success" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-display text-[24px] font-semibold text-text-primary">Application Submitted!</h2>
      <p className="mt-1.5 font-sans text-[13px] leading-relaxed font-light text-text-secondary">
        The platform team will review your details. Creator tools unlock automatically once your account is
        approved — you&apos;ll see them the next time you open the app after approval.
      </p>

      <div className="mt-6 flex justify-center gap-2.5">
        <Link
          href={ROUTES.HOME}
          className="rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-2.5 font-sans text-[13px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
