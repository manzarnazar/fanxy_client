import apiClient from "@/services/api.client";
import type { ApiSuccessEnvelope } from "@/types/api/common.types";
import type {
  ApiSettingsPagesResponse,
  ApiSettingsProfileResponse,
  ApiSocialLinksResponse,
} from "@/types/api/settings.types";
import type { BecomeCreatorInput, UpdateProfileInput } from "@/features/settings/types/settings.types";

// Endpoint names and payload/response fields below are confirmed against
// the real Flutter app's lib/webservice/apiservices.dart (get_profile,
// update_profile, become_creator, get_pages, get_social_links) — not guesses.
export const settingsService = {
  getProfile: () => apiClient.post<ApiSettingsProfileResponse>("get_profile"),

  getPages: () => apiClient.post<ApiSettingsPagesResponse>("get_pages"),

  getSocialLinks: () => apiClient.post<ApiSocialLinksResponse>("get_social_links"),

  updateProfile: (input: UpdateProfileInput) => {
    const form = new FormData();
    form.append("full_name", input.fullName);
    form.append("user_name", input.username);
    form.append("email", input.email);
    form.append("mobile_number", input.mobileNumber);
    form.append("country_code", input.countryCode);
    form.append("bio", input.bio);
    form.append("instagram_url", input.instagramUrl);
    form.append("facebook_url", input.facebookUrl);
    form.append("twitter_url", input.twitterUrl);
    form.append("youtube_url", input.youtubeUrl);
    form.append("date_of_birth", input.dateOfBirth);
    form.append("gender", input.gender);
    if (input.avatarFile) form.append("image", input.avatarFile);
    if (input.coverFile) form.append("cover_img", input.coverFile);
    return apiClient.post<ApiSuccessEnvelope>("update_profile", form);
  },

  becomeCreator: (input: BecomeCreatorInput) => {
    const form = new FormData();
    form.append("bank_name", input.bankName);
    form.append("account_no", input.accountNo);
    form.append("ifsc_no", input.ifscNo);
    if (input.frontIdProofFile) form.append("front_id_proof_img", input.frontIdProofFile);
    if (input.backIdProofFile) form.append("back_id_proof_img", input.backIdProofFile);
    return apiClient.post<ApiSuccessEnvelope>("become_creator", form);
  },
};
