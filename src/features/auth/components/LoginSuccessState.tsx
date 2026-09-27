import { CheckCircle2, Loader2 } from "lucide-react";

export function LoginSuccessState() {
  return (
    <div role="status" className="animate-[rise_0.4s_ease_both] py-3.5 text-center">
      <div className="relative mx-auto mb-[22px] h-[90px] w-[90px]">
        <span className="absolute inset-0 animate-[glow_2.4s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(127,230,165,.35),transparent_66%)]" />
        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-success to-success-strong shadow-[0_20px_40px_-16px_rgba(47,174,116,.6)]">
          <CheckCircle2 className="h-[46px] w-[46px] text-[#053421]" strokeWidth={2} aria-hidden="true" />
        </div>
      </div>
      <h2 className="font-display text-[30px] font-semibold text-text-primary">Welcome back</h2>
      <p className="mt-2 text-sm font-light text-text-secondary">Loading your experience…</p>
      <div className="mt-[22px] inline-flex items-center gap-2.5 rounded-md border border-primary/22 bg-primary/10 px-4 py-2.5">
        <span className="text-[12.5px] text-text-secondary">Redirecting…</span>
        <Loader2 className="h-[15px] w-[15px] animate-spin text-primary" aria-hidden="true" />
      </div>
    </div>
  );
}
