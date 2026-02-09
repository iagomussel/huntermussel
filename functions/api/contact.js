/*
POST /api/contact – Formulário de CONTATO (Vamos construir juntos?).
send message to telegram channel  
*/

export async function onRequest(context) {
  const { request } = context;
  const { name, email, message } = await request.json();

  const telegramApiKey = context.env.TELEGRAM_API_KEY;
  const telegramChatId = context.env.TELEGRAM_CHAT_ID;

  const url = `https://api.telegram.org/bot${telegramApiKey}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      chat_id: telegramChatId,
      text: `Nome: ${name}\nEmail: ${email}\nMensagem: ${message}`,
      parse_mode: 'HTML',
    }),
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}