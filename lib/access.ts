const encoder = new TextEncoder();
export const ACCESS_COOKIE = "ronaldo_access";
export const YEAR_SECONDS = 365 * 24 * 60 * 60;
export async function hashSecret(secret: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, "0")).join("");
}
async function signature(value: string, hash: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(hash), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, "0")).join("");
}
function equal(a: string, b: string) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}
export async function exchangeSecret(secret: string, hash: string, now = Date.now()): Promise<string | null> {
  if (!/^[a-f0-9]{64}$/.test(hash) || !/^[A-Za-z0-9_-]{43}$/.test(secret)) return null;
  if (!equal(await hashSecret(secret), hash)) return null;
  const expiry = String(Math.floor(now / 1000) + YEAR_SECONDS);
  return `${expiry}.${await signature(`ronaldo-device:${expiry}`, hash)}`;
}
export async function validCookie(cookie: string, hash: string, now = Date.now()): Promise<boolean> {
  if (!/^[a-f0-9]{64}$/.test(hash)) return false;
  const [expiry, mac, extra] = cookie.split(".");
  if (extra || !/^\d{10}$/.test(expiry ?? "") || !/^[a-f0-9]{64}$/.test(mac ?? "")) return false;
  if (Number(expiry) <= now / 1000 || Number(expiry) > now / 1000 + YEAR_SECONDS + 60) return false;
  return equal(mac, await signature(`ronaldo-device:${expiry}`, hash));
}
export function sameOrigin(request: Request): boolean {
  return request.headers.get("sec-fetch-site") !== "cross-site" && request.headers.get("origin") === new URL(request.url).origin;
}
