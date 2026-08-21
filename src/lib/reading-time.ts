const WORDS_PER_MINUTE = 200;

/** Strips markdown syntax down to readable text for a word count. */
function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_>#~-]/g, " ");
}

export interface ReadingTime {
  minutes: number;
  words: number;
  text: string;
}

export function getReadingTime(markdown: string): ReadingTime {
  const text = stripMarkdown(markdown).trim();
  const words = text.length === 0 ? 0 : text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return { minutes, words, text: `${minutes} min read` };
}
