import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiCreatorPromoCode } from "@/types/api/payments.types";
import type { PromoCode } from "@/features/promo-codes/types/promo-codes.types";

export function mapApiPromoCode(row: ApiCreatorPromoCode): PromoCode {
  return {
    id: String(row.id),
    name: row.name,
    code: row.code,
    discountPercent: row.discount,
    newUsersOnly: row.is_new_user_only === 1,
    imageUrl: sanitizeMediaUrl(row.image),
    active: row.status === 1,
  };
}
