import { NextResponse, type NextRequest } from "next/server";
import { PROTECTED_ROUTES, ROUTES } from "@/lib/constants/routes";
import { STORAGE_KEYS } from "@/lib/constants/keys";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route),
  );
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) {
    const signInUrl = new URL(ROUTES.SIGN_IN, request.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
