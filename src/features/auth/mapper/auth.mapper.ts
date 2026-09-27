import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiLoginResult } from "@/types/api/auth.types";
import type { AuthUser } from "@/features/auth/types/auth.types";

export function mapApiLoginResult(result: ApiLoginResult): AuthUser {
  return {
    id: String(result.id),
    firebaseId: result.firebase_id,
    // The backend bakes the "@" prefix into user_name — strip it for display.
    username: result.user_name.replace(/^@+/, ""),
    fullName: result.full_name,
    email: result.email,
    phone: result.mobile_number,
    countryCode: result.country_code,
    countryName: result.country_name,
    avatarUrl: sanitizeMediaUrl(result.image),
    coverImageUrl: sanitizeMediaUrl(result.cover_img),
    gender: result.gender,
    dateOfBirth: result.date_of_birth,
    bio: result.bio,
    instagramUrl: result.instagram_url,
    facebookUrl: result.facebook_url,
    twitterUrl: result.twitter_url,
    youtubeUrl: result.youtube_url,
    verified: Boolean(result.is_verified_at),
    isPrivate: result.is_private === 1,
    isCreator: result.is_creator === 1,
    role: result.is_creator === 1 ? "creator" : "user",
    walletBalance: result.wallet_amount ?? 0,
    coinBalance: result.coin_wallet ?? 0,
    earnedCoins: result.earned_coin ?? 0,
    bankName: result.bank_name,
    accountNo: result.account_no,
    ifscNo: result.ifsc_no,
    createdAt: result.created_at,
  };
}
