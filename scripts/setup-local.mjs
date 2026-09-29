import { randomBytes, createHash } from "node:crypto";
import { mkdir, writeFile, access } from "node:fs/promises";
await mkdir(".private", { recursive: true });
try { await access(".dev.vars"); console.log("Local access already configured; keeping the existing key."); }
catch {
  const secret = randomBytes(32).toString("base64url");
  const hash = createHash("sha256").update(secret).digest("hex");
  await writeFile(".dev.vars", `ACCESS_KEY_HASH=${hash}\n`);
  await writeFile(".private/local-link.txt", `http://localhost:5173/#key=${secret}\n`);
  console.log("Local access configured. Your private local link is in .private/local-link.txt.");
}
await mkdir(".sites-runtime", { recursive: true });
await writeFile(".sites-runtime/d1.json", JSON.stringify({ name: "ronaldo-local", compatibility_date: "2026-05-15", d1_databases: [{ binding: "DB", database_name: "site-creator-d1", database_id: "00000000-0000-4000-8000-000000000000", migrations_dir: "../drizzle" }] }));
