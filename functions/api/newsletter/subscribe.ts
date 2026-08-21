/// <reference types="@cloudflare/workers-types" />

interface Env {
  CONTACT_KV: KVNamespace;
}

interface SubscribePayload {
  email: string;
  source?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPayload(body: unknown): body is SubscribePayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.email === "string" &&
    EMAIL_PATTERN.test(b.email) &&
    b.email.length <= 200 &&
    (b.source === undefined || (typeof b.source === "string" && b.source.length <= 50))
  );
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const key = `newsletter:${email}`;

  const existing = await context.env.CONTACT_KV.get(key);
  if (existing) {
    return Response.json({ ok: true, alreadySubscribed: true });
  }

  await context.env.CONTACT_KV.put(
    key,
    JSON.stringify({
      email,
      source: body.source?.trim() || undefined,
      subscribedAt: new Date().toISOString(),
      ip: context.request.headers.get("CF-Connecting-IP") || undefined,
    })
  );

  return Response.json({ ok: true });
};
