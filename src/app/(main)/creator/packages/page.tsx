import type { Metadata } from "next";
import { PackagesPageContent } from "@/features/packages/components/PackagesPageContent";

export const metadata: Metadata = {
  title: "Packages | yourappname",
  description: "Create and manage your subscription packages on yourappname.",
};

export default function PackagesPage() {
  return <PackagesPageContent />;
}
