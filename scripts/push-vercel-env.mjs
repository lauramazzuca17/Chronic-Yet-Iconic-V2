/**
 * Push .env.local secrets to Vercel Production (and Preview).
 * Prerequisites: `npx vercel login` then `npx vercel link`
 * Usage: node --env-file=.env.local scripts/push-vercel-env.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const REQUIRED = [
  "TURSO_DATABASE_URL",
  "TURSO_AUTH_TOKEN",
  "SESSION_SECRET",
  "SEED_PASSWORD_LAURA",
  "SEED_PASSWORD_DEMO",
];

function loadEnvLocal() {
  const path = ".env.local";
  if (!existsSync(path)) {
    throw new Error("Missing .env.local — create it first");
  }
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    out[t.slice(0, i)] = t.slice(i + 1);
  }
  return out;
}

function vercelEnvAdd(name, value, environment) {
  const r = spawnSync(
    "npx",
    ["vercel", "env", "add", name, environment, "--force"],
    {
      input: `${value}\n`,
      encoding: "utf8",
      shell: true,
    }
  );
  if (r.status !== 0) {
    console.error(r.stdout || "");
    console.error(r.stderr || "");
    throw new Error(`Failed to set ${name} for ${environment}`);
  }
  console.log(`OK ${name} → ${environment}`);
}

const env = loadEnvLocal();
for (const key of REQUIRED) {
  if (!env[key]) throw new Error(`Missing ${key} in .env.local`);
}

if (!existsSync(".vercel/project.json")) {
  throw new Error("Run `npx vercel link` first");
}

for (const key of REQUIRED) {
  for (const target of ["production", "preview"]) {
    vercelEnvAdd(key, env[key], target);
  }
}

console.log("Done. Redeploy production for env to take effect.");
