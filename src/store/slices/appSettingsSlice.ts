import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { appSettingsService } from "@/services/app-settings.service";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import type { RootState } from "@/store/store";

interface AppSettingsState {
  values: Record<string, string>;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AppSettingsState = { values: {}, status: "idle" };

export const fetchAppSettings = createAsyncThunk<Record<string, string>, void, { rejectValue: string }>(
  "appSettings/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await appSettingsService.getGeneralSettings();
      const values: Record<string, string> = {};
      for (const row of response.data.result) {
        if (row.value !== null) values[row.key] = row.value;
      }
      return values;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const appSettingsSlice = createSlice({
  name: "appSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppSettings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppSettings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.values = action.payload;
      })
      .addCase(fetchAppSettings.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// Note the backend's swapped naming: `currency_code` holds the SYMBOL ("$"),
// `currency` holds the ISO code ("USD") — mirrored from the Flutter app.
export const selectAppName = (state: RootState) => state.appSettings.values.app_name ?? "yourappname";
export const selectAppLogoUrl = (state: RootState) => state.appSettings.values.app_logo ?? null;
export const selectCurrencySymbol = (state: RootState) => state.appSettings.values.currency_code ?? "$";
export const selectMinWithdrawalCoin = (state: RootState) => Number(state.appSettings.values.min_withdrawal_coin) || 0;

// Zego live credentials (same general_setting keys the Flutter app reads).
export const selectLiveZegoConfig = (state: RootState) => {
  const appId = Number(state.appSettings.values.live_appid);
  const serverSecret = state.appSettings.values.live_serversecret;
  if (!Number.isFinite(appId) || appId <= 0 || !serverSecret) return null;
  return { appId, serverSecret };
};

// Web push VAPID key — same general_setting key as the Flutter app
// (general_setting "vap_id_key" → Constant.vapidKeyForWeb).
export const selectVapidKey = (state: RootState) => state.appSettings.values.vap_id_key ?? null;

export default appSettingsSlice.reducer;

