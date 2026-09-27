import { formatMonthYear } from "@/lib/formatter/monthYear";
import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type {
  ApiSettingsPage,
  ApiSettingsProfile,
  ApiSocialLink,
} from "@/types/api/settings.types";
import type { SettingsBundle, SettingsPage, SettingsProfile, SettingsSocialLink } from "@/features/settings/types/settings.types";

export function mapApiSettingsProfile(profile: ApiSettingsProfile): SettingsProfile {
  return {
    id: String(profile.id),
    fullName: profile.full_name,
    // The backend bakes the "@" prefix into user_name — strip it for display.
    username: profile.user_name.replace(/^@+/, ""),
    email: profile.email,
    phone: profile.mobile_number,
    countryCode: profile.country_code,
    countryName: profile.country_name,
    bio: profile.bio,
    gender: profile.gender,
    dateOfBirth: profile.date_of_birth,
    avatarUrl: sanitizeMediaUrl(profile.image),
    coverImageUrl: sanitizeMediaUrl(profile.cover_img),
    instagramUrl: profile.instagram_url,
    facebookUrl: profile.facebook_url,
    twitterUrl: profile.twitter_url,
    youtubeUrl: profile.youtube_url,
    isCreator: profile.is_creator === 1,
    verified: Boolean(profile.is_verified_at),
    memberSinceLabel: formatMonthYear(profile.created_at),
    walletBalance: profile.wallet_amount ?? 0,
    coinBalance: profile.coin_wallet ?? 0,
    earnedCoins: profile.earned_coin ?? 0,
    bankName: profile.bank_name,
    accountNo: profile.account_no,
    ifscNo: profile.ifsc_no,
    frontIdProofImageUrl: sanitizeMediaUrl(profile.front_id_proof_img),
    backIdProofImageUrl: sanitizeMediaUrl(profile.back_id_proof_img),
  };
}

export function mapApiSettingsPage(page: ApiSettingsPage): SettingsPage {
  return { key: page.page_name, title: page.title, url: page.url, iconUrl: sanitizeMediaUrl(page.icon) };
}

export function mapApiSocialLink(link: ApiSocialLink): SettingsSocialLink {
  return { id: String(link.id), name: link.name, imageUrl: sanitizeMediaUrl(link.image), url: link.url };
}

export function buildSettingsBundle(
  profile: ApiSettingsProfile,
  pages: ApiSettingsPage[],
  socialLinks: ApiSocialLink[],
): SettingsBundle {
  return {
    profile: mapApiSettingsProfile(profile),
    pages: pages.map(mapApiSettingsPage),
    socialLinks: socialLinks.filter((link) => link.status === 1).map(mapApiSocialLink),
  };
}
