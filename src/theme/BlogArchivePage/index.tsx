import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";

type ArchivePost = {
  metadata: {
    title: string;
    permalink: string;
    date: string;
  };
};

type Props = {
  archive: {
    blogPosts: ArchivePost[];
  };
};

function groupByYear(posts: ArchivePost[]) {
  const byYear = new Map<string, ArchivePost[]>();
  for (const post of posts) {
    const year = post.metadata.date.slice(0, 4);
    const list = byYear.get(year) ?? [];
    list.push(post);
    byYear.set(year, list);
  }
  return Array.from(byYear.entries()).map(([year, yearPosts]) => ({
    year,
    posts: yearPosts,
  }));
}

export default function BlogArchivePage(props: Props): ReactNode {
  const years = groupByYear(props.archive.blogPosts);

  return (
    <Layout
      title="Archive | HunterMussel Blog"
      description="Browse blog archive by year."
    >
      <div className="min-h-screen bg-background">
        <main className="container px-6 pt-28 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl"
          >
            <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
              // archive
            </span>
            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Archive
            </h1>
            <p className="mt-4 font-body text-muted-foreground">
              All posts grouped by year.
            </p>

            <div className="mt-10 space-y-8">
              {years.map((yearBlock) => (
                <section
                  key={yearBlock.year}
                  className="rounded-lg border border-border bg-card/50 p-5"
                >
                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    {yearBlock.year}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {yearBlock.posts.map((post) => (
                      <li key={post.metadata.permalink}>
                        <Link
                          to={post.metadata.permalink}
                          className="group flex items-center justify-between rounded-md border border-border bg-muted/20 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
                        >
                          <span className="font-body text-sm text-foreground group-hover:text-primary">
                            {post.metadata.title}
                          </span>
                          <time className="font-heading text-[10px] uppercase tracking-wider text-muted-foreground">
                            {new Date(post.metadata.date).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "short",
                              },
                            )}
                          </time>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </Layout>
  );
}
