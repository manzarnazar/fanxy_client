import { AppLogo } from "@/components/shared/AppLogo";

export function LandingFooter() {
  return (
    <footer className="border-t border-primary/12 bg-background px-6.5 py-8">
      <div className="mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <AppLogo size={28} />
          <span className="font-display text-[15px] font-semibold text-text-primary">
            Fanxy
          </span>
        </div>
        <p className="font-sans text-[12px] font-light text-text-muted">
          © {new Date().getFullYear()} Fanxy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
