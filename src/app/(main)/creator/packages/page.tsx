import type { Metadata } from "next";
import { PackagesPageContent } from "@/features/packages/components/PackagesPageContent";

export const metadata: Metadata = {
  title: "Packages | Fanxy",
  description: "Create and manage your subscription packages on Fanxy.",
};

export default function PackagesPage() {
  return <PackagesPageContent />;
}
