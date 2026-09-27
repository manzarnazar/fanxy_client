import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiCreatorPackageResult } from "@/types/api/creator-dashboard.types";
import type {
  ApiCoinPackageResult,
  ApiCreatorPromoCode,
  ApiPaymentOptionsResult,
} from "@/types/api/payments.types";
import type {
  CheckoutCoinPack,
  CheckoutPackage,
  CreatorPromo,
  PaymentGatewayOption,
} from "@/features/checkout/types/checkout.types";

function billingLabel(time: number, type: string | null): string {
  const unit = (type || "Month").toLowerCase();
  return time > 1 ? `every ${time} ${unit}s` : `per ${unit}`;
}

export function mapCheckoutPackage(row: ApiCreatorPackageResult & { is_buy?: number }, creatorId: string): CheckoutPackage {
  return {
    id: String(row.id),
    creatorId,
    name: row.name,
    price: row.price,
    billingLabel: billingLabel(row.time, row.type),
    imageUrl: sanitizeMediaUrl(row.image),
    alreadyOwned: row.is_buy === 1,
  };
}

export function mapCheckoutCoinPack(row: ApiCoinPackageResult): CheckoutCoinPack {
  return {
    id: String(row.id),
    name: row.name,
    price: row.price,
    coins: row.coin,
    imageUrl: sanitizeMediaUrl(row.image),
  };
}

export function mapCreatorPromo(row: ApiCreatorPromoCode): CreatorPromo {
  return {
    id: String(row.id),
    name: row.name,
    code: row.code,
    discountPercent: row.discount,
    newUserOnly: row.is_new_user_only === 1,
  };
}

interface GatewayDef {
  key: keyof ApiPaymentOptionsResult;
  label: string;
  sublabel: string;
  webSupported: boolean;
}

// Razorpay (checkout.js + create_razorpay_order) and Paytm (checkout JS +
// get_payment_token) have real web flows. The others are shown but locked to
// the mobile app — their Flutter flows are SDK-only or, in Stripe's case,
// depend on using the secret key client-side, which must never reach a browser.
const GATEWAY_DEFS: GatewayDef[] = [
  { key: "razorpay", label: "Razorpay", sublabel: "UPI · Cards · Net Banking", webSupported: true },
  { key: "paytm", label: "PayTM", sublabel: "UPI · Cards · Paytm Wallet", webSupported: true },
  { key: "inapppurchage", label: "In-App Purchase", sublabel: "Available in the mobile app", webSupported: false },
  { key: "stripe", label: "Stripe", sublabel: "Available in the mobile app", webSupported: false },
  { key: "paypal", label: "PayPal", sublabel: "Available in the mobile app", webSupported: false },
  { key: "flutterwave", label: "Flutterwave", sublabel: "Available in the mobile app", webSupported: false },
  { key: "paystack", label: "Paystack", sublabel: "Available in the mobile app", webSupported: false },
  { key: "payumoney", label: "PayU Money", sublabel: "Available in the mobile app", webSupported: false },
  { key: "sslcommerz", label: "SSLCommerz", sublabel: "Available in the mobile app", webSupported: false },
];

export function mapPaymentGateways(result: ApiPaymentOptionsResult): PaymentGatewayOption[] {
  return GATEWAY_DEFS.flatMap((def) => {
    const gateway = result[def.key];
    if (!gateway || gateway.visibility !== "1") return [];
    return [
      {
        key: def.key,
        label: def.label,
        sublabel: def.sublabel,
        webSupported: def.webSupported,
        publicKey: gateway.key_1,
        isLive: gateway.is_live === "1",
      },
    ];
  });
}
