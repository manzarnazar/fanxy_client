import {
  BarChart3,
  Coins,
  Crown,
  Gift,
  Heart,
  Lock,
  MessageCircle,
  Radio,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface TrustStatDef {
  value: string;
  label: string;
}

export const TRUST_STATS: TrustStatDef[] = [
  { value: "50K+", label: "Creators" },
  { value: "2M+", label: "Subscribers" },
  { value: "10M+", label: "Messages sent" },
  { value: "500K+", label: "Live sessions" },
];

export interface FeatureDef {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: FeatureDef[] = [
  { icon: Sparkles, title: "Stories", description: "Share 24-hour updates that keep your community engaged every day." },
  { icon: Radio, title: "Live Streaming", description: "Go live and connect with fans in real time, wherever you are." },
  { icon: Lock, title: "Premium Posts", description: "Publish exclusive photos and videos only your subscribers can see." },
  { icon: Crown, title: "Exclusive Reels", description: "Short-form video content behind your subscription tiers." },
  { icon: MessageCircle, title: "Private Chat", description: "Message your subscribers directly and build real relationships." },
  { icon: Heart, title: "Subscriptions", description: "Set your own pricing and earn recurring monthly income." },
  { icon: Gift, title: "Gift System", description: "Fans can send gifts during live streams and in chat." },
  { icon: Coins, title: "Coin Wallet", description: "Track earnings, tips and gifts in one simple wallet." },
  { icon: BarChart3, title: "Analytics", description: "See exactly what's working with real subscriber insights." },
];

export interface HowItWorksStepDef {
  step: number;
  title: string;
  description: string;
}

export const HOW_IT_WORKS_STEPS: HowItWorksStepDef[] = [
  { step: 1, title: "Create Account", description: "Sign up in seconds with Google, Apple, or your phone number." },
  { step: 2, title: "Become a Creator", description: "Verify your details and unlock creator tools." },
  { step: 3, title: "Upload Content", description: "Share posts, reels, stories and go live for your subscribers." },
  { step: 4, title: "Earn Money", description: "Get paid every month from subscriptions, tips and gifts." },
];

export interface PricingPlanDef {
  name: string;
  price: number;
  highlighted: boolean;
  benefits: string[];
}

export const PRICING_PLANS: PricingPlanDef[] = [
  { name: "Starter", price: 9.99, highlighted: false, benefits: ["Access to premium posts", "Direct messaging", "Cancel anytime"] },
  {
    name: "Premium VIP",
    price: 24.99,
    highlighted: true,
    benefits: ["Everything in Starter", "Exclusive reels & stories", "Live stream access", "Priority chat replies"],
  },
  {
    name: "Gold",
    price: 59.99,
    highlighted: false,
    benefits: ["Everything in Premium VIP", "1:1 private chat", "Custom content requests"],
  },
];

export interface FaqItemDef {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItemDef[] = [
  {
    question: "How much does it cost to join?",
    answer: "Creating an account is completely free. You only pay when you subscribe to a creator, and creators set their own prices.",
  },
  {
    question: "How do creators get paid?",
    answer:
      "Creators earn from subscriptions, tips, coins and gifts. Earnings land in your wallet and can be withdrawn to your bank anytime above the minimum.",
  },
  {
    question: "What can I share as a creator?",
    answer: "Premium posts, exclusive reels, 24-hour stories, live streams and private chat — all behind the subscription tiers you define.",
  },
  {
    question: "Is my payment secure?",
    answer: "Yes. All payments run through PCI-DSS certified gateways with 256-bit encryption. We never store your card details.",
  },
  {
    question: "Can I cancel a subscription anytime?",
    answer: "Absolutely. Cancel in one tap; your access continues until the end of the current billing period with no further charges.",
  },
];
