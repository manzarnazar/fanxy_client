// Paytm's hosted web checkout (checkout JS). The transaction token comes
// from the backend's get_payment_token — the same endpoint the mobile app's
// (intended) Paytm flow feeds into its SDK — so web and mobile share one
// server-side token mint. Staging vs production hosts follow the gateway's
// is_live flag.

interface PaytmCheckoutJS {
  init: (config: object) => Promise<void>;
  invoke: () => void;
}

declare global {
  interface Window {
    Paytm?: { CheckoutJS?: PaytmCheckoutJS & { onLoad?: (callback: () => void) => void } };
  }
}

function scriptSrc(merchantId: string, isLive: boolean): string {
  const host = isLive ? "securegw.paytm.in" : "securegw-stage.paytm.in";
  return `https://${host}/merchantpgpui/checkoutjs/merchants/${merchantId}.js`;
}

function loadScript(merchantId: string, isLive: boolean): Promise<PaytmCheckoutJS> {
  return new Promise((resolve, reject) => {
    const ready = () => {
      const checkout = window.Paytm?.CheckoutJS;
      if (!checkout) {
        reject(new Error("Paytm checkout is unavailable."));
        return;
      }
      if (checkout.onLoad) checkout.onLoad(() => resolve(checkout));
      else resolve(checkout);
    };

    const src = scriptSrc(merchantId, isLive);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (window.Paytm?.CheckoutJS) ready();
      else {
        existing.addEventListener("load", ready);
        existing.addEventListener("error", () => reject(new Error("Paytm failed to load.")));
      }
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.crossOrigin = "anonymous";
    script.onload = ready;
    script.onerror = () => reject(new Error("Paytm failed to load."));
    document.body.appendChild(script);
  });
}

export interface PaytmPaymentInput {
  merchantId: string;
  orderId: string;
  txnToken: string;
  amount: string;
  isLive: boolean;
}

export type PaytmPaymentResult =
  | { status: "success"; transactionId: string }
  | { status: "failed" }
  | { status: "cancelled" };

export async function openPaytmCheckout(input: PaytmPaymentInput): Promise<PaytmPaymentResult> {
  const checkout = await loadScript(input.merchantId, input.isLive);

  return new Promise((resolve) => {
    const config = {
      root: "",
      flow: "DEFAULT",
      data: {
        orderId: input.orderId,
        token: input.txnToken,
        tokenType: "TXN_TOKEN",
        amount: input.amount,
      },
      merchant: { redirect: false },
      handler: {
        transactionStatus: (data: { STATUS?: string; TXNID?: string }) => {
          if (data.STATUS === "TXN_SUCCESS") {
            resolve({ status: "success", transactionId: data.TXNID || input.orderId });
          } else {
            resolve({ status: "failed" });
          }
        },
        notifyMerchant: (eventName: string) => {
          if (eventName === "APP_CLOSED") resolve({ status: "cancelled" });
        },
      },
    };

    checkout
      .init(config)
      .then(() => checkout.invoke())
      .catch(() => resolve({ status: "failed" }));
  });
}

/**
 * Digits-only order id, mirroring the mobile app's generateRandomOrderID
 * (utils.dart:2638) which Paytm requires for its order_id format.
 */
export function generatePaytmOrderId(): string {
  const random = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join("");
  return `${Date.now()}${random}`;
}
