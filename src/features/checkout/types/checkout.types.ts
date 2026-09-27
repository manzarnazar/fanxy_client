export type CheckoutKind = "subscription" | "coins";

export type CheckoutStep = "review" | "promo" | "payment" | "confirm" | "result";

export type CheckoutOutcome = "success" | "failed" | "cancelled";

/** Creator package being purchased (subscription checkout). */
export interface CheckoutPackage {
  id: string;
  creatorId: string;
  name: string;
  price: number;
  billingLabel: string;
  imageUrl: string | null;
  alreadyOwned: boolean;
}

/** Coin pack being purchased (coins checkout). */
export interface CheckoutCoinPack {
  id: string;
  name: string;
  price: number;
  coins: number;
  imageUrl: string | null;
}

export interface PaymentGatewayOption {
  key: string;
  label: string;
  sublabel: string;
  /** Only gateways with a real web flow are selectable; the rest are mobile-app-only. */
  webSupported: boolean;
  /** Publishable key (key_1) from get_payment_option. */
  publicKey: string | null;
  /** Gateway is_live flag — selects production vs staging hosts (Paytm). */
  isLive: boolean;
}

export interface AppliedPromo {
  /** "promo" = creator promo (apply_promo_code, recorded on the transaction);
   *  "coupon" = admin coupon (apply_coupon, only rewrites the charged price). */
  kind: "promo" | "coupon";
  code: string;
  promoCodeId: number;
  price: number;
  discountPrice: number;
  finalPrice: number;
}

export interface CreatorPromo {
  id: string;
  name: string;
  code: string;
  discountPercent: number;
  newUserOnly: boolean;
}

export interface CheckoutReceipt {
  transactionId: string;
  gatewayLabel: string;
  itemLabel: string;
  amountPaid: number;
  discount: number;
  promoCode: string | null;
}
