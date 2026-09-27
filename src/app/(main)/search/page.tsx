import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { SearchPageContent } from "@/features/search/components/SearchPageContent";

export const metadata: Metadata = {
  title: "Search | Fanxy",
  description: "Discover creators and users on Fanxy.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-w-0 flex-1 items-center justify-center">
          <Loader2
            className="h-8 w-8 animate-spin text-primary-light"
            aria-hidden="true"
          />
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
