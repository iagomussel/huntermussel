/// <reference types="@cloudflare/workers-types" />

interface Env {
  CONTACT_KV: KVNamespace;
}

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPayload(body: unknown): body is ContactPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    b.name.length <= 200 &&
    typeof b.email === "string" &&
    EMAIL_PATTERN.test(b.email) &&
    b.email.length <= 200 &&
    (b.phone === undefined || (typeof b.phone === "string" && b.phone.length <= 50)) &&
    typeof b.message === "string" &&
    b.message.trim().length > 0 &&
    b.message.length <= 5000
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
    return Response.json({ error: "Invalid contact payload" }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();
  const key = `contact:${submittedAt}:${crypto.randomUUID()}`;

  await context.env.CONTACT_KV.put(
    key,
    JSON.stringify({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || undefined,
      message: body.message.trim(),
      submittedAt,
      ip: context.request.headers.get("CF-Connecting-IP") || undefined,
    })
  );

  return Response.json({ ok: true });
};
