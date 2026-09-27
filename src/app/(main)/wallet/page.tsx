import type { Metadata } from "next";
import { WalletPageContent } from "@/features/wallet/components/WalletPageContent";

export const metadata: Metadata = {
  title: "My Wallet | Fanxy",
  description: "Manage your coins and purchase history on Fanxy.",
};

export default function WalletPage() {
  return <WalletPageContent />;
}
