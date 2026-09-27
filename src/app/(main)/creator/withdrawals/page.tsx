import type { Metadata } from "next";
import { WithdrawalsPageContent } from "@/features/withdrawals/components/WithdrawalsPageContent";

export const metadata: Metadata = {
  title: "Withdrawals | yourappname",
  description:
    "Redeem your earned coins to your payout account on yourappname.",
};

export default function WithdrawalsPage() {
  return <WithdrawalsPageContent />;
}
