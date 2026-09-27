import apiClient from "@/services/api.client";
import type { ApiCreatorPromoCodesResponse } from "@/types/api/payments.types";

// get_creator_promo_codes — confirmed against the Flutter app's
// lib/webservice/apiservices.dart. This is the ONLY creator-promo endpoint
// besides the fan-side apply_promo_code: codes are created/edited/disabled in
// the platform admin panel, so the web page is read-only by design.
export const promoCodesService = {
  getMyPromoCodes: (creatorId: string) => {
    const form = new FormData();
    form.append("to_user_id", creatorId);
    return apiClient.post<ApiCreatorPromoCodesResponse>("get_creator_promo_codes", form);
  },
};
