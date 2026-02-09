import matter from "gray-matter";

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
  for (const [path, raw] of Object.entries(modules)) {
    const rawContent = typeof raw === "string" ? raw : (raw?.default ?? "");
    const { data, content } = matter(rawContent);
    const slug = slugFromPath(path);
    posts.push({
      slug,
      title: (data.title as string) ?? slug,
      date: (data.date as string) ?? "",
      description: data.description as string | undefined,
      content,
    });
  }
  posts.sort((a, b) => (b.date > a.date ? 1 : -1));
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}
