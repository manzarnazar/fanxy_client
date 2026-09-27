import type { Metadata } from "next";
import { PromoCodesPageContent } from "@/features/promo-codes/components/PromoCodesPageContent";

export const metadata: Metadata = {
  title: "Promo Codes | yourappname",
  description:
    "Promotional campaigns fans can apply on your yourappname packages.",
};

export default function PromoCodesPage() {
  return <PromoCodesPageContent />;
}
