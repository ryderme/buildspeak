import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Tiny .env loader — reads ../../.env (repo root) into process.env if not already set.
// Avoids pulling in dotenv as a runtime dep.
export function loadEnv(): void {
  const path = resolve(process.cwd(), "../../.env");
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^"(.*)"$/, "$1");
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) {
    throw new Error(`Missing required env: ${key}. Set it in /home/ubuntu/github/buildspeak/.env`);
  }
  return v;
}
