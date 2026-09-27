import { Coins, Sparkles, Wallet, type LucideIcon } from "lucide-react";

export interface WalletStatDef {
  key: "wallet" | "coin" | "earned";
  label: string;
  icon: LucideIcon;
}

export const WALLET_STAT_DEFS: WalletStatDef[] = [
  { key: "wallet", label: "Wallet balance", icon: Wallet },
  { key: "coin", label: "Coin balance", icon: Coins },
  { key: "earned", label: "Earned coins", icon: Sparkles },
];
