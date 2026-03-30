import type { ChatMessage, SearchResult } from "./types";

const SYSTEM_PROMPT = `You are HunterMussel's site assistant. Your job is to help visitors understand HunterMussel's services and guide them toward starting a project.

RULES:
1. Only answer using the CONTEXT provided below.
2. If the context is insufficient, say so honestly and offer to connect them with Iago directly.
3. Be concise. Prefer structured answers (bullets, short paragraphs).
4. Detect language from user's first message. Respond in the same language (English or Portuguese).
5. If the user shows commercial intent (wants to build, hire, get a proposal), suggest they start a conversation with the team.
6. Always be ready to offer a human handoff path.
7. Never fabricate information not present in the context.
8. When referencing specific content, mention the article or page title naturally.

CONTACT INFORMATION (always available to share):
- Email: contact@huntermussel.com
- WhatsApp: https://wa.me/5521995775689
- Schedule a call: https://cal.com/iago-mussel-2zqprh/secret
- Contact form: https://huntermussel.com/contact/

ABOUT HUNTERMUSSEL:
HunterMussel is a software house specializing in DevOps, AI automation, and scalable software engineering. Based in Brazil (GMT-3), working with international clients.`;

export function buildPrompt(
  messages: ChatMessage[],
  context: SearchResult[]
): { systemPrompt: string; conversationMessages: ChatMessage[] } {
  let contextBlock = "";

  if (context.length > 0) {
    contextBlock = "\n\nCONTEXT:\n";
    context.forEach((chunk, i) => {
      contextBlock += `[${i + 1}: ${chunk.sourceTitle}]\n${chunk.content}\n\n`;
    });
    contextBlock += "Answer using only the context above. If you reference specific content, mention the article title naturally.";
  } else {
    contextBlock = "\n\nNo relevant context was found for this query. Let the user know you couldn't find specific information about their question in HunterMussel's content, and offer to connect them with the team directly.";
  }

  const recentMessages = messages.slice(-10);

  return {
    systemPrompt: SYSTEM_PROMPT + contextBlock,
    conversationMessages: recentMessages,
  };
}
