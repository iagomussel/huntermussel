import type { Env } from "./types";

interface RateLimitResult {
  allowed: boolean;
  reason?: string;
}

interface ExpiringCounter {
  count: number;
  resetAt: number;
}

const sessionMessageCounts = new Map<string, ExpiringCounter>();
const ipSessionCounts = new Map<string, ExpiringCounter>();
const seenSessions = new Map<string, number>();

const HOUR_MS = 60 * 60 * 1000;
const SESSION_TTL_MS = 24 * HOUR_MS;
const MAX_TRACKED_KEYS = 5000;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function pruneExpired<T extends ExpiringCounter | number>(
  map: Map<string, T>,
  now: number
): void {
  if (map.size < MAX_TRACKED_KEYS) return;

  for (const [key, value] of map) {
    const expiresAt = typeof value === "number" ? value : value.resetAt;
    if (now >= expiresAt) {
      map.delete(key);
    }
  }
}

export function checkRateLimit(
  sessionId: string,
  clientIp: string,
  env: Env
): RateLimitResult {
  const maxMessages = parsePositiveInt(env.MAX_MESSAGES_PER_SESSION, 20);
  const maxSessions = parsePositiveInt(env.MAX_SESSIONS_PER_HOUR, 100);
  const now = Date.now();

  pruneExpired(sessionMessageCounts, now);
  pruneExpired(ipSessionCounts, now);
  pruneExpired(seenSessions, now);

  // Check per-session message count
  const messageCounter = sessionMessageCounts.get(sessionId);
  if (messageCounter && now < messageCounter.resetAt && messageCounter.count >= maxMessages) {
    return {
      allowed: false,
      reason:
        "You've reached the message limit for this session. Feel free to reach out directly — email contact@huntermussel.com or message on WhatsApp: https://wa.me/5521995775689",
    };
  }

  // Check per-IP session count
  const ipData = ipSessionCounts.get(clientIp);
  if (ipData && now < ipData.resetAt && ipData.count >= maxSessions) {
    return {
      allowed: false,
      reason: "Too many sessions. Please try again later.",
    };
  }

  return { allowed: true };
}

export function incrementMessageCount(sessionId: string): void {
  const now = Date.now();
  const current = sessionMessageCounts.get(sessionId);

  if (!current || now >= current.resetAt) {
    sessionMessageCounts.set(sessionId, { count: 1, resetAt: now + SESSION_TTL_MS });
    return;
  }

  current.count++;
}

export function trackSession(sessionId: string, clientIp: string): void {
  const now = Date.now();
  const sessionKey = `${clientIp}:${sessionId}`;
  const seenUntil = seenSessions.get(sessionKey);

  if (seenUntil && now < seenUntil) return;

  seenSessions.set(sessionKey, now + HOUR_MS);

  const ipData = ipSessionCounts.get(clientIp);
  if (!ipData || now >= ipData.resetAt) {
    ipSessionCounts.set(clientIp, { count: 1, resetAt: now + HOUR_MS });
  } else {
    ipData.count++;
  }
}
