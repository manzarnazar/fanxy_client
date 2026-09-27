import Link from "next/link";
import { CheckCircle2, Clock, Wallet } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { LiveSummary } from "@/features/go-live/types/go-live.types";

interface GoLiveSummaryProps {
  summary: LiveSummary;
  onNewStream: () => void;
}

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function GoLiveSummary({ summary, onNewStream }: GoLiveSummaryProps) {
  return (
    <div className="mx-auto max-w-[560px] rounded-[20px] border border-success/26 bg-surface/50 p-8 text-center">
      <span className="relative mx-auto inline-flex">
        <span className="absolute inset-0 animate-ping rounded-full bg-success/20" />
        <CheckCircle2 className="relative h-14 w-14 text-success" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-display text-[26px] font-semibold text-text-primary">Great stream!</h2>
      <p className="mt-1 font-sans text-[13px] font-light text-text-secondary">
        Your live has ended. Gifts sent during the stream are already in your wallet.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-primary/12 bg-surface-elevated/40 px-5 py-3.5">
          <Clock className="h-5 w-5 text-primary-light" aria-hidden="true" />
          <div className="text-left">
            <div className="font-display text-xl font-semibold text-text-primary">{formatDuration(summary.durationSeconds)}</div>
            <div className="font-sans text-[10.5px] font-light text-text-secondary/70">Live duration</div>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-2.5">
        <Link
          href={ROUTES.WALLET}
          className="flex items-center gap-1.5 rounded-md border border-primary/18 bg-surface/60 px-5 py-2.5 font-sans text-[13px] font-medium text-text-secondary transition hover:bg-primary/10"
        >
          <Wallet className="h-4 w-4" aria-hidden="true" />
          View Wallet
        </Link>
        <button
          type="button"
          onClick={onNewStream}
          className="rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark px-5 py-2.5 font-sans text-[13px] font-semibold text-white transition hover:-translate-y-0.5"
        >
          New Stream
        </button>
      </div>
    </div>
  );
}
