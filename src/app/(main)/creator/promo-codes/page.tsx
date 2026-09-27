import type { Metadata } from "next";
import { PromoCodesPageContent } from "@/features/promo-codes/components/PromoCodesPageContent";

export const metadata: Metadata = {
  title: "Promo Codes | Fanxy",
  description:
    "Promotional campaigns fans can apply on your Fanxy packages.",
};

export default function PromoCodesPage() {
  return <PromoCodesPageContent />;
}
