import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { images } from "@/branding/image";

interface AppLogoProps {
  size?: number;
  className?: string;
  /** Server-configured logo (general_setting app_logo) — falls back to the bundled mark. */
  src?: string | null;
}

// Single source for the app's logo mark — update it in branding/image.ts (and
// the underlying file in public/images/) to change it everywhere at once.
export function AppLogo({ size = 36, className, src }: AppLogoProps) {
  return (
    <Image
      src={src || images.logoMark}
      alt="Fanxy"
      width={size}
      height={size}
      priority
      className={cn("rounded-md object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}
