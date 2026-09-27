import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiCommentResult } from "@/types/api/comments.types";
import type { PostComment } from "@/features/post-comments/types/post-comments.types";

export function mapApiComment(comment: ApiCommentResult, currentUserId: string | null): PostComment {
  return {
    id: String(comment.id),
    postId: String(comment.post_id),
    userId: String(comment.user_id),
    userName: comment.user_name,
    fullName: comment.full_name,
    avatarUrl: sanitizeMediaUrl(comment.profile_img),
    text: comment.comment,
    createdAt: comment.created_at,
    isMine: currentUserId !== null && String(comment.user_id) === currentUserId,
  };
}
