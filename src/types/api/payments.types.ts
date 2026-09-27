import type { ApiSimpleEnvelope } from "@/types/api/common.types";

// All shapes below are confirmed against the Flutter app's
// lib/webservice/apiservices.dart + lib/model/paymentoptionmodel.dart,
// coinpackagesmodel.dart, applypromocodemodel.dart — not guesses.

/** One gateway entry from get_payment_option (keys are the gateway credentials). */
export interface ApiPaymentGateway {
  id: number;
  name: string;
  visibility: string; // "1" = enabled
  is_live: string | null;
  key_1: string | null;
  key_2: string | null;
  key_3: string | null;
}

/** get_payment_option returns an object keyed by gateway slug, not a list. */
export interface ApiPaymentOptionsResult {
  inapppurchage?: ApiPaymentGateway;
  paypal?: ApiPaymentGateway;
  razorpay?: ApiPaymentGateway;
  flutterwave?: ApiPaymentGateway;
  payumoney?: ApiPaymentGateway;
  paytm?: ApiPaymentGateway;
  stripe?: ApiPaymentGateway;
  paystack?: ApiPaymentGateway;
  sslcommerz?: ApiPaymentGateway;
  cash?: ApiPaymentGateway;
}

export interface ApiPaymentOptionsResponse {
  status: number;
  message: string;
  result: ApiPaymentOptionsResult;
}

// get_coin_package
export interface ApiCoinPackageResult {
  id: number;
  name: string;
  price: number;
  coin: number;
  image: string | null;
  android_product_package: string | null;
  ios_product_package: string | null;
  web_product_package: string | null;
  status: number;
}

export type ApiCoinPackagesResponse = ApiSimpleEnvelope<ApiCoinPackageResult>;

// get_creator_promo_codes
export interface ApiCreatorPromoCode {
  id: number;
  user_id: number;
  name: string;
  code: string;
  discount: number;
  is_new_user_only: number;
  image: string | null;
  status: number;
  is_used: number;
}

export type ApiCreatorPromoCodesResponse = ApiSimpleEnvelope<ApiCreatorPromoCode>;

// apply_promo_code
export interface ApiApplyPromoResult {
  price: number;
  discount_price: number;
  final_price: number;
  promo_code_id: number;
}

export type ApiApplyPromoResponse = ApiSimpleEnvelope<ApiApplyPromoResult>;

// create_razorpay_order — returns the Razorpay order id used by checkout.js.
export interface ApiRazorpayOrderResponse {
  status: number;
  message: string;
  result: string;
}

// apply_coupon — confirmed against lib/model/couponmodel.dart. A separate
// discount system from promo codes: package purchases only, and
// discount_amount is the NEW FINAL PRICE (not a delta). result is a single
// object, not a list.
export interface ApiApplyCouponResult {
  id: number;
  unique_id: string;
  total_amount: number;
  discount_amount: number;
}

export interface ApiApplyCouponResponse {
  status: number;
  message: string;
  result: ApiApplyCouponResult | null;
}

// get_payment_token — confirmed against lib/model/paytmmodel.dart. Returns
// the value the mobile Paytm SDK passes as the transaction token
// (field is named paytmChecksum in the response).
export interface ApiPaytmTokenResult {
  paytmChecksum: string;
  verifySignature: boolean;
}

export interface ApiPaytmTokenResponse {
  status: number;
  message: string;
  result: ApiPaytmTokenResult | null;
}

export interface PaytmTokenRequest {
  merchantId: string;
  orderId: string;
  customerId: string;
  amount: string;
  isLive: boolean;
}
