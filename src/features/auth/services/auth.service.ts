import apiClient from "@/services/api.client";
import type { ApiLoginResponse } from "@/types/api/auth.types";

export interface SocialLoginPayload {
  type: 2 | 3;
  email: string;
  fullName: string;
  firebaseId: string;
}

export interface OtpLoginPayload {
  firebaseId: string;
  mobileNumber: string;
  countryCode: string;
  countryName: string;
}

// Endpoint name, request fields, and response shape confirmed against the
// real Flutter app's lib/webservice/apiservices.dart (login) — not a
// guess. Every real sign-in method (Google, Apple, Phone/OTP) converges on
// this single endpoint via its `type` field. There is no register,
// forgot-password, or reset-password endpoint in the real product.
export const authService = {
  // device_type/device_token are deliberately omitted — the backend column
  // is a numeric platform enum (Flutter sends its own int codes) and there
  // is no valid "web" value; sending a string there throws a SQL error.
  socialLogin: (payload: SocialLoginPayload) => {
    const form = new FormData();
    form.append("type", String(payload.type));
    form.append("email", payload.email);
    form.append("full_name", payload.fullName);
    form.append("firebase_id", payload.firebaseId);
    return apiClient.post<ApiLoginResponse>("login", form);
  },

  otpLogin: (payload: OtpLoginPayload) => {
    const form = new FormData();
    form.append("type", "1");
    form.append("mobile_number", payload.mobileNumber);
    form.append("country_code", payload.countryCode);
    form.append("country_name", payload.countryName);
    form.append("firebase_id", payload.firebaseId);
    return apiClient.post<ApiLoginResponse>("login", form);
  },

  // Reuses the same real get_profile endpoint confirmed for Settings — no
  // to_user_id means "self", and there is no dedicated /auth/me endpoint.
  getCurrentUser: () => apiClient.post<ApiLoginResponse>("get_profile"),
};
