import { authorized, noStore } from "@/lib/auth";
import { readState } from "@/lib/repository";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!await authorized(request)) return Response.json({ error: "Open your private link to access your tasks." }, { status: 401, headers: noStore });
  try { return Response.json(await readState(), { headers: noStore }); }
  catch { return Response.json({ error: "Your tasks could not be loaded. Please try again." }, { status: 503, headers: noStore }); }
}
