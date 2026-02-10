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
  return new Response(null, {
    status: 204,
    headers: { ...CORS, "Access-Control-Max-Age": "86400" },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // Cloudflare context (prod) - headers (mais confiável)
  const ip = request.headers.get("CF-Connecting-IP") || "N/A";
  const country = request.headers.get("CF-IPCountry") || "N/A";
  const city = request.headers.get("CF-IPCity") || "N/A";
  const region = request.headers.get("CF-Region") || "N/A";
  const isp = request.headers.get("CF-Organization") || "N/A";
  const asn = request.headers.get("CF-ASN") || "N/A";
  const ua = request.headers.get("User-Agent") || "N/A";

  let body;
  try {
    const ct = request.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      return json({ error: "Content-Type must be application/json" }, 415);
    }
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const name = (body?.name ?? "").trim();
  const email = (body?.email ?? "").trim();
  const phone = (body?.phone ?? "").trim();
  const message = (body?.message ?? "").trim();

  if (!name || !email || !message) {
    return json({ error: "Nome, email e mensagem são obrigatórios." }, 400);
  }

  // (opcional) validação simples de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return json({ error: "Email inválido." }, 400);
  }


  const telegramApiKey = env.TELEGRAM_API_KEY;
  const telegramChatId = env.TELEGRAM_CHAT_ID;

  if (!telegramApiKey || !telegramChatId) {
    console.error("Missing Telegram configuration", {
      hasKey: !!telegramApiKey,
      hasChatId: !!telegramChatId,
    });
    return json({ error: "Serviço não configurado." }, 500);
  }

  const fingerprint = `${ip}|${ua}|${country}`;

  const text =
    `📬 Novo Contato\n\n` +
    `Nome: ${name}\n` +
    `Email: ${email}\n` +
    `Telefone: ${phone || "Não informado"}\n` +
    `Mensagem: ${message}\n\n` +
    `🌐 Origem\n` +
    `IP: ${ip}\n` +
    `Cidade: ${city} - ${region}\n` +
    `País: ${country}\n` +
    `ISP: ${isp}\n` +
    `ASN: ${asn}\n` +
    `UA: ${ua}\n` +
    `FP: ${fingerprint}`;

  try {
    const url = `https://api.telegram.org/bot${telegramApiKey}/sendMessage`;

    // Timeout para não travar a function
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        chat_id: telegramChatId,
        text,
        disable_web_page_preview: true,
      }),
    }).finally(() => clearTimeout(timeout));

    const raw = await response.text();
    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      result = { raw };
    }

    if (!response.ok) {
      console.error("Telegram API Error:", { status: response.status, result });
      return json(
        { error: "Falha ao enviar a mensagem.", details: result?.description ?? raw },
        502
      );
    }

    return json({ success: true });
  } catch (error) {
    console.error("Fetch Error:", error?.stack || error?.message || error);
    return json({ error: "Erro interno ao processar envio." }, 500);
  }
}
