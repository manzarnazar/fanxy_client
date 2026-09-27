/**
 * The backend occasionally stores corrupted media paths — e.g. a failed
 * upload's raw HTTP error text saved as the file name — which crash
 * next/image. Treat anything that isn't a parseable absolute http(s) URL
 * (or a root-relative path) as missing so the UI falls back to its
 * placeholder instead of throwing.
 */
export function sanitizeMediaUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (!/^https?:\/\//i.test(trimmed)) return null;
  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    return null;
  }
}
