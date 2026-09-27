"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

interface ChatComposerProps {
  sending: boolean;
  onSend: (text: string) => Promise<boolean>;
}

export function ChatComposer({ sending, onSend }: ChatComposerProps) {
  const [draft, setDraft] = useState("");

  const submit = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    const sent = await onSend(text);
    if (sent) setDraft("");
  };

  return (
    <div className="flex shrink-0 items-end gap-2.5 border-t border-primary/12 bg-surface-elevated/70 px-4 py-3 backdrop-blur-xl">
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void submit();
          }
        }}
        placeholder="Type a message…"
        aria-label="Message"
        rows={1}
        className="max-h-32 min-h-[44px] flex-1 resize-none rounded-md border border-primary/16 bg-surface/70 px-3.5 py-2.5 font-sans text-[13.5px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => void submit()}
        disabled={sending || draft.trim().length === 0}
        aria-label="Send message"
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary-light to-primary text-[#03283a] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
      >
        <SendHorizontal className="h-[19px] w-[19px]" aria-hidden="true" />
      </button>
    </div>
  );
}
