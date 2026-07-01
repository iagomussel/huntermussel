import type { Env, SearchResult, ContentChunk } from "./types";

interface EmbeddingResponse {
  data: number[][];
}

export async function embedQuery(text: string, ai: Ai): Promise<number[]> {
  const result = (await ai.run("@cf/baai/bge-base-en-v1.5", {
    text: [text],
  })) as EmbeddingResponse;

  return result.data[0] || [];
}

export async function searchContent(
  queryEmbedding: number[],
  vectorize: VectorizeIndex,
  contentStore: R2Bucket,
  topK = 5,
  minScore = 0.65
): Promise<SearchResult[]> {
  const matches = await vectorize.query(queryEmbedding, {
    topK,
    returnMetadata: "all",
  });

  const results = await Promise.all(
    matches.matches
      .filter((match) => match.score >= minScore)
      .map(async (match): Promise<SearchResult | null> => {
        const metadata = match.metadata as Record<string, string> | undefined;
        if (!metadata) return null;

        let content = metadata.content || "";

        if (!content && match.id) {
          const stored = await contentStore.get(`chunks/${match.id}.json`);
          if (stored) {
            const chunk: ContentChunk = await stored.json();
            content = chunk.content;
          }
        }

        return {
          id: match.id,
          content,
          sourceTitle: metadata.sourceTitle || "HunterMussel",
          sourceUrl: metadata.sourceUrl || "https://huntermussel.com",
          sourceType: (metadata.sourceType as SearchResult["sourceType"]) || "homepage",
          score: match.score,
        };
      })
  );

  return results.filter((result): result is SearchResult => result !== null);
}
