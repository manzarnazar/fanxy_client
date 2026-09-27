export interface LiveStreamCard {
  id: string;
  /** Zego room id — the host's Firebase UID (matches the mobile app). */
  roomId: string;
  creatorId: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  viewerCount: number;
  isCreator: boolean;
  /** Viewer has an active subscription with this host (is_buy). */
  subscribed: boolean;
  /** Creator streams are locked until subscribed (mirrors the Flutter list card). */
  locked: boolean;
}

export interface LiveGift {
  id: string;
  name: string;
  imageUrl: string | null;
  coin: number;
}

/** Zego credentials read from general_setting (live_appid / live_serversecret). */
export interface LiveZegoConfig {
  appId: number;
  serverSecret: string;
}

export interface ReceivedGiftEvent {
  key: number;
  gift: LiveGift;
  fromUserName: string;
}
