import { env } from "cloudflare:workers";
import { ACCESS_COOKIE, validCookie } from "./access";
export const noStore = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" };
export function accessHash(): string { return env.ACCESS_KEY_HASH ?? ""; }
export async function authorized(request: Request) {
  const cookie = request.headers.get("cookie")?.split(";").map(s => s.trim()).find(s => s.startsWith(`${ACCESS_COOKIE}=`))?.slice(ACCESS_COOKIE.length + 1) ?? "";
  return validCookie(cookie, accessHash());
}
