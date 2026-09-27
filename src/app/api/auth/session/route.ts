import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { STORAGE_KEYS } from "@/lib/constants/keys";

const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function POST(request: NextRequest) {
  const { token } = (await request.json()) as { token?: string };

  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(STORAGE_KEYS.AUTH_TOKEN, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(STORAGE_KEYS.AUTH_TOKEN);
  return response;
}
