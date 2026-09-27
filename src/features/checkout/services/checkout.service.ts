import apiClient from "@/services/api.client";
import type { ApiSuccessEnvelope } from "@/types/api/common.types";
import type { ApiCreatorPackagesResponse } from "@/types/api/creator-dashboard.types";
import type {
  ApiApplyCouponResponse,
  ApiApplyPromoResponse,
  ApiCoinPackagesResponse,
  ApiCreatorPromoCodesResponse,
  ApiPaymentOptionsResponse,
  ApiPaytmTokenResponse,
  ApiRazorpayOrderResponse,
  PaytmTokenRequest,
} from "@/types/api/payments.types";

export interface RecordPackageTransactionInput {
  creatorId: string;
  packageId: string;
  price: number;
  transactionId: string;
  description: string;
  discountPrice: number;
  finalPrice: number;
  promoCodeId: number;
}

// Endpoint names and payload fields confirmed against the Flutter app's
// lib/webservice/apiservices.dart (get_payment_option, get_creator_package,
// get_coin_package, get_creator_promo_codes, apply_promo_code,
// create_razorpay_order, add_creator_package_transaction,
// add_coin_transaction) — not guesses. The gateway charge itself happens
// client-side (matching the mobile app); the backend only records the
// resulting transaction id.
export const checkoutService = {
  getPaymentOptions: () => apiClient.post<ApiPaymentOptionsResponse>("get_payment_option"),

  getCreatorPackages: (creatorId: string, packageId = "0") =>
    apiClient.post<ApiCreatorPackagesResponse>("get_creator_package", {
      to_user_id: creatorId,
      package_id: packageId,
    }),

  getCoinPackages: () => apiClient.post<ApiCoinPackagesResponse>("get_coin_package"),

  getCreatorPromoCodes: (creatorId: string) =>
    apiClient.post<ApiCreatorPromoCodesResponse>("get_creator_promo_codes", { to_user_id: creatorId }),

  applyPromoCode: (packageId: string, code: string) =>
    apiClient.post<ApiApplyPromoResponse>("apply_promo_code", { creator_package_id: packageId, code }),

  createRazorpayOrder: (price: number) =>
    apiClient.post<ApiRazorpayOrderResponse>("create_razorpay_order", { price }),

  recordPackageTransaction: (input: RecordPackageTransactionInput) =>
    apiClient.post<ApiSuccessEnvelope>("add_creator_package_transaction", {
      to_user_id: input.creatorId,
      creator_package_id: input.packageId,
      price: input.price,
      transaction_id: input.transactionId,
      description: input.description,
      discount_price: input.discountPrice,
      final_price: input.finalPrice,
      promo_code_id: input.promoCodeId,
    }),

  recordCoinTransaction: (coinPackageId: string, price: number, transactionId: string, description: string) =>
    apiClient.post<ApiSuccessEnvelope>("add_coin_transaction", {
      coin_package_id: coinPackageId,
      price,
      transaction_id: transactionId,
      description,
    }),

  // apply_coupon — package purchases only; apply_coupon_type is hardcoded to
  // "1" and unique_id carries the code (mirrors allpayment.dart applyCoupon).
  applyCoupon: (packageId: string, code: string) =>
    apiClient.post<ApiApplyCouponResponse>("apply_coupon", {
      apply_coupon_type: "1",
      unique_id: code,
      package_id: packageId,
    }),

  // get_payment_token — Paytm transaction token, minted server-side with the
  // exact param set the mobile app sends (allpayment.dart paytmInit).
  getPaytmToken: (input: PaytmTokenRequest) =>
    apiClient.post<ApiPaytmTokenResponse>("get_payment_token", {
      MID: input.merchantId,
      order_id: input.orderId,
      CUST_ID: input.customerId,
      CHANNEL_ID: "WAP",
      TXN_AMOUNT: input.amount,
      WEBSITE: input.isLive ? "DEFAULT" : "WEBSTAGING",
      CALLBACK_URL: `https://${input.isLive ? "securegw" : "securegw-stage"}.paytm.in/theia/paytmCallback?ORDER_ID=${input.orderId}`,
      INDUSTRY_TYPE_ID: "Retail",
    }),
};
