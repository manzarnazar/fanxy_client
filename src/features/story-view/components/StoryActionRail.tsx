import Link from "next/link";
import { Flag, Mail, Share2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";

interface StoryActionRailProps {
  onShare: () => void;
  onReport: () => void;
}

export function StoryActionRail({ onShare, onReport }: StoryActionRailProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <RailButton label="Share" onClick={onShare}>
        <Share2 className="h-[22px] w-[22px]" aria-hidden="true" />
      </RailButton>
      <Link
        href={ROUTES.MESSAGES}
        title="Message"
        aria-label="Message creator"
        className="flex h-[50px] w-[50px] items-center justify-center rounded-xl border border-white/16 bg-surface-elevated/50 text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-primary/16"
      >
        <Mail className="h-[22px] w-[22px]" aria-hidden="true" />
      </Link>
      <RailButton label="Report" onClick={onReport}>
        <Flag className="h-[22px] w-[22px]" aria-hidden="true" />
      </RailButton>
    </div>
  );
}

function RailButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "flex h-[50px] w-[50px] items-center justify-center rounded-xl border backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-primary/16",
        "border-white/16 bg-surface-elevated/50 text-white",
      )}
    >
      {children}
    </button>
  );
}
