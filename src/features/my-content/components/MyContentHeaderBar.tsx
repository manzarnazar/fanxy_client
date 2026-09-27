import Link from "next/link";
import { Clapperboard, Upload } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

interface MyContentHeaderBarProps {
  onUpload: () => void;
}

export function MyContentHeaderBar({ onUpload }: MyContentHeaderBarProps) {
  return (
    <div className="mb-4.5 flex flex-wrap items-center gap-3.5">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-[26px] leading-none font-semibold text-text-primary">My Content</h1>
        <p className="mt-1 font-sans text-[12.5px] font-light text-text-secondary/70">
          Manage all your posts and stories in one workspace.
        </p>
      </div>

      <button
        type="button"
        onClick={onUpload}
        className="flex h-10.5 items-center gap-1.5 rounded-md bg-gradient-to-br from-primary-light to-primary px-4 font-sans text-[12.5px] font-semibold text-[#03283a] transition hover:-translate-y-0.5"
      >
        <Upload className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Upload post</span>
      </button>
      <Link
        href={ROUTES.REELS}
        className="flex h-10.5 items-center gap-1.5 rounded-md border border-primary/18 bg-surface/60 px-4 font-sans text-[12.5px] font-medium text-text-secondary transition hover:bg-primary/10"
      >
        <Clapperboard className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Reels</span>
      </Link>
    </div>
  );
}
