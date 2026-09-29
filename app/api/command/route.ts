import { authorized, noStore } from "@/lib/auth";
import { sameOrigin } from "@/lib/access";
import { mutationSchema, DomainError } from "@/lib/domain";
import { mutate } from "@/lib/repository";
export async function POST(request: Request) {
  if (!await authorized(request)) return Response.json({ error: "Open your private link to save your work." }, { status: 401, headers: noStore });
  if (!sameOrigin(request)) return Response.json({ error: "Cross-origin changes are not allowed." }, { status: 403, headers: noStore });
  if (!request.headers.get("content-type")?.includes("application/json")) return Response.json({ error: "Use JSON." }, { status: 415, headers: noStore });
  try {
    const text = await request.text();
    if (text.length > 16000) return Response.json({ error: "This request is too large." }, { status: 413, headers: noStore });
    let raw; try { raw = JSON.parse(text); } catch { return Response.json({ error: "Invalid request." }, { status: 400, headers: noStore }); }
    const parsed = mutationSchema.safeParse(raw);
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Check your input." }, { status: 400, headers: noStore });
    const {requestId,revision,command} = parsed.data;
    return Response.json(await mutate(requestId,revision,command), { headers: noStore });
  } catch (error) {
    if (error instanceof DomainError) return Response.json({ error: error.message }, { status: error.status, headers: noStore });
    return Response.json({ error: "We could not confirm that this saved. Reconnect and retry the same action." }, { status: 503, headers: noStore });
  }
}
