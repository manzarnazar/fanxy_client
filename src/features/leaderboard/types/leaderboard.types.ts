export interface LeaderboardEntry {
  /** The ranked user's id — links to their profile. */
  userId: string;
  rank: number;
  name: string;
  username: string;
  avatarUrl: string | null;
  /** Lifetime spend (fans mode) or lifetime earnings (creators mode). */
  amount: number;
}

/** Fans mode ranks one creator's supporters; creators mode is global. */
export type LeaderboardMode = "creators" | "fans";
