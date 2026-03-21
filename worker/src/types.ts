export interface Env {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
  CONTENT_STORE: R2Bucket;
  CONFIG: KVNamespace;
  DB: D1Database;
  OPENAI_API_KEY: string;
  CORS_ORIGIN: string;
  MAX_MESSAGES_PER_SESSION: string;
  MAX_SESSIONS_PER_HOUR: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  sessionId: string;
}

export interface ContentChunk {
  id: string;
  content: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceType: "blog" | "service" | "faq" | "homepage";
}

export interface SearchResult extends ContentChunk {
  score: number;
}
