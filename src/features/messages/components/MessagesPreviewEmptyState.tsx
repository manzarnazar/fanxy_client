import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

interface MessagesPreviewEmptyStateProps {
  onStartNewChat: () => void;
}

export function MessagesPreviewEmptyState({ onStartNewChat }: MessagesPreviewEmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="relative">
        <div className="flex h-[130px] w-[130px] items-center justify-center rounded-[40px] bg-primary/10 shadow-[inset_0_0_0_1.5px_rgba(0,175,240,.35),0_24px_60px_-28px_rgba(0,175,240,.55)]">
          <MessageCircle className="h-14 w-14 text-primary-light" aria-hidden="true" />
        </div>
        <span className="absolute -top-1.5 -right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-secondary-light to-secondary-dark text-white shadow-lg">
          <Heart className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <h2 className="mt-6 font-display text-[30px] font-semibold text-text-primary">Select a Conversation</h2>
      <p className="mt-2 max-w-[380px] font-sans text-[13px] leading-relaxed font-light text-text-secondary/75">
        Choose a conversation from the list to see the preview, or start a new chat with a creator or friend.
      </p>

      <div className="mt-6 flex items-center gap-2.5">
        <Link
          href={ROUTES.HOME}
          className="rounded-md border border-primary/20 bg-surface/60 px-5 py-2.5 font-sans text-[13px] font-medium text-text-secondary transition hover:bg-primary/10 hover:text-text-primary"
        >
          Explore Creators
        </Link>
        <button
          type="button"
          onClick={onStartNewChat}
          className="rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-2.5 font-sans text-[13px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5"
        >
          Start New Chat
        </button>
      </div>
    </div>
  );
}
