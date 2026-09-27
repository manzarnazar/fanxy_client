import { STORAGE_KEYS } from "@/lib/constants/keys";

// Recent searches are a client convenience — the backend has no history API.
// localStorage is exposed as an external store (subscribe/snapshot) so React
// components can consume it via useSyncExternalStore without hydration
// mismatches or setState-in-effect patterns.
const MAX_RECENT = 8;
const EMPTY: string[] = [];

let cachedRaw: string | null | undefined;
let cachedParsed: string[] = EMPTY;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function write(next: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(next));
  } catch {
    // Persistence is best-effort (private mode / quota).
  }
  notify();
}

export function subscribeRecentSearches(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getRecentSearchesSnapshot(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedParsed = raw ? (JSON.parse(raw) as string[]) : EMPTY;
    } catch {
      cachedParsed = EMPTY;
    }
  }
  return cachedParsed;
}

export function getRecentSearchesServerSnapshot(): string[] {
  return EMPTY;
}

export function saveRecentSearch(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;
  const next = [
    trimmed,
    ...getRecentSearchesSnapshot().filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
  ].slice(0, MAX_RECENT);
  write(next);
}

export function removeRecentSearch(query: string): void {
  write(getRecentSearchesSnapshot().filter((item) => item !== query));
}

export function clearRecentSearches(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  } catch {
    // Persistence is best-effort.
  }
  notify();
}
