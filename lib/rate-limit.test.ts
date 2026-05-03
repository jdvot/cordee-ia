import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit } from "./rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    // Each test uses a fresh key so the in-memory map doesn't leak state.
  });

  it("allows requests under the limit", () => {
    const key = `t1-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      const r = rateLimit(key, { limit: 5, windowMs: 60_000 });
      expect(r.allowed).toBe(true);
      expect(r.remaining).toBe(4 - i);
    }
  });

  it("blocks requests over the limit", () => {
    const key = `t2-${Date.now()}`;
    for (let i = 0; i < 3; i++) rateLimit(key, { limit: 3, windowMs: 60_000 });
    const blocked = rateLimit(key, { limit: 3, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("returns a future reset timestamp", () => {
    const key = `t3-${Date.now()}`;
    const r = rateLimit(key, { limit: 1, windowMs: 60_000 });
    expect(r.reset).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("resets after the window expires", async () => {
    const key = `t4-${Date.now()}`;
    rateLimit(key, { limit: 1, windowMs: 50 });
    const blocked = rateLimit(key, { limit: 1, windowMs: 50 });
    expect(blocked.allowed).toBe(false);
    await new Promise((r) => setTimeout(r, 70));
    const allowed = rateLimit(key, { limit: 1, windowMs: 50 });
    expect(allowed.allowed).toBe(true);
  });

  it("isolates different keys", () => {
    const a = `t5a-${Date.now()}`;
    const b = `t5b-${Date.now()}`;
    rateLimit(a, { limit: 1, windowMs: 60_000 });
    const blockedA = rateLimit(a, { limit: 1, windowMs: 60_000 });
    const allowedB = rateLimit(b, { limit: 1, windowMs: 60_000 });
    expect(blockedA.allowed).toBe(false);
    expect(allowedB.allowed).toBe(true);
  });
});
