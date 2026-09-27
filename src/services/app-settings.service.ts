import apiClient from "@/services/api.client";
import type { ApiGeneralSettingsResponse } from "@/types/api/general-setting.types";

// general_setting — the app-wide key/value config (app name/logo, currency,
// live keys, coin economics, ...). Same source the Flutter app loads on boot.
export const appSettingsService = {
  getGeneralSettings: () => apiClient.post<ApiGeneralSettingsResponse>("general_setting"),
};
