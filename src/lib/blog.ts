import fm from "front-matter";

const modules = import.meta.glob<{ default: string }>("../content/blog/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
  status?: string; // 'draft', 'published', 'scheduled'
  [key: string]: any;
}

export interface Post extends PostMeta {
  content: string;
}

function parseTagList(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }

  return [];
}

function tokenizeTitle(title: string): string[] {
  return title
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter((token) => token.length > 3);
}

function slugFromPath(path: string): string {
  const base = path.replace(/\.md$/, "");
  const parts = base.split("/");
  return parts[parts.length - 1] ?? base;
}

export function getPosts(): Post[] {
  const posts: Post[] = [];
  const now = new Date();

  for (const [path, raw] of Object.entries(modules)) {
    const rawContent = typeof raw === "string" ? raw : (raw?.default ?? "");
    const { attributes, body } = fm<PostMeta>(rawContent);
    const slug = slugFromPath(path);

    const status = attributes.status || "published";
    const dateStr = attributes.date;
    const date = dateStr ? new Date(dateStr) : new Date();

    // Filter drafts
    if (status === "draft") continue;

    // Filter scheduled (future posts) if explicitly scheduled or just by date convention
    // If status is 'scheduled' OR (status is 'published' but date is future), we hide it?
    // Let's say: 
    // - draft: never show
    // - scheduled: show only if date <= now
    // - published: show (implied date <= now usually, but if date > now and status=published, arguably show or hide? Standard behavior is hide future.)

    if (date > now) {
      continue;
    }

    posts.push({
      slug,
      title: (attributes.title as string) ?? slug,
      date: (attributes.date as string) ?? "",
      description: attributes.description as string | undefined,
      content: body,
      ...attributes,
    });
  }
  posts.sort((a, b) => (new Date(b.date).getTime() > new Date(a.date).getTime() ? 1 : -1));
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function getRelatedPosts(currentPost: Post, limit = 3): Post[] {
  const currentTags = new Set(parseTagList(currentPost.tags));
  const currentTokens = new Set(tokenizeTitle(currentPost.title));
  const now = Date.now();

  const scored = getPosts()
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const tags = parseTagList(post.tags);
      const tokens = tokenizeTitle(post.title);
      let score = 0;

      for (const tag of tags) {
        if (currentTags.has(tag)) score += 4;
      }

      for (const token of tokens) {
        if (currentTokens.has(token)) score += 2;
      }

      const postTime = post.date ? new Date(post.date).getTime() : 0;
      if (!Number.isNaN(postTime) && postTime <= now) {
        score += 1;
      }

      return { post, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    });

  const strongMatches = scored.filter((entry) => entry.score > 0).map((entry) => entry.post);
  const fallback = scored.map((entry) => entry.post);
  const selected = (strongMatches.length ? strongMatches : fallback).slice(0, limit);

  return selected;
}
