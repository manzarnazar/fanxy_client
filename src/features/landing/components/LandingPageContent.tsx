import { LandingHero } from "@/features/landing/components/LandingHero";
import { LandingFeaturesGrid } from "@/features/landing/components/LandingFeaturesGrid";
import { LandingHowItWorks } from "@/features/landing/components/LandingHowItWorks";
import { LandingPricingPreview } from "@/features/landing/components/LandingPricingPreview";
import { LandingFaq } from "@/features/landing/components/LandingFaq";
import { LandingFinalCta } from "@/features/landing/components/LandingFinalCta";
import { LandingFooter } from "@/features/landing/components/LandingFooter";

interface LandingPageContentProps {
  onGetStarted: () => void;
}

export function LandingPageContent({ onGetStarted }: LandingPageContentProps) {
  return (
    <div className="min-h-full bg-background">
      <LandingHero onGetStarted={onGetStarted} />
      <LandingFeaturesGrid />
      <LandingHowItWorks />
      <LandingPricingPreview onGetStarted={onGetStarted} />
      <LandingFaq />
      <LandingFinalCta onGetStarted={onGetStarted} />
      <LandingFooter />
    </div>
  );
}
