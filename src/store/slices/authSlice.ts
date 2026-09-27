import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ConfirmationResult } from "firebase/auth";
import { authService } from "@/features/auth/services/auth.service";
import { confirmPhoneCode, signInWithApplePopup, signInWithGooglePopup, signOutFromFirebase } from "@/features/auth/services/firebaseAuthService";
import { mapApiLoginResult } from "@/features/auth/mapper/auth.mapper";
import type { AuthUser, OtpVerifyPayload } from "@/features/auth/types/auth.types";
import type { ApiLoginResponse } from "@/types/api/auth.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import { clearSession, persistSession } from "@/lib/utils/session";
import { STORAGE_KEYS } from "@/lib/constants/keys";

// Persisted alongside the session marker so the API client can inject the
// real backend's required `user_id` field into requests outside of
// React/Redux.
function persistAuthUserId(userId: string): void {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEYS.AUTH_USER_ID, userId);
}

function clearStoredSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER_ID);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

export interface AuthErrorPayload {
  message: string;
  isUnauthorized: boolean;
  /** Set when the failure was a user-initiated cancellation (e.g. closing
   * the Google/Apple popup) — callers should silently ignore these rather
   * than showing an error toast. */
  isCancelled?: boolean;
}

function toAuthErrorPayload(error: unknown): AuthErrorPayload {
  const code = (error as { code?: string } | undefined)?.code;
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return { message: "", isUnauthorized: false, isCancelled: true };
  }
  if (code === "auth/popup-blocked") {
    return { message: "Popup blocked. Please allow popups for this site and try again.", isUnauthorized: false };
  }
  return { message: getApiErrorMessage(error), isUnauthorized: false };
}

function extractLoginUser(data: ApiLoginResponse): AuthUser | null {
  const result = data.result[0];
  if (!result?.id) return null;
  return mapApiLoginResult(result);
}

export const signInWithGoogle = createAsyncThunk<AuthUser, void, { rejectValue: AuthErrorPayload }>(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const identity = await signInWithGooglePopup();
      if (!identity.email) {
        return rejectWithValue({ message: "Your Google account has no email address.", isUnauthorized: false });
      }
      const response = await authService.socialLogin({
        type: 2,
        email: identity.email,
        fullName: identity.displayName ?? "",
        firebaseId: identity.uid,
      });
      const user = extractLoginUser(response.data);
      if (!user) return rejectWithValue({ message: "Unable to sign in with Google.", isUnauthorized: false });
      await persistSession(user.id);
      return user;
    } catch (error: unknown) {
      return rejectWithValue(toAuthErrorPayload(error));
    }
  },
);

export const signInWithApple = createAsyncThunk<AuthUser, void, { rejectValue: AuthErrorPayload }>(
  "auth/signInWithApple",
  async (_, { rejectWithValue }) => {
    try {
      const identity = await signInWithApplePopup();
      if (!identity.email) {
        return rejectWithValue({ message: "Your Apple account has no email address.", isUnauthorized: false });
      }
      const response = await authService.socialLogin({
        type: 3,
        email: identity.email,
        fullName: identity.displayName ?? "",
        firebaseId: identity.uid,
      });
      const user = extractLoginUser(response.data);
      if (!user) return rejectWithValue({ message: "Unable to sign in with Apple.", isUnauthorized: false });
      await persistSession(user.id);
      return user;
    } catch (error: unknown) {
      return rejectWithValue(toAuthErrorPayload(error));
    }
  },
);

export const verifyPhoneOtp = createAsyncThunk<
  AuthUser,
  OtpVerifyPayload & { confirmationResult: ConfirmationResult },
  { rejectValue: AuthErrorPayload }
>("auth/verifyPhoneOtp", async ({ confirmationResult, code, dialCode, countryName, phoneNumber }, { rejectWithValue }) => {
  try {
    const firebaseUid = await confirmPhoneCode(confirmationResult, code);
    const response = await authService.otpLogin({
      firebaseId: firebaseUid,
      mobileNumber: phoneNumber,
      countryCode: dialCode,
      countryName,
    });
    const user = extractLoginUser(response.data);
    if (!user) return rejectWithValue({ message: "Unable to verify code.", isUnauthorized: false });
    await persistSession(user.id);
    return user;
  } catch (error: unknown) {
    const code_ = (error as { code?: string } | undefined)?.code;
    if (code_ === "auth/invalid-verification-code") {
      return rejectWithValue({ message: "Incorrect code. Please try again.", isUnauthorized: true });
    }
    return rejectWithValue(toAuthErrorPayload(error));
  }
});

export const signOut = createAsyncThunk("auth/signOut", async () => {
  await signOutFromFirebase();
  await clearSession();
});

export const fetchCurrentUser = createAsyncThunk<AuthUser, void, { rejectValue: AuthErrorPayload }>(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      const user = extractLoginUser(response.data);
      if (!user) return rejectWithValue({ message: "Session expired.", isUnauthorized: true });
      return user;
    } catch (error: unknown) {
      return rejectWithValue(toAuthErrorPayload(error));
    }
  },
);

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: AuthErrorPayload | null;
  isBootstrapped: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isBootstrapped: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    forceSignOut: (state) => {
      state.user = null;
      state.error = null;
      state.isBootstrapped = true;
      clearStoredSession();
    },
    markBootstrapped: (state) => {
      state.isBootstrapped = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        persistAuthUserId(action.payload.id);
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      })
      .addCase(signInWithApple.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithApple.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        persistAuthUserId(action.payload.id);
      })
      .addCase(signInWithApple.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      })
      .addCase(verifyPhoneOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPhoneOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        persistAuthUserId(action.payload.id);
      })
      .addCase(verifyPhoneOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        clearStoredSession();
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isBootstrapped = true;
        persistAuthUserId(action.payload.id);
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isBootstrapped = true;
        // A stale/invalid session (e.g. the user_id was deleted or the
        // profile lookup was rejected as unauthorized) must not linger —
        // otherwise every future page load retries the same failing fetch.
        if (action.payload?.isUnauthorized) {
          state.user = null;
          clearStoredSession();
        }
      });
  },
});

export const { clearAuthError, forceSignOut, markBootstrapped } = authSlice.actions;
export default authSlice.reducer;
