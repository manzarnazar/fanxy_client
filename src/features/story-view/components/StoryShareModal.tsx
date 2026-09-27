"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Copy, MessageCircle, X } from "lucide-react";
import { toast } from "@/lib/utils/toast";
import { ROUTES } from "@/lib/constants/routes";
import type { StoryItem } from "@/features/story-view/types/story-view.types";

interface StoryShareModalProps {
  story: StoryItem;
  username: string;
  open: boolean;
  onClose: () => void;
}

export function StoryShareModal({ story, username, open, onClose }: StoryShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return `/stories/${username}/${story.id}`;
    return `${window.location.origin}/stories/${username}/${story.id}`;
  }, [username, story.id]);

  if (!open) return null;

  const shareLinks = [
    { label: "X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(shareUrl)}` },
    { label: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}` },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent("Check out this story")}&body=${encodeURIComponent(shareUrl)}` },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.info("Link copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/72 p-4 backdrop-blur-[4px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Share story"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[440px] rounded-[22px] border border-primary/22 bg-surface-elevated p-6 shadow-[0_34px_70px_-26px_rgba(0,0,0,.85)]"
      >
        <div className="mb-4.5 flex items-center justify-between">
          <span className="font-display text-xl font-semibold text-text-primary">Share story</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-primary/20 bg-surface/70 text-primary-light transition hover:bg-primary/12"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          <Link
            href={ROUTES.MESSAGES}
            onClick={onClose}
            className="flex flex-col items-center gap-1.5 rounded-md border border-primary/14 bg-surface/55 py-3.5 transition hover:-translate-y-0.5 hover:bg-primary/10"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/16 text-primary-light">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-sans text-[10.5px] font-light text-text-secondary">Messages</span>
          </Link>
          {shareLinks.map((target) => (
            <a
              key={target.label}
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex flex-col items-center gap-1.5 rounded-md border border-primary/14 bg-surface/55 py-3.5 transition hover:-translate-y-0.5 hover:bg-primary/10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 font-sans text-xs font-semibold text-primary-light">
                {target.label.slice(0, 2)}
              </span>
              <span className="font-sans text-[10.5px] font-light text-text-secondary">{target.label}</span>
            </a>
          ))}
        </div>

        <div className="mt-4.5 flex items-center gap-2.5 rounded-md border border-primary/16 bg-surface/60 px-3.5 py-3">
          <span className="min-w-0 flex-1 truncate font-sans text-xs font-light text-text-secondary">{shareUrl}</span>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="flex shrink-0 items-center gap-1.5 rounded-md bg-gradient-to-br from-primary-light to-primary px-4 py-2 font-sans text-xs font-semibold text-[#03283a] transition hover:-translate-y-0.5"
          >
            {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
