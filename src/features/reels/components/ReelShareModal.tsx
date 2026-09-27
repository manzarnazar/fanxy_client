"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Link2, Mail, X } from "lucide-react";
import { toast } from "@/lib/utils/toast";
import type { Reel } from "@/features/reels/types/reels.types";

interface ReelShareModalProps {
  reel: Reel;
  open: boolean;
  onClose: () => void;
}

export function ReelShareModal({ reel, open, onClose }: ReelShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return `/reels/${reel.id}`;
    return `${window.location.origin}/reels/${reel.id}`;
  }, [reel.id]);

  if (!open) return null;

  const shareText = reel.title ?? `${reel.creatorFullName} on Fanxy`;

  const shareOptions = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      bg: "bg-[#1877f2]/18",
      icon: <Link2 className="h-5 w-5 text-[#4c9aff]" aria-hidden="true" />,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      bg: "bg-white/10",
      icon: <Link2 className="h-5 w-5 text-text-primary" aria-hidden="true" />,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      bg: "bg-[#25d366]/16",
      icon: <Link2 className="h-5 w-5 text-[#4ee68a]" aria-hidden="true" />,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      bg: "bg-primary/18",
      icon: <Link2 className="h-5 w-5 text-primary-light" aria-hidden="true" />,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`,
      bg: "bg-white/8",
      icon: <Mail className="h-5 w-5 text-text-primary" aria-hidden="true" />,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.info("Link copied to clipboard.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Share reel"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[420px] rounded-xl border border-primary/22 bg-surface-elevated p-6.5 shadow-[0_40px_90px_-34px_rgba(0,0,0,.9)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="font-display text-xl font-semibold text-text-primary">
            Share reel
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-primary/20 bg-surface/70 text-primary-light transition hover:bg-primary/12"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {shareOptions.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-md border border-primary/14 bg-surface/55 px-1.5 py-3.5 transition hover:-translate-y-0.5 hover:bg-primary/10"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-md ${option.bg}`}
              >
                {option.icon}
              </span>
              <span className="font-sans text-[11px] font-light text-text-secondary">
                {option.label}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-4.5 flex items-center gap-2.5 rounded-md border border-primary/16 bg-surface/60 px-3.5 py-3">
          <span className="min-w-0 flex-1 truncate font-sans text-[12.5px] font-light text-text-secondary">
            {shareUrl}
          </span>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="flex shrink-0 items-center gap-1.5 rounded-md bg-gradient-to-br from-primary-light to-primary px-4 py-2 font-sans text-xs font-semibold text-[#03283a] transition hover:-translate-y-0.5"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
