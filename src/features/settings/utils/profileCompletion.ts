import type { SettingsProfile } from "@/features/settings/types/settings.types";

const COMPLETION_CHECKS: Array<(profile: SettingsProfile) => boolean> = [
  (profile) => Boolean(profile.avatarUrl),
  (profile) => Boolean(profile.coverImageUrl),
  (profile) => Boolean(profile.bio),
  (profile) => Boolean(profile.phone),
  (profile) => Boolean(profile.gender),
  (profile) => Boolean(profile.dateOfBirth),
  (profile) => Boolean(profile.instagramUrl || profile.facebookUrl || profile.twitterUrl || profile.youtubeUrl),
];

export function computeProfileCompletionPercent(profile: SettingsProfile): number {
  const done = COMPLETION_CHECKS.filter((check) => check(profile)).length;
  return Math.round((done / COMPLETION_CHECKS.length) * 100);
}
