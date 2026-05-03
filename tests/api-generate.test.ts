/**
 * API-level tests for the generator.
 *
 * These tests hit the deployed production endpoint to validate the contract
 * end-to-end (zod, file selection, stack-aware variants, team setup).
 *
 * They are skipped if the prod URL isn't reachable (offline CI) — the goal
 * is a smoke test, not a hard gate.
 */
import { describe, it, expect } from "vitest";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { writeFileSync, readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";

const execAsync = promisify(exec);

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cordee-ia.vercel.app";

async function generate(payload: object): Promise<{
  status: number;
  files: string[];
  bytes: number;
}> {
  const dir = mkdtempSync(path.join(tmpdir(), "cordee-test-"));
  const zip = path.join(dir, "out.zip");
  try {
    const res = await fetch(`${SITE}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { status: res.status, files: [], bytes: 0 };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(zip, buf);
    const { stdout } = await execAsync(`unzip -l "${zip}"`);
    const files = stdout
      .split("\n")
      .filter((l) => /^\s+\d+/.test(l))
      .map((l) => l.trim().split(/\s+/).slice(3).join(" "));
    return { status: res.status, files, bytes: buf.length };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const SKIP = process.env.SKIP_E2E === "1";

describe.skipIf(SKIP)("/api/generate", () => {
  it("rejects an invalid payload with 400", async () => {
    const r = await fetch(`${SITE}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ projectName: "" }),
    });
    expect(r.status).toBe(400);
  });

  it("generates a zip for a minimal greenfield request", async () => {
    const { status, files, bytes } = await generate({
      projectName: "test-min",
      mode: "greenfield",
      designSystem: "skip",
    });
    expect(status).toBe(200);
    expect(bytes).toBeGreaterThan(1000);
    expect(files.some((f) => f.includes("CLAUDE.md"))).toBe(true);
    expect(files.some((f) => f.includes("install.sh"))).toBe(true);
  });

  it("picks the Python test-writer variant for FastAPI", async () => {
    const { status, files } = await generate({
      projectName: "test-fastapi",
      mode: "greenfield",
      stack: ["fastapi"],
      agents: ["test-writer"],
      designSystem: "skip",
    });
    expect(status).toBe(200);
    expect(files.some((f) => f.endsWith(".claude/agents/test-writer.md"))).toBe(true);
  });

  it("includes team setup files when teamSetup is true", async () => {
    const { status, files } = await generate({
      projectName: "test-team",
      mode: "greenfield",
      designSystem: "skip",
      teamSetup: true,
    });
    expect(status).toBe(200);
    expect(files.some((f) => f.includes("CONTRIBUTING.md"))).toBe(true);
    expect(files.some((f) => f.includes("CODEOWNERS"))).toBe(true);
    expect(files.some((f) => f.includes("PULL_REQUEST_TEMPLATE"))).toBe(true);
  });

  it("filters MCPs to only those checked", async () => {
    const { status, files } = await generate({
      projectName: "test-mcp",
      mode: "greenfield",
      mcps: ["notion"],
      designSystem: "skip",
    });
    expect(status).toBe(200);
    const mcp = files.find((f) => f.endsWith(".mcp.json"));
    expect(mcp).toBeTruthy();
  });
});
