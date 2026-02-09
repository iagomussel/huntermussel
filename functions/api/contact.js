/*
POST /api/contact – Formulário de CONTATO (Vamos construir juntos?).
Sends message to Telegram channel.
*/

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { ...CORS, "Access-Control-Max-Age": "86400" } });
}

export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { name, email, message } = body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return json({ error: "Nome, email e mensagem são obrigatórios." }, 400);
  }

  const telegramApiKey = context.env.TELEGRAM_API_KEY;
  const telegramChatId = context.env.TELEGRAM_CHAT_ID;
  if (!telegramApiKey || !telegramChatId) {
    return json({ error: "Serviço não configurado." }, 500);
  }

  const text = `Nome: ${name.trim()}\nEmail: ${email.trim()}\nMensagem: ${message.trim()}`;
  const url = `https://api.telegram.org/bot${telegramApiKey}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return json({ error: "Falha ao enviar. Tente novamente." }, 502);
  }

  return json({ success: true });
}
