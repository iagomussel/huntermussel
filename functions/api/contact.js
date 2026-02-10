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

export async function onRequestPost(context) {
  const { request } = context;


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
    console.error("Missing Telegram configuration");
    return json({ error: "Serviço não configurado." }, 500);
  }

  const text = `📬 Novo Contato\n\nNome: ${name.trim()}\nEmail: ${email.trim()}\nMensagem: ${message.trim()}`;

  try {
    const url = `https://api.telegram.org/bot${telegramApiKey}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Telegram API Error:", result);
      return json({
        error: "Falha ao enviar para o Telegram.",
        details: result.description
      }, 502);
    }

    return json({ success: true });
  } catch (error) {
    console.error("Fetch Error:", error);
    return json({ error: "Erro interno ao processar envio." }, 500);
  }
}
