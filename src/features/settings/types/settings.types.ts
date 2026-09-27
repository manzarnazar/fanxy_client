export interface SettingsProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string | null;
  countryCode: string | null;
  countryName: string | null;
  bio: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  isCreator: boolean;
  verified: boolean;
  memberSinceLabel: string;
  walletBalance: number;
  coinBalance: number;
  earnedCoins: number;
  bankName: string | null;
  accountNo: string | null;
  ifscNo: string | null;
  frontIdProofImageUrl: string | null;
  backIdProofImageUrl: string | null;
}

export interface SettingsPage {
  key: string;
  title: string;
  url: string;
  iconUrl: string | null;
}

export interface SettingsSocialLink {
  id: string;
  name: string;
  imageUrl: string | null;
  url: string;
}

export interface SettingsBundle {
  profile: SettingsProfile;
  pages: SettingsPage[];
  socialLinks: SettingsSocialLink[];
}

export interface UpdateProfileInput {
  fullName: string;
  username: string;
  email: string;
  mobileNumber: string;
  countryCode: string;
  bio: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  dateOfBirth: string;
  gender: string;
  avatarFile: File | null;
  coverFile: File | null;
}

export interface BecomeCreatorInput {
  bankName: string;
  accountNo: string;
  ifscNo: string;
  frontIdProofFile: File | null;
  backIdProofFile: File | null;
}

export type SettingsSectionKey = "profile" | "account" | "creator" | "help" | "about" | "actions";

export type SettingsSectionGroup = "Account" | "Creator" | "Support";
