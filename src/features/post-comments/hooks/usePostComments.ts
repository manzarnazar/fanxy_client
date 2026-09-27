"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addPostComment,
  deletePostComment,
  editPostComment,
  fetchPostComments,
  resetPostComments,
} from "@/store/slices/postCommentsSlice";
import { toast } from "@/lib/utils/toast";

// Comments have no reply/thread field on the real backend — "reply" is a
// client-only convenience that pre-fills the composer with an @mention and
// posts as a normal top-level comment, not a real threaded reply.
export function usePostComments(postId: string | null, isOpen: boolean) {
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) => state.postComments);
  const [draft, setDraft] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !postId) return;
    void dispatch(fetchPostComments(postId));
    return () => {
      dispatch(resetPostComments());
    };
  }, [dispatch, isOpen, postId]);

  const startReply = (userName: string) => {
    setEditingCommentId(null);
    setDraft(`${userName} `);
  };

  const startEdit = (commentId: string, currentText: string) => {
    setEditingCommentId(commentId);
    setDraft(currentText);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setDraft("");
  };

  const submit = async () => {
    const text = draft.trim();
    if (!text || !postId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (editingCommentId) {
        await dispatch(editPostComment({ postId, commentId: editingCommentId, text })).unwrap();
        toast.success("Comment updated.");
      } else {
        await dispatch(addPostComment({ postId, text })).unwrap();
      }
      setDraft("");
      setEditingCommentId(null);
    } catch {
      toast.error(editingCommentId ? "Unable to update comment." : "Unable to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = (commentId: string) => {
    if (!postId) return;
    void dispatch(deletePostComment({ postId, commentId }));
  };

  return {
    comments: comments.items,
    status: comments.status,
    error: comments.error,
    draft,
    setDraft,
    isSubmitting,
    isEditing: editingCommentId !== null,
    startReply,
    startEdit,
    cancelEdit,
    submit: () => void submit(),
    onDeleteComment: remove,
  };
}
