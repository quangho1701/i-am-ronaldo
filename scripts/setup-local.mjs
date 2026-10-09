import { randomBytes, createHash } from "node:crypto";
import { mkdir, writeFile, access } from "node:fs/promises";
await mkdir(".private", { recursive: true });
try { await access(".env.development.local"); console.log("Local access already configured; keeping the existing key."); }
catch {
  const secret = randomBytes(32).toString("base64url");
  const hash = createHash("sha256").update(secret).digest("hex");
  await writeFile(".env.development.local", `ACCESS_KEY_HASH=${hash}\n`);
  await writeFile(".private/local-link.txt", `http://localhost:5173/#key=${secret}\n`);
  console.log("Local access configured. Your private local link is in .private/local-link.txt.");
}
