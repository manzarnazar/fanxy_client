import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { settingsService } from "@/features/settings/services/settings.service";
import { buildSettingsBundle } from "@/features/settings/mapper/settings.mapper";
import type { BecomeCreatorInput, SettingsBundle, UpdateProfileInput } from "@/features/settings/types/settings.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface SettingsState {
  bundle: SettingsBundle | null;
  status: RequestStatus;
  error: string | null;
  savingProfile: boolean;
  savingCreatorInfo: boolean;
}

const initialState: SettingsState = {
  bundle: null,
  status: "idle",
  error: null,
  savingProfile: false,
  savingCreatorInfo: false,
};

export const fetchSettings = createAsyncThunk<SettingsBundle, void, { rejectValue: string }>(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const [profileResponse, pagesResponse, socialLinksResponse] = await Promise.all([
        settingsService.getProfile(),
        settingsService.getPages(),
        settingsService.getSocialLinks(),
      ]);
      const profile = profileResponse.data.result[0];
      if (!profile) return rejectWithValue("We couldn't load your profile right now.");
      return buildSettingsBundle(profile, pagesResponse.data.result, socialLinksResponse.data.result);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const updateProfile = createAsyncThunk<void, UpdateProfileInput, { rejectValue: string }>(
  "settings/updateProfile",
  async (input, { dispatch, rejectWithValue }) => {
    try {
      await settingsService.updateProfile(input);
      await dispatch(fetchSettings());
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const submitCreatorInfo = createAsyncThunk<void, BecomeCreatorInput, { rejectValue: string }>(
  "settings/submitCreatorInfo",
  async (input, { dispatch, rejectWithValue }) => {
    try {
      await settingsService.becomeCreator(input);
      await dispatch(fetchSettings());
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bundle = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(updateProfile.pending, (state) => {
        state.savingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.savingProfile = false;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.savingProfile = false;
      })
      .addCase(submitCreatorInfo.pending, (state) => {
        state.savingCreatorInfo = true;
      })
      .addCase(submitCreatorInfo.fulfilled, (state) => {
        state.savingCreatorInfo = false;
      })
      .addCase(submitCreatorInfo.rejected, (state) => {
        state.savingCreatorInfo = false;
      });
  },
});

export default settingsSlice.reducer;
