import { createSign } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Server-side FCM v1 sender for chat pushes.
 *
 * The Flutter app mints its OAuth token ON-DEVICE from a bundled service
 * account (assets/firebase/firebase_service_account.json) — that is unsafe on
 * the open web, so this route keeps the same service account in a server-only
 * env var and performs the identical FCM v1 call
 * (https://fcm.googleapis.com/v1/projects/{project}/messages:send) with the
 * exact payload shape the mobile app sends/expects (type: "chat", fromFId,
 * toFId, username, click_action: FLUTTER_NOTIFICATION_CLICK).
 *
 * Env: FIREBASE_SERVICE_ACCOUNT_KEY — the full service-account JSON string.
 */

interface ServiceAccount {
  project_id: string;
  client_email: string;
  private_key: string;
  token_uri: string;
}

interface ChatPushBody {
  token: string;
  title: string;
  body: string;
  fromFId: string;
  toFId: string;
  username: string;
}

const FCM_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";

let cachedAccessToken: { value: string; expiresAt: number } | null = null;

function base64Url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function readServiceAccount(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ServiceAccount>;
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) return null;
    return {
      project_id: parsed.project_id,
      client_email: parsed.client_email,
      // .env files often store the key with literal \n sequences.
      private_key: parsed.private_key.replace(/\\n/g, "\n"),
      token_uri: parsed.token_uri ?? "https://oauth2.googleapis.com/token",
    };
  } catch {
    return null;
  }
}

async function getAccessToken(account: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && cachedAccessToken.expiresAt > now + 60) return cachedAccessToken.value;

  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64Url(
    JSON.stringify({
      iss: account.client_email,
      scope: FCM_SCOPE,
      aud: account.token_uri,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const signature = signer.sign(account.private_key).toString("base64url");
  const assertion = `${header}.${claims}.${signature}`;

  const response = await fetch(account.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!response.ok) throw new Error(`OAuth token exchange failed (${response.status})`);
  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedAccessToken = { value: data.access_token, expiresAt: now + data.expires_in };
  return data.access_token;
}

export async function POST(request: NextRequest) {
  const account = readServiceAccount();
  if (!account) {
    return NextResponse.json(
      { error: "Push notifications are not configured (FIREBASE_SERVICE_ACCOUNT_KEY missing)." },
      { status: 503 },
    );
  }

  let body: ChatPushBody;
  try {
    body = (await request.json()) as ChatPushBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body.token || !body.body || !body.fromFId || !body.toFId) {
    return NextResponse.json({ error: "token, body, fromFId and toFId are required." }, { status: 400 });
  }

  try {
    const accessToken = await getAccessToken(account);
    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${account.project_id}/messages:send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        // Byte-compatible with the Flutter app's sendFCMPushNoti payload.
        body: JSON.stringify({
          message: {
            token: body.token,
            notification: { title: body.title, body: body.body },
            data: {
              type: "chat",
              fromFId: body.fromFId,
              toFId: body.toFId,
              username: body.username,
              click_action: "FLUTTER_NOTIFICATION_CLICK",
            },
            android: { priority: "high" },
            apns: { payload: { aps: { category: "fanxy" } } },
            webpush: {},
          },
        }),
      },
    );

    if (!response.ok) {
      const detail = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
      return NextResponse.json(
        { error: detail?.error?.message ?? `FCM send failed (${response.status}).` },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "FCM send failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
