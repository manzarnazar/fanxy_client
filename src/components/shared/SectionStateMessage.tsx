import Link from "next/link";
import { AlertTriangle, Inbox, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

interface SectionStateMessageProps {
  variant: "empty" | "error";
  title: string;
  body: string;
  onRetry?: () => void;
  icon?: LucideIcon;
  minHeightClassName?: string;
  emptyHref?: string;
  emptyLabel?: string;
}

export function SectionStateMessage({
  variant,
  title,
  body,
  onRetry,
  icon: Icon = Inbox,
  minHeightClassName = "min-h-[420px]",
  emptyHref = ROUTES.HOME,
  emptyLabel = "Explore Home",
}: SectionStateMessageProps) {
  const isError = variant === "error";

  return (
    <div
      className={`flex ${minHeightClassName} flex-col items-center justify-center rounded-xl border border-primary/12 bg-surface/35 p-10 text-center`}
    >
      <div
        className={`mb-5.5 flex h-24 w-24 items-center justify-center rounded-xl motion-safe:animate-[emptyFloat_4.5s_ease-in-out_infinite] ${
          isError ? "bg-live/10 shadow-[inset_0_0_0_1.5px_rgba(255,64,88,.4)]" : "bg-primary/10 shadow-[inset_0_0_0_1.5px_rgba(0,175,240,.4)]"
        }`}
      >
        {isError ? (
          <AlertTriangle className="h-11 w-11 text-live" aria-hidden="true" />
        ) : (
          <Icon className="h-11 w-11 text-primary-light" aria-hidden="true" />
        )}
      </div>
      <h2 className="font-display text-3xl font-semibold text-text-primary">{title}</h2>
      <p className="mt-2.5 max-w-[400px] font-sans text-sm leading-relaxed font-light text-text-secondary">{body}</p>
      <div className="mt-6.5 flex gap-3">
        {isError && onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md bg-gradient-to-br from-primary-light to-primary px-6 py-3 font-sans text-[13.5px] font-semibold text-[#03283a] transition hover:-translate-y-0.5"
          >
            Try again
          </button>
        ) : (
          !isError && (
            <Link
              href={emptyHref}
              className="rounded-md bg-gradient-to-br from-primary-light to-primary px-6 py-3 font-sans text-[13.5px] font-semibold text-[#03283a] transition hover:-translate-y-0.5"
            >
              {emptyLabel}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
