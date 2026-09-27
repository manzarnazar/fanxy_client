import type { Metadata } from "next";
import { WithdrawalsPageContent } from "@/features/withdrawals/components/WithdrawalsPageContent";

export const metadata: Metadata = {
  title: "Withdrawals | Fanxy",
  description:
    "Redeem your earned coins to your payout account on Fanxy.",
};

export default function WithdrawalsPage() {
  return <WithdrawalsPageContent />;
}
