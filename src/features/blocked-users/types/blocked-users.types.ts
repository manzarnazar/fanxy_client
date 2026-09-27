export interface BlockedUser {
  /** The block row id. */
  id: string;
  /** The blocked user's id — what add_remove_user_block toggles on. */
  blockUserId: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  blockedAt: string;
}
