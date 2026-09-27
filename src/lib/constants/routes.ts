export const ROUTES = {
  HOME: "/",

  // Auth
  SIGN_IN: "/sign-in",

  // Account (protected)
  PROFILE: "/profile",
  REELS: "/reels",
  STORIES: "/stories",
  LIVE: "/live",
  GO_LIVE: "/live/go-live",
  LIVE_WATCH: (roomId: string, hostUserId: string) =>
    `/live/watch/${encodeURIComponent(roomId)}?host=${encodeURIComponent(hostUserId)}`,
  MESSAGES: "/messages",
  NOTIFICATIONS: "/notifications",
  SUBSCRIPTIONS: "/subscriptions",
  WALLET: "/wallet",
  LEADERBOARD: "/leaderboard",
  LEADERBOARD_TOP_FANS: (creatorId: string, creatorName?: string) =>
    creatorName
      ? `/leaderboard?creator=${creatorId}&name=${encodeURIComponent(creatorName)}`
      : `/leaderboard?creator=${creatorId}`,
  SETTINGS: "/settings",
  BLOCKED_USERS: "/blocked-users",
  SEARCH: "/search",
  CREATOR_DASHBOARD: "/creator/dashboard",
  MY_CONTENT: "/creator/content",
  SUBSCRIBERS: "/creator/subscribers",
  UPLOAD_POST: "/creator/upload-post",
  UPLOAD_STORY: "/creator/upload-story",
  PACKAGES: "/creator/packages",
  SCHEDULED_POSTS: "/creator/scheduled",
  ANALYTICS: "/creator/analytics",
  WITHDRAWALS: "/creator/withdrawals",
  PROMO_CODES: "/creator/promo-codes",
  BECOME_CREATOR: "/become-creator",
  SUBSCRIBE_PLANS: (creatorId: string, creatorName?: string) =>
    creatorName ? `/subscribe/${creatorId}?name=${encodeURIComponent(creatorName)}` : `/subscribe/${creatorId}`,
  PAYMENT: "/payment",
  CHECKOUT_SUBSCRIPTION: (creatorId: string, packageId: string) =>
    `/payment?type=subscription&creator=${creatorId}&package=${packageId}`,
  CHECKOUT_COINS: (coinPackageId: string) => `/payment?type=coins&package=${coinPackageId}`,
  CREATOR_PROFILE: (creatorId: string) => `/creators/${creatorId}`,
  STORY_VIEW: (username: string) => `/stories/${username}`,
  CHAT: (conversationId: string) => `/messages/${conversationId}`,
} as const;

export const PROTECTED_ROUTES: string[] = [
  ROUTES.PROFILE,
  ROUTES.BLOCKED_USERS,
  ROUTES.CREATOR_DASHBOARD,
  ROUTES.MY_CONTENT,
  ROUTES.SUBSCRIBERS,
  ROUTES.PACKAGES,
  ROUTES.ANALYTICS,
  ROUTES.SCHEDULED_POSTS,
  ROUTES.PAYMENT,
  ROUTES.GO_LIVE,
  ROUTES.WITHDRAWALS,
  ROUTES.PROMO_CODES,
  ROUTES.UPLOAD_POST,
  ROUTES.UPLOAD_STORY,
];
