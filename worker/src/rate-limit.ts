import type { Env } from "./types";

interface RateLimitResult {
  allowed: boolean;
  reason?: string;
}

const sessionMessageCounts = new Map<string, number>();
const ipSessionCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  sessionId: string,
  clientIp: string,
  env: Env
): RateLimitResult {
  const maxMessages = parseInt(env.MAX_MESSAGES_PER_SESSION) || 20;
  const maxSessions = parseInt(env.MAX_SESSIONS_PER_HOUR) || 100;

  // Check per-session message count
  const messageCount = sessionMessageCounts.get(sessionId) || 0;
  if (messageCount >= maxMessages) {
    return {
      allowed: false,
      reason:
        "You've reached the message limit for this session. Feel free to reach out directly — email contact@huntermussel.com or message on WhatsApp: https://wa.me/5521995775689",
    };
  }

  // Check per-IP session count
  const now = Date.now();
  const ipData = ipSessionCounts.get(clientIp);
  if (ipData && now < ipData.resetAt) {
    if (ipData.count >= maxSessions) {
      return {
        allowed: false,
        reason: "Too many sessions. Please try again later.",
      };
    }
  }

  return { allowed: true };
}

export function incrementMessageCount(sessionId: string): void {
  const current = sessionMessageCounts.get(sessionId) || 0;
  sessionMessageCounts.set(sessionId, current + 1);
}

export function trackSession(clientIp: string): void {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;
  const ipData = ipSessionCounts.get(clientIp);

  if (!ipData || now >= ipData.resetAt) {
    ipSessionCounts.set(clientIp, { count: 1, resetAt: now + hourMs });
  } else {
    ipData.count++;
  }
}
