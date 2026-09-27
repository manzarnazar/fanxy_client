import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";
import { AppleSignInButton } from "@/features/auth/components/AppleSignInButton";

export function SocialLoginButtons() {
  return (
    <div className="flex gap-2.5">
      <GoogleSignInButton />
      <AppleSignInButton />
    </div>
  );
}
