import type { Metadata } from "next";
import { WalletPageContent } from "@/features/wallet/components/WalletPageContent";

export const metadata: Metadata = {
  title: "My Wallet | yourappname",
  description: "Manage your coins and purchase history on yourappname.",
};

export default function WalletPage() {
  return <WalletPageContent />;
}
