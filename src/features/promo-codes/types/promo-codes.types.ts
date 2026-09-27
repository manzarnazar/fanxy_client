/**
 * A creator's promo code from get_creator_promo_codes. Codes are created and
 * managed in the platform's admin panel — the API exposes NO create/edit/
 * delete/toggle endpoints, so this feature is intentionally read-only.
 */
export interface PromoCode {
  id: string;
  name: string;
  code: string;
  discountPercent: number;
  newUsersOnly: boolean;
  imageUrl: string | null;
  active: boolean;
}

export type PromoCodesFilter = "all" | "new-users";
