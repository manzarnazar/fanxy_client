import type { ApiSimpleEnvelope } from "@/types/api/common.types";

// general_setting — confirmed against the Flutter app's
// lib/model/generalsettingmodel.dart: a flat key/value list. The live
// streaming credentials live under keys live_appid / live_appsign /
// live_serversecret (lib/utils/constant.dart).
export interface ApiGeneralSettingResult {
  id: number;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

export type ApiGeneralSettingsResponse = ApiSimpleEnvelope<ApiGeneralSettingResult>;
