/**
 * Lightweight in-memory rate limiter.
 *
 * Caveats:
 *   - In-memory store: works on a single Vercel instance. With Fluid Compute
 *     reusing instances and traffic concentrated on a few, this is enough to
 *     deter casual abuse without the cost of Vercel KV / Upstash.
 *   - Resets on cold start.
 *   - Key by IP from x-forwarded-for; falls back to a coarse bucket if absent.
 *
 * Upgrade path: replace with `@upstash/ratelimit` + KV when traffic justifies.
 */

type Bucket = { tokens: number; resetAt: number };

const STORE = new Map<string, Bucket>();
const MAX_KEYS = 5000; // Bounded to prevent memory growth from random IPs.

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number; // epoch seconds when the window resets
}

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  let bucket = STORE.get(key);

  if (!bucket || bucket.resetAt <= now) {
    bucket = { tokens: opts.limit, resetAt: now + opts.windowMs };
    STORE.set(key, bucket);
  }

  if (STORE.size > MAX_KEYS) {
    // Evict any expired entries first; then trim oldest if still over.
    for (const [k, b] of STORE) {
      if (b.resetAt <= now) STORE.delete(k);
      if (STORE.size <= MAX_KEYS) break;
    }
  }

  if (bucket.tokens <= 0) {
    return {
      allowed: false,
      remaining: 0,
      reset: Math.floor(bucket.resetAt / 1000),
    };
  }

  bucket.tokens -= 1;
  return {
    allowed: true,
    remaining: bucket.tokens,
    reset: Math.floor(bucket.resetAt / 1000),
  };
}

/**
 * Extract a usable client identifier from request headers.
 * Vercel sets x-forwarded-for; we take the first IP in the chain.
 */
export function clientKey(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "anonymous";
}
