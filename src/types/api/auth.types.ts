import type { ApiSimpleEnvelope } from "@/types/api/common.types";
import type { ApiSettingsProfile } from "@/types/api/settings.types";

// login — confirmed against the real Flutter app's
// lib/webservice/apiservices.dart + lib/model/loginregistermodel.dart.
// A single endpoint handles every sign-in method via `type`
// (1 = Phone/OTP, 2 = Google, 3 = Apple, 4 = Normal email/password — this
// last one is documented in the Dart source but never actually called by
// any real screen; there is no register, forgot-password, or
// reset-password endpoint anywhere in the real product). There is no
// session JWT in the response — the returned `id` becomes `user_id` for
// every subsequent request, authenticated the same way as every other
// endpoint in this app (static Api-Token header + user_id field).
export type ApiLoginType = 1 | 2 | 3 | 4;

export type ApiLoginResult = ApiSettingsProfile;
export type ApiLoginResponse = ApiSimpleEnvelope<ApiLoginResult>;
