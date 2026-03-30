import type { Env, ChatRequest } from "./types";
import { embedQuery, searchContent } from "./rag";
import { buildPrompt } from "./prompt";
import { streamOpenAIResponse, createFallbackStream } from "./stream";
import { checkRateLimit, incrementMessageCount, trackSession } from "./rate-limit";

function corsHeaders(origin: string, allowedOrigin: string): Record<string, string> {
  const isAllowed =
    origin === allowedOrigin ||
    origin === "http://localhost:4321" ||
    origin === "http://localhost:3000";

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigin,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function sanitizeInput(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}\p{S}]/gu, "")
    .trim()
    .slice(0, 2000);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin, env.CORS_ORIGIN);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      return handleChat(request, env, headers);
    }

    return new Response("Not Found", { status: 404, headers });
  },
};

async function handleChat(
  request: Request,
  env: Env,
  headers: Record<string, string>
): Promise<Response> {
  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  if (!body.messages?.length || !body.sessionId) {
    return new Response(
      JSON.stringify({ error: "Missing messages or sessionId" }),
      {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      }
    );
  }

  const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
  trackSession(clientIp);

  const rateCheck = checkRateLimit(body.sessionId, clientIp, env);
  if (!rateCheck.allowed) {
    const stream = createFallbackStream(rateCheck.reason!);
    return new Response(stream, {
      headers: {
        ...headers,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  incrementMessageCount(body.sessionId);

  const lastUserMessage = body.messages
    .filter((m) => m.role === "user")
    .pop();

  if (!lastUserMessage) {
    return new Response(
      JSON.stringify({ error: "No user message found" }),
      {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      }
    );
  }

  const sanitizedQuery = sanitizeInput(lastUserMessage.content);

  try {
    const queryEmbedding = await embedQuery(sanitizedQuery, env.AI);
    const context = await searchContent(
      queryEmbedding,
      env.VECTORIZE,
      env.CONTENT_STORE
    );

    const sanitizedMessages = body.messages.map((m) => ({
      role: m.role,
      content: sanitizeInput(m.content),
    }));

    const { systemPrompt, conversationMessages } = buildPrompt(
      sanitizedMessages,
      context
    );

    const stream = await streamOpenAIResponse({
      apiKey: env.OPENAI_API_KEY,
      systemPrompt,
      messages: conversationMessages,
    });

    return new Response(stream, {
      headers: {
        ...headers,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    const fallbackMessage =
      "I'm having trouble right now. Please reach out directly:\n\n" +
      "- Email: contact@huntermussel.com\n" +
      "- WhatsApp: https://wa.me/5521995775689\n" +
      "- Schedule a call: https://cal.com/iago-mussel-2zqprh/secret";

    const stream = createFallbackStream(fallbackMessage);
    return new Response(stream, {
      headers: {
        ...headers,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }
}
