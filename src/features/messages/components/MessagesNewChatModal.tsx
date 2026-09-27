import Image from "next/image";
import { BadgeCheck, Search, SquarePen, User, X } from "lucide-react";
import { ShimmerBlock } from "@/components/shared/ShimmerBlock";
import { cn } from "@/lib/utils/cn";
import type { MessageCandidate } from "@/features/messages/types/messages.types";

interface MessagesNewChatModalProps {
  open: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  candidates: MessageCandidate[];
  candidatesStatus: "idle" | "loading" | "succeeded" | "failed";
  starting: boolean;
  onSelectCandidate: (candidate: MessageCandidate) => void;
}

export function MessagesNewChatModal({
  open,
  onClose,
  query,
  onQueryChange,
  candidates,
  candidatesStatus,
  starting,
  onSelectCandidate,
}: MessagesNewChatModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[4px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="New message"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[640px] w-full max-w-[540px] flex-col overflow-hidden rounded-xl border border-primary/24 bg-surface-elevated shadow-dropdown"
      >
        <div className="flex items-center justify-between border-b border-primary/12 px-5.5 py-5">
          <div>
            <div className="font-display text-xl font-semibold text-text-primary">New message</div>
            <div className="mt-0.5 font-sans text-xs font-light text-text-secondary/70">
              Start a conversation with a creator or friend
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9.5 w-9.5 items-center justify-center rounded-md border border-primary/18 bg-surface/60 text-text-secondary transition hover:bg-primary/12"
          >
            <X className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-none px-5.5 pt-4 pb-1.5">
          <div className="flex h-12 items-center gap-2.5 rounded-md border border-primary/16 bg-surface/70 px-3.5">
            <Search className="h-[17px] w-[17px] shrink-0 text-primary-light" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search users, creators…"
              aria-label="Search users and creators"
              autoFocus
              className="min-w-0 flex-1 bg-transparent font-sans text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-2.5">
          {!query.trim() && candidatesStatus === "idle" && (
            <div className="py-8 text-center font-sans text-sm text-text-secondary">
              Type a name to search for people.
            </div>
          )}

          {candidatesStatus === "loading" && (
            <div className="flex flex-col gap-2.5 px-1">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <ShimmerBlock className="h-11 w-11 rounded-full" />
                  <ShimmerBlock className="h-3 w-1/2 rounded-md" />
                </div>
              ))}
            </div>
          )}

          {candidatesStatus === "succeeded" && candidates.length === 0 && (
            <div className="py-8 text-center font-sans text-sm text-text-secondary">No matching users or creators.</div>
          )}

          {candidatesStatus === "succeeded" && candidates.length > 0 && (
            <div className="flex flex-col gap-0.5">
              {candidates.map((candidate) => {
                const chatUnavailable = !candidate.firebaseId;
                return (
                  <button
                    key={candidate.backendId}
                    type="button"
                    disabled={starting}
                    onClick={() => onSelectCandidate(candidate)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-2.5 py-2.5 text-left transition hover:bg-primary/10 disabled:opacity-60",
                      chatUnavailable && "opacity-55",
                    )}
                  >
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-surface-elevated">
                      {candidate.avatarUrl ? (
                        <Image src={candidate.avatarUrl} alt="" width={44} height={44} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <User className="h-4.5 w-4.5 text-text-secondary/60" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-sans text-[13.5px] font-medium text-text-primary">{candidate.name}</span>
                        {candidate.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />}
                        {candidate.isCreator && (
                          <span className="shrink-0 rounded-sm bg-accent-gold/16 px-1.5 py-px font-sans text-[7.5px] font-bold tracking-wide text-accent-gold-light uppercase">
                            Creator
                          </span>
                        )}
                      </div>
                      <div className="font-sans text-[11px] font-light text-text-secondary/60">
                        {candidate.username}
                        {chatUnavailable ? " · Not on chat yet" : ""}
                      </div>
                    </div>
                    <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary-light">
                      <SquarePen className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
