import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { checkoutService } from "@/features/checkout/services/checkout.service";
import {
  mapCheckoutCoinPack,
  mapCheckoutPackage,
  mapCreatorPromo,
  mapPaymentGateways,
} from "@/features/checkout/mapper/checkout.mapper";
import type {
  AppliedPromo,
  CheckoutCoinPack,
  CheckoutKind,
  CheckoutOutcome,
  CheckoutPackage,
  CheckoutReceipt,
  CheckoutStep,
  CreatorPromo,
  PaymentGatewayOption,
} from "@/features/checkout/types/checkout.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface CheckoutState {
  kind: CheckoutKind | null;
  step: CheckoutStep;
  pkg: CheckoutPackage | null;
  coinPack: CheckoutCoinPack | null;
  gateways: PaymentGatewayOption[];
  promoCodes: CreatorPromo[];
  appliedPromo: AppliedPromo | null;
  applyingPromo: boolean;
  promoError: string | null;
  selectedGatewayKey: string | null;
  initStatus: RequestStatus;
  error: string | null;
  processing: boolean;
  outcome: CheckoutOutcome | null;
  receipt: CheckoutReceipt | null;
}

const initialState: CheckoutState = {
  kind: null,
  step: "review",
  pkg: null,
  coinPack: null,
  gateways: [],
  promoCodes: [],
  appliedPromo: null,
  applyingPromo: false,
  promoError: null,
  selectedGatewayKey: null,
  initStatus: "idle",
  error: null,
  processing: false,
  outcome: null,
  receipt: null,
};

interface SubscriptionBundle {
  pkg: CheckoutPackage;
  gateways: PaymentGatewayOption[];
  promoCodes: CreatorPromo[];
}

export const initSubscriptionCheckout = createAsyncThunk<
  SubscriptionBundle,
  { creatorId: string; packageId: string },
  { rejectValue: string }
>("checkout/initSubscription", async ({ creatorId, packageId }, { rejectWithValue }) => {
  try {
    const [packagesResponse, optionsResponse, promosResponse] = await Promise.all([
      checkoutService.getCreatorPackages(creatorId),
      checkoutService.getPaymentOptions(),
      checkoutService.getCreatorPromoCodes(creatorId).catch(() => null),
    ]);
    const row = packagesResponse.data.result.find((item) => String(item.id) === packageId);
    if (!row) return rejectWithValue("This package is no longer available.");
    return {
      pkg: mapCheckoutPackage(row, creatorId),
      gateways: mapPaymentGateways(optionsResponse.data.result),
      promoCodes: promosResponse ? promosResponse.data.result.filter((promo) => promo.status === 1).map(mapCreatorPromo) : [],
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const initCoinsCheckout = createAsyncThunk<
  { coinPack: CheckoutCoinPack; gateways: PaymentGatewayOption[] },
  { coinPackageId: string },
  { rejectValue: string }
>("checkout/initCoins", async ({ coinPackageId }, { rejectWithValue }) => {
  try {
    const [packsResponse, optionsResponse] = await Promise.all([
      checkoutService.getCoinPackages(),
      checkoutService.getPaymentOptions(),
    ]);
    const row = packsResponse.data.result.find((item) => String(item.id) === coinPackageId);
    if (!row) return rejectWithValue("This coin pack is no longer available.");
    return {
      coinPack: mapCheckoutCoinPack(row),
      gateways: mapPaymentGateways(optionsResponse.data.result),
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

// One entry point for both discount systems: creator promo codes
// (apply_promo_code — recorded on the transaction) are tried first, then
// admin coupons (apply_coupon — only rewrites the charged price, mirroring
// allpayment.dart, where discount_amount IS the new final price).
export const applyPromoCode = createAsyncThunk<
  AppliedPromo,
  { packageId: string; code: string; packagePrice: number },
  { rejectValue: string }
>("checkout/applyPromo", async ({ packageId, code, packagePrice }, { rejectWithValue }) => {
  try {
    const response = await checkoutService.applyPromoCode(packageId, code);
    const result = response.data.result[0];
    if (result) {
      return {
        kind: "promo" as const,
        code,
        promoCodeId: result.promo_code_id,
        price: result.price,
        discountPrice: result.discount_price,
        finalPrice: result.final_price,
      };
    }
  } catch {
    // Not a promo code — fall through to the coupon system.
  }

  try {
    const response = await checkoutService.applyCoupon(packageId, code);
    const result = response.data.result;
    if (!result) return rejectWithValue("Invalid or expired code.");
    const finalPrice = result.discount_amount;
    return {
      kind: "coupon" as const,
      code: result.unique_id || code,
      promoCodeId: 0,
      price: result.total_amount || packagePrice,
      discountPrice: Math.max(0, (result.total_amount || packagePrice) - finalPrice),
      finalPrice,
    };
  } catch {
    return rejectWithValue("Invalid or expired code.");
  }
});

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    checkoutReset: () => initialState,
    checkoutStepChanged: (state, action: PayloadAction<CheckoutStep>) => {
      state.step = action.payload;
    },
    gatewaySelected: (state, action: PayloadAction<string>) => {
      state.selectedGatewayKey = action.payload;
    },
    promoCleared: (state) => {
      state.appliedPromo = null;
      state.promoError = null;
    },
    paymentStarted: (state) => {
      state.processing = true;
    },
    paymentFinished: (
      state,
      action: PayloadAction<{ outcome: CheckoutOutcome; receipt: CheckoutReceipt | null }>,
    ) => {
      state.processing = false;
      state.outcome = action.payload.outcome;
      state.receipt = action.payload.receipt;
      state.step = action.payload.outcome === "cancelled" ? "confirm" : "result";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initSubscriptionCheckout.pending, (state) => {
        Object.assign(state, initialState);
        state.kind = "subscription";
        state.initStatus = "loading";
      })
      .addCase(initSubscriptionCheckout.fulfilled, (state, action) => {
        state.initStatus = "succeeded";
        state.pkg = action.payload.pkg;
        state.gateways = action.payload.gateways;
        state.promoCodes = action.payload.promoCodes;
        state.selectedGatewayKey = action.payload.gateways.find((gateway) => gateway.webSupported)?.key ?? null;
      })
      .addCase(initSubscriptionCheckout.rejected, (state, action) => {
        state.initStatus = "failed";
        state.error = action.payload ?? "Unable to load checkout.";
      })
      .addCase(initCoinsCheckout.pending, (state) => {
        Object.assign(state, initialState);
        state.kind = "coins";
        state.initStatus = "loading";
      })
      .addCase(initCoinsCheckout.fulfilled, (state, action) => {
        state.initStatus = "succeeded";
        state.coinPack = action.payload.coinPack;
        state.gateways = action.payload.gateways;
        state.selectedGatewayKey = action.payload.gateways.find((gateway) => gateway.webSupported)?.key ?? null;
      })
      .addCase(initCoinsCheckout.rejected, (state, action) => {
        state.initStatus = "failed";
        state.error = action.payload ?? "Unable to load checkout.";
      })
      .addCase(applyPromoCode.pending, (state) => {
        state.applyingPromo = true;
        state.promoError = null;
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.applyingPromo = false;
        state.appliedPromo = action.payload;
      })
      .addCase(applyPromoCode.rejected, (state, action) => {
        state.applyingPromo = false;
        state.promoError = action.payload ?? "Invalid or expired promo code.";
      });
  },
});

export const {
  checkoutReset,
  checkoutStepChanged,
  gatewaySelected,
  promoCleared,
  paymentStarted,
  paymentFinished,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
