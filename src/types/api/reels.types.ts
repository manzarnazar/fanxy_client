import type { ApiPostListResponse } from "@/types/api/post.types";

// The real backend has no separate "reel" resource — reels are get_post
// results whose post_content contains a video item, filtered client-side.
export type ApiReelsResponse = ApiPostListResponse;
