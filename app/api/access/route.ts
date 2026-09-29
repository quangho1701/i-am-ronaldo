import { ACCESS_COOKIE, YEAR_SECONDS, exchangeSecret, sameOrigin } from "@/lib/access";
import { accessHash, noStore } from "@/lib/auth";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Open your private link in this app." }, { status: 403, headers: noStore });
  if (!request.headers.get("content-type")?.includes("application/json")) return Response.json({ error: "Use JSON." }, { status: 415, headers: noStore });
  if (!accessHash()) return Response.json({ error: "Private access has not been configured yet." }, { status: 503, headers: noStore });
  try {
    const text = await request.text();
    if (text.length > 1000) throw new Error("Invalid link");
    const { key } = JSON.parse(text);
    const cookie = typeof key === "string" ? await exchangeSecret(key, accessHash()) : null;
    if (!cookie) return Response.json({ error: "That private link is not valid. Use your current link." }, { status: 401, headers: noStore });
    return Response.json({ ok: true }, { headers: { ...noStore, "Set-Cookie": `${ACCESS_COOKIE}=${cookie}; HttpOnly; Secure; SameSite=Lax; Max-Age=${YEAR_SECONDS}; Path=/` } });
  } catch { return Response.json({ error: "Check your private link and try again." }, { status: 400, headers: noStore }); }
}
