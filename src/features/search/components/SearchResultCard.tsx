import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, User } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { SearchResult } from "@/features/search/types/search.types";

interface SearchResultCardProps {
  result: SearchResult;
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  const body = (
    <>
      <div className="flex items-center gap-3">
        <div className="h-13 w-13 shrink-0 rounded-full bg-gradient-to-br from-primary-light to-primary p-0.5">
          <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
            {result.avatarUrl ? (
              <Image src={result.avatarUrl} alt="" width={52} height={52} className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-text-secondary/60" aria-hidden="true" />
            )}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-sans text-[14px] font-semibold text-text-primary">{result.name}</span>
            {result.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />}
            {result.isCreator && (
              <span className="shrink-0 rounded-sm bg-accent-gold/16 px-1.5 py-px font-sans text-[8px] font-bold tracking-wide text-accent-gold-light uppercase">
                Creator
              </span>
            )}
          </div>
          <div className="truncate font-sans text-[12px] font-light text-text-secondary/70">{result.username}</div>
        </div>
      </div>
      {result.bio && (
        <p className="mt-2.5 line-clamp-2 font-sans text-[12px] leading-relaxed font-light text-text-secondary/80">
          {result.bio}
        </p>
      )}
    </>
  );

  const cardClassName =
    "flex flex-col rounded-[18px] border border-primary/14 bg-surface/50 p-4 transition hover:-translate-y-0.5 hover:border-primary/30";

  return (
    <Link href={ROUTES.CREATOR_PROFILE(result.id)} className={cardClassName}>
      {body}
    </Link>
  );
}
