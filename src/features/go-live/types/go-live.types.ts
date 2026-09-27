export type GoLivePhase = "setup" | "live" | "summary";

/** ZegoCloud credentials from general_setting — the same ones the mobile app uses. */
export interface ZegoLiveConfig {
  appId: number;
  serverSecret: string;
}

/** One gift from the real get_gift catalog (what fans can send during the stream). */
export interface LiveGift {
  id: string;
  name: string;
  imageUrl: string | null;
  coins: number;
}

export interface LiveSummary {
  /** Stream length in whole seconds, measured client-side between start and end. */
  durationSeconds: number;
  endedAt: number;
}
