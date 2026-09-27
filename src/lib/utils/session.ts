import { STORAGE_KEYS } from "@/lib/constants/keys";

export async function persistSession(sessionMarker: string): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, sessionMarker);

  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: sessionMarker }),
  });
}

export async function clearSession(): Promise<void> {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  await fetch("/api/auth/session", { method: "DELETE" });
}
