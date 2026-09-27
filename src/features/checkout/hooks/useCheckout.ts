"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  applyPromoCode,
  checkoutReset,
  checkoutStepChanged,
  gatewaySelected,
  initCoinsCheckout,
  initSubscriptionCheckout,
  paymentFinished,
  paymentStarted,
  promoCleared,
} from "@/store/slices/checkoutSlice";
import { checkoutService } from "@/features/checkout/services/checkout.service";
import { generateClientOrderId, openRazorpayCheckout } from "@/features/checkout/utils/razorpay";
import { generatePaytmOrderId, openPaytmCheckout } from "@/features/checkout/utils/paytm";
import type { CheckoutStep, PaymentGatewayOption } from "@/features/checkout/types/checkout.types";

interface UseCheckoutParams {
  kind: "subscription" | "coins" | null;
  creatorId: string | null;
  packageId: string | null;
}

export function useCheckout({ kind, creatorId, packageId }: UseCheckoutParams) {
  const dispatch = useAppDispatch();
  const state = useAppSelector((store) => store.checkout);
  const user = useAppSelector((store) => store.auth.user);

  useEffect(() => {
    if (!user || !kind || !packageId) return;
    if (kind === "subscription") {
      if (!creatorId) return;
      void dispatch(initSubscriptionCheckout({ creatorId, packageId }));
    } else {
      void dispatch(initCoinsCheckout({ coinPackageId: packageId }));
    }
    return () => {
      dispatch(checkoutReset());
    };
  }, [dispatch, user, kind, creatorId, packageId]);

  const setStep = useCallback((step: CheckoutStep) => dispatch(checkoutStepChanged(step)), [dispatch]);
  const selectGateway = useCallback((key: string) => dispatch(gatewaySelected(key)), [dispatch]);
  const clearPromo = useCallback(() => dispatch(promoCleared()), [dispatch]);

  const applyPromo = useCallback(
    (code: string) => {
      if (!state.pkg) return;
      void dispatch(applyPromoCode({ packageId: state.pkg.id, code, packagePrice: state.pkg.price }));
    },
    [dispatch, state.pkg],
  );

  const finalPrice = state.appliedPromo
    ? state.appliedPromo.finalPrice
    : (state.pkg?.price ?? state.coinPack?.price ?? 0);
  const discount = state.appliedPromo?.discountPrice ?? 0;
  const itemLabel = state.kind === "coins" ? (state.coinPack?.name ?? "") : (state.pkg?.name ?? "");

  const pay = useCallback(async () => {
    const gateway = state.gateways.find((option) => option.key === state.selectedGatewayKey);
    dispatch(paymentStarted());

    const finish = (outcome: "success" | "failed" | "cancelled", transactionId?: string, gatewayLabel?: string) => {
      dispatch(
        paymentFinished({
          outcome,
          receipt:
            outcome === "success" && transactionId
              ? {
                  transactionId,
                  gatewayLabel: gatewayLabel ?? "—",
                  itemLabel,
                  amountPaid: finalPrice,
                  discount,
                  promoCode: state.appliedPromo?.code ?? null,
                }
              : null,
        }),
      );
    };

    const record = async (transactionId: string) => {
      if (state.kind === "subscription" && state.pkg) {
        await checkoutService.recordPackageTransaction({
          creatorId: state.pkg.creatorId,
          packageId: state.pkg.id,
          price: state.pkg.price,
          transactionId,
          description: `Subscribed to ${state.pkg.name}`,
          discountPrice: discount,
          finalPrice,
          promoCodeId: state.appliedPromo?.promoCodeId ?? 0,
        });
      } else if (state.kind === "coins" && state.coinPack) {
        await checkoutService.recordCoinTransaction(
          state.coinPack.id,
          state.coinPack.price,
          transactionId,
          `Purchased ${state.coinPack.name}`,
        );
      }
    };

    try {
      // Fully discounted orders skip the gateway — same as the mobile app.
      if (finalPrice <= 0) {
        const transactionId = generateClientOrderId();
        await record(transactionId);
        finish("success", transactionId, "Promo (100% off)");
        return;
      }

      if (!gateway?.webSupported || !gateway.publicKey) {
        finish("failed");
        return;
      }

      if (gateway.key === "paytm") {
        const result = await payWithPaytm(gateway);
        if (result.status === "cancelled") {
          finish("cancelled");
          return;
        }
        if (result.status === "failed") {
          finish("failed");
          return;
        }
        await record(result.transactionId);
        finish("success", result.transactionId, gateway.label);
        return;
      }

      const orderResponse = await checkoutService.createRazorpayOrder(finalPrice);
      const result = await openRazorpayCheckout({
        publicKey: gateway.publicKey,
        orderId: orderResponse.data.result,
        description: itemLabel,
      });

      if (result.status === "cancelled") {
        finish("cancelled");
        return;
      }
      await record(result.paymentId);
      finish("success", result.paymentId, gateway.label);
    } catch {
      finish("failed");
    }

    // Paytm web flow — same token mint the mobile app uses (get_payment_token),
    // fed into Paytm's hosted checkout JS.
    async function payWithPaytm(gateway: PaymentGatewayOption) {
      const orderId = generatePaytmOrderId();
      const amount = finalPrice.toFixed(2);
      const tokenResponse = await checkoutService.getPaytmToken({
        merchantId: gateway.publicKey ?? "",
        orderId,
        customerId: `${user?.id ?? "0"}_${orderId}`,
        amount,
        isLive: gateway.isLive,
      });
      const txnToken = tokenResponse.data.result?.paytmChecksum;
      if (!txnToken) return { status: "failed" as const };
      return openPaytmCheckout({
        merchantId: gateway.publicKey ?? "",
        orderId,
        txnToken,
        amount,
        isLive: gateway.isLive,
      });
    }
  }, [dispatch, state.gateways, state.selectedGatewayKey, state.kind, state.pkg, state.coinPack, state.appliedPromo, finalPrice, discount, itemLabel, user]);

  return {
    ...state,
    user,
    finalPrice,
    discount,
    itemLabel,
    setStep,
    selectGateway,
    applyPromo,
    clearPromo,
    pay,
  };
}
