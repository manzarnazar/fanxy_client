import { STORAGE_KEYS } from "@/lib/constants/keys";
import type { ConversationPrefs } from "@/features/messages/types/messages.types";

// Pin/mute/archive are web-only conveniences — the shared Firestore chat
// model (and the mobile app) has no such flags, so they live in localStorage.
type PrefsMap = Record<string, ConversationPrefs>;

export function loadChatPrefs(): PrefsMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.CHAT_PREFS);
    return raw ? (JSON.parse(raw) as PrefsMap) : {};
  } catch {
    return {};
  }
}

export function saveChatPref(convId: string, patch: ConversationPrefs): PrefsMap {
  const prefs = loadChatPrefs();
  prefs[convId] = { ...prefs[convId], ...patch };
  try {
    window.localStorage.setItem(STORAGE_KEYS.CHAT_PREFS, JSON.stringify(prefs));
  } catch {
    // Quota/private-mode failures just mean the preference doesn't persist.
  }
  return prefs;
}
