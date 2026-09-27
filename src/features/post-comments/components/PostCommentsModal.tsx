"use client";

import Image from "next/image";
import { Loader2, Pencil, Reply, Send, Trash2, User, X } from "lucide-react";
import { formatCount } from "@/lib/formatter/count";
import { formatRelativeTime } from "@/lib/formatter/relativeTime";
import { usePostComments } from "@/features/post-comments/hooks/usePostComments";

interface PostCommentsModalProps {
  postId: string | null;
  commentCount: number;
  open: boolean;
  onClose: () => void;
}

export function PostCommentsModal({ postId, commentCount, open, onClose }: PostCommentsModalProps) {
  const { comments, status, error, draft, setDraft, isSubmitting, isEditing, startReply, startEdit, cancelEdit, submit, onDeleteComment } =
    usePostComments(postId, open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[3px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Comments"
        onClick={(event) => event.stopPropagation()}
        className="flex h-[min(640px,85vh)] w-full max-w-[480px] flex-col overflow-hidden rounded-xl border border-primary/22 bg-surface-elevated shadow-[0_40px_90px_-30px_rgba(0,0,0,.7)]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-primary/12 px-5.5 py-5">
          <div>
            <div className="font-display text-xl font-semibold text-text-primary">Comments</div>
            <div className="font-sans text-xs font-light text-text-secondary">{formatCount(commentCount)} comments</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comments"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-md border border-primary/20 bg-surface/70 text-primary-light transition hover:bg-primary/12"
          >
            <X className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5.5 py-4.5">
          {status === "loading" && comments.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary-light" aria-hidden="true" />
            </div>
          ) : status === "failed" && comments.length === 0 ? (
            <p className="py-10 text-center font-sans text-sm text-text-secondary">{error}</p>
          ) : comments.length === 0 ? (
            <p className="py-10 text-center font-sans text-sm text-text-secondary">No comments yet. Be the first to say something.</p>
          ) : (
            <div className="flex flex-col gap-4.5">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5">
                  <span className="relative h-[38px] w-[38px] shrink-0 overflow-hidden rounded-full bg-surface-elevated">
                    {comment.avatarUrl ? (
                      <Image src={comment.avatarUrl} alt="" fill sizes="38px" className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-text-secondary/60">
                        <User className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="rounded-md border border-primary/10 bg-surface/60 px-3.5 py-2.5">
                      <div className="mb-1 flex items-center gap-1.5">
                        <span className="font-sans text-[12.5px] font-medium text-text-primary">{comment.fullName}</span>
                      </div>
                      <p className="font-sans text-[13px] leading-relaxed font-light text-text-secondary">{comment.text}</p>
                    </div>
                    <div className="mt-1.5 flex items-center gap-4 pl-1">
                      <span className="font-sans text-[11px] text-text-muted">{formatRelativeTime(comment.createdAt)}</span>
                      <button
                        type="button"
                        onClick={() => startReply(comment.userName)}
                        aria-label="Reply"
                        className="flex items-center gap-1 font-sans text-[11px] text-text-muted transition hover:text-primary-light"
                      >
                        <Reply className="h-3 w-3" aria-hidden="true" />
                        Reply
                      </button>
                      {comment.isMine && (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(comment.id, comment.text)}
                            aria-label="Edit comment"
                            className="flex items-center gap-1 font-sans text-[11px] text-text-muted transition hover:text-primary-light"
                          >
                            <Pencil className="h-3 w-3" aria-hidden="true" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteComment(comment.id)}
                            aria-label="Delete comment"
                            className="flex items-center gap-1 font-sans text-[11px] text-text-muted transition hover:text-danger"
                          >
                            <Trash2 className="h-3 w-3" aria-hidden="true" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-primary/12 bg-surface/60 px-5.5 py-4">
          {isEditing && (
            <div className="mb-2 flex items-center justify-between rounded-md bg-primary/10 px-3 py-1.5">
              <span className="font-sans text-[11.5px] font-medium text-primary-light">Editing comment</span>
              <button type="button" onClick={cancelEdit} className="font-sans text-[11px] text-text-secondary hover:text-text-primary">
                Cancel
              </button>
            </div>
          )}
          <div className="flex items-center gap-2.5 rounded-md border border-primary/20 bg-surface/70 py-1.5 pr-1.5 pl-4">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submit();
              }}
              placeholder="Add a comment…"
              aria-label="Add a comment"
              className="flex-1 bg-transparent font-sans text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <button
              type="button"
              onClick={submit}
              disabled={!draft.trim() || isSubmitting}
              aria-label={isEditing ? "Save comment" : "Post comment"}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary-light to-primary text-[#03283a] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-[17px] w-[17px] animate-spin" aria-hidden="true" /> : <Send className="h-[17px] w-[17px]" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
