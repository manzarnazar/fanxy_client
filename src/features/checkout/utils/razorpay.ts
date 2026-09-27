// Thin loader/wrapper around Razorpay's hosted checkout (checkout.js) —
// the same client-side-charge/record-transaction pattern the mobile app
// uses, with the order id coming from the backend's create_razorpay_order.

interface RazorpayCheckoutOptions {
  key: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: { razorpay_payment_id: string }) => void;
  modal: { ondismiss: () => void };
  theme: { color: string };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Razorpay failed to load.")));
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay failed to load."));
    document.body.appendChild(script);
  });
}

export interface RazorpayPaymentInput {
  publicKey: string;
  orderId: string;
  description: string;
}

export type RazorpayPaymentResult = { status: "success"; paymentId: string } | { status: "cancelled" };

export async function openRazorpayCheckout(input: RazorpayPaymentInput): Promise<RazorpayPaymentResult> {
  await loadScript();
  const RazorpayCtor = window.Razorpay;
  if (!RazorpayCtor) throw new Error("Razorpay is unavailable.");

  return new Promise((resolve) => {
    const instance = new RazorpayCtor({
      key: input.publicKey,
      order_id: input.orderId,
      name: "yourappname",
      description: input.description,
      handler: (response) => resolve({ status: "success", paymentId: response.razorpay_payment_id }),
      modal: { ondismiss: () => resolve({ status: "cancelled" }) },
      theme: { color: "#0085c7" },
    });
    instance.open();
  });
}

/**
 * Matches the mobile app's fallback for zero-price (fully discounted)
 * purchases, which are recorded with a client-generated order id.
 */
export function generateClientOrderId(): string {
  const random = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
  return `WEB-${Date.now()}-${random}`;
}
