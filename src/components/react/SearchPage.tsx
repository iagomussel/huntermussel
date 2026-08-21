import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Search, FileText, Wrench, Briefcase, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchEntry {
  type: "article" | "tool" | "case";
  title: string;
  description: string;
  url: string;
  tags: string[];
  image: string | null;
  date: string | null;
  readingTime?: string;
  body: string;
}

const TYPE_CONFIG = {
  article: { label: "Articles", icon: FileText },
  tool: { label: "Tools", icon: Wrench },
  case: { label: "Cases", icon: Briefcase },
} as const;

function ResultCard({ entry }: { entry: SearchEntry }) {
  return (
    <a
      href={entry.url}
      className="group flex gap-4 rounded-lg border border-border bg-card/50 p-4 transition-colors hover:border-primary/40"
    >
      {entry.image && (
        <div className="hidden shrink-0 sm:block">
          <img
            src={entry.image}
            alt={entry.title}
            loading="lazy"
            className="h-16 w-24 rounded-md object-cover"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
            {entry.type}
          </span>
          {entry.readingTime && (
            <span className="text-xs text-muted-foreground">{entry.readingTime}</span>
          )}
        </div>
        <h3 className="mt-1 font-heading text-sm font-semibold leading-snug group-hover:text-primary">
          {entry.title}
        </h3>
        <p className="mt-1 line-clamp-2 font-body text-xs text-muted-foreground">
          {entry.description}
        </p>
        {entry.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {entry.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allEntries, setAllEntries] = useState<SearchEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "article" | "tool" | "case">("all");

  useEffect(() => {
    fetch("/search/index.json")
      .then((res) => res.json())
      .then((data: SearchEntry[]) => {
        setAllEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(allEntries, {
        keys: [
          { name: "title", weight: 3 },
          { name: "description", weight: 2 },
          { name: "tags", weight: 1.5 },
          { name: "body", weight: 0.5 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [allEntries],
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const filtered = activeFilter === "all" ? fuse : {
      search: (q: string) => fuse.search(q).filter((r) => r.item.type === activeFilter),
    };
    return filtered.search(query).slice(0, 30);
  }, [query, fuse, activeFilter]);

  const counts = useMemo(() => {
    const c = { article: 0, tool: 0, case: 0 };
    for (const r of results) c[r.item.type as keyof typeof c]++;
    return c;
  }, [results]);

  return (
    <div className="container max-w-3xl px-6 pt-32 pb-24">
      <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">Search</h1>
      <p className="mt-2 font-body text-sm text-muted-foreground">
        Find articles, tools, and case studies across the site.
      </p>

      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search articles, tools, cases..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 pl-10"
          autoFocus
          aria-label="Search"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Filter tabs */}
      {query.trim() && !loading && (
        <div className="mt-4 flex gap-2">
          <FilterButton
            label="All"
            count={results.length}
            active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          />
          {(Object.keys(TYPE_CONFIG) as Array<keyof typeof TYPE_CONFIG>).map((type) => (
            <FilterButton
              key={type}
              label={TYPE_CONFIG[type].label}
              count={counts[type]}
              active={activeFilter === type}
              onClick={() => setActiveFilter(type)}
            />
          ))}
        </div>
      )}

      {/* Results */}
      <div className="mt-6 space-y-3">
        {query.trim() && !loading && results.length === 0 && (
          <p className="font-body text-sm text-muted-foreground">
            No results for "{query}". Try a different search term.
          </p>
        )}
        {!query.trim() && !loading && (
          <p className="font-body text-sm text-muted-foreground">
            Start typing to search through {allEntries.length} entries.
          </p>
        )}
        {results.map((result) => (
          <ResultCard key={result.item.url} entry={result.item} />
        ))}
      </div>
    </div>
  );
}

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {label} ({count})
    </button>
  );
}