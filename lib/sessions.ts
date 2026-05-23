import { createHmac, timingSafeEqual } from "crypto";

interface SessionData {
  userId: string;
  username: string;
  discriminator: string;
  avatar: string;
  email: string;
  isMember: boolean;
  isAdmin: boolean;
}

interface SessionPayload {
  userId: string;
  username: string;
  discriminator: string;
  avatar: string;
  email: string;
  isMember: boolean;
  isAdmin: boolean;
  exp: number;
}

const SESSION_DURATION = 7 * 24 * 60 * 60;

function base64UrlEncode(buffer: Buffer): string {
  return buffer.toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64UrlDecode(str: string): Buffer {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return Buffer.from(str, "base64");
}

export function createSession(
  user: { id: string; username: string; discriminator: string; avatar: string; email?: string; isMember: boolean; isAdmin?: boolean },
  secret: string
): string {
  const payload: SessionPayload = {
    userId: user.id,
    username: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar || "",
    email: user.email || "",
    isMember: user.isMember,
    isAdmin: user.isAdmin || false,
    exp: Date.now() + SESSION_DURATION * 1000,
  };

  const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const hmac = createHmac("sha256", secret);
  hmac.update(payloadB64);
  const sig = base64UrlEncode(hmac.digest());

  return `${payloadB64}.${sig}`;
}

export function getSession(signedId: string, secret: string): SessionData | null {
  const lastDot = signedId.lastIndexOf(".");
  if (lastDot === -1) return null;
  
  const payloadB64 = signedId.slice(0, lastDot);
  const sig = signedId.slice(lastDot + 1);

  const hmac = createHmac("sha256", secret);
  hmac.update(payloadB64);
  const expectedSig = base64UrlEncode(hmac.digest());

  let valid = false;
  try {
    valid = timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
  } catch {
    return null;
  }
  if (!valid) return null;

  try {
    const payload: SessionPayload = JSON.parse(base64UrlDecode(payloadB64).toString());
    if (Date.now() > payload.exp) return null;
    return {
      userId: payload.userId,
      username: payload.username,
      discriminator: payload.discriminator,
      avatar: payload.avatar,
      email: payload.email || "",
      isMember: payload.isMember,
      isAdmin: payload.isAdmin,
    };
  } catch {
    return null;
  }
}

export function parseSessionCookie(cookieHeader: string | null, secret: string): SessionData | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/odf_session=([^;]+)/);
  if (!match) return null;
  return getSession(match[1], secret);
}

export function makeSessionCookie(signedId: string, maxAge: number = SESSION_DURATION): string {
  return `odf_session=${signedId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
  return "odf_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}