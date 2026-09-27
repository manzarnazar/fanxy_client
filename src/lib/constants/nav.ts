import {
  BadgePercent,
  BarChart3,
  Bell,
  CalendarClock,
  Camera,
  Clapperboard,
  Crown,
  FolderOpen,
  Home,
  Landmark,
  LayoutGrid,
  MessageCircle,
  Package,
  Radio,
  Settings,
  Sparkles,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

export interface PrimaryNavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { label: "Home", icon: Home, href: ROUTES.HOME },
  { label: "Reels", icon: Clapperboard, href: ROUTES.REELS },
  { label: "Live", icon: Radio, href: ROUTES.LIVE },
  { label: "Messages", icon: MessageCircle, href: ROUTES.MESSAGES },
  { label: "Wallet", icon: Wallet, href: ROUTES.WALLET },
] as const;

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

/** Full primary navigation shown in the global left sidebar (SidebarNav) on every (main) page. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: Home, href: ROUTES.HOME },
  { label: "Reels", icon: Clapperboard, href: ROUTES.REELS },
  { label: "Stories", icon: Sparkles, href: ROUTES.STORIES },
  { label: "Live", icon: Radio, href: ROUTES.LIVE },
  { label: "Messages", icon: MessageCircle, href: ROUTES.MESSAGES },
  { label: "Notifications", icon: Bell, href: ROUTES.NOTIFICATIONS },
  { label: "Subscriptions", icon: Crown, href: ROUTES.SUBSCRIPTIONS },
  { label: "Wallet", icon: Wallet, href: ROUTES.WALLET },
  // { label: "Bookmarks", icon: Bookmark, href: ROUTES.HOME },
  { label: "Leaderboard", icon: Trophy, href: ROUTES.LEADERBOARD },
  { label: "Settings", icon: Settings, href: ROUTES.SETTINGS },
];

export interface CreatorStudioNavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

export const CREATOR_STUDIO_NAV_ITEMS: CreatorStudioNavItem[] = [
  { label: "Creator Dashboard", icon: LayoutGrid, href: ROUTES.CREATOR_DASHBOARD },
  { label: "My Content", icon: FolderOpen, href: ROUTES.MY_CONTENT },
  { label: "Subscribers", icon: Users, href: ROUTES.SUBSCRIBERS },
  { label: "Go Live", icon: Radio, href: ROUTES.GO_LIVE },
  { label: "Upload Post", icon: Camera, href: ROUTES.UPLOAD_POST },
  { label: "Upload Story", icon: Sparkles, href: ROUTES.UPLOAD_STORY },
  { label: "Packages", icon: Package, href: ROUTES.PACKAGES },
  { label: "Analytics", icon: BarChart3, href: ROUTES.ANALYTICS },
  { label: "Scheduled Posts", icon: CalendarClock, href: ROUTES.SCHEDULED_POSTS },
  { label: "Withdrawals", icon: Landmark, href: ROUTES.WITHDRAWALS },
  { label: "Promo Codes", icon: BadgePercent, href: ROUTES.PROMO_CODES },
];
