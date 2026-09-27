export type UserRole = "user" | "creator";

export interface AuthUser {
  id: string;
  firebaseId: string | null;
  username: string;
  fullName: string;
  email: string;
  phone: string | null;
  countryCode: string | null;
  countryName: string | null;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  bio: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  verified: boolean;
  isPrivate: boolean;
  isCreator: boolean;
  role: UserRole;
  walletBalance: number;
  coinBalance: number;
  earnedCoins: number;
  bankName: string | null;
  accountNo: string | null;
  ifscNo: string | null;
  createdAt: string;
}

export interface GoogleSignInPayload {
  firebaseUid: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
}

export interface AppleSignInPayload {
  firebaseUid: string;
  email: string;
  fullName: string;
}

export interface PhoneCredentials {
  dialCode: string;
  countryName: string;
  phoneNumber: string;
}

export interface OtpVerifyPayload extends PhoneCredentials {
  code: string;
}
