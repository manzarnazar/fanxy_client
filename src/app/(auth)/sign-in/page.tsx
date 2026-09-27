import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthBrandingPanel } from "@/features/auth/components/AuthBrandingPanel";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Fanxy",
  description:
    "Sign in to your Fanxy account to continue your premium experience.",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-screen bg-background">
      <AuthBrandingPanel />
      <section className="relative flex flex-1 items-center justify-center overflow-y-auto border-l border-border px-6 py-11 sm:px-8">
        <div className="pointer-events-none absolute -top-[90px] -right-[70px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(0,175,240,.12),transparent_66%)]" />
        <div className="relative w-full max-w-[27rem] animate-[rise_0.7s_ease-out_0.1s_both]">
          <div className="rounded-xl border border-border bg-surface-elevated/70 px-[34px] py-9 shadow-card backdrop-blur-xl">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-[18px] text-center text-[11px] leading-relaxed font-light text-text-muted">
            By continuing you agree to our Terms of Service &amp; Privacy Policy
            <br />
            18+ · Adults only · Members verified
          </p>
        </div>
      </section>
    </main>
  );
}
