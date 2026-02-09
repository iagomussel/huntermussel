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
