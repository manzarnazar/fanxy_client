/**
 * One person from search_user — the ONLY real search endpoint. There is no
 * post/reel/hashtag/live search in the backend, so people are the single
 * result category.
 */
export interface SearchResult {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  verified: boolean;
  isCreator: boolean;
}

export type SearchCategory = "all" | "creators" | "users";
