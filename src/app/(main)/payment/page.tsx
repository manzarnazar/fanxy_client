import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { CheckoutPageContent } from "@/features/checkout/components/CheckoutPageContent";

export const metadata: Metadata = {
  title: "Secure Checkout | yourappname",
  description: "Complete your purchase securely on yourappname.",
};

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-w-0 flex-1 items-center justify-center">
          <Loader2
            className="h-8 w-8 animate-spin text-primary-light"
            aria-hidden="true"
          />
        </main>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
