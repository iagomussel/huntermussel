import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";

type TagItem = {
  label: string;
  permalink: string;
  count: number;
};

type Props = {
  tags: TagItem[];
};

export default function BlogTagsListPage({ tags }: Props): ReactNode {
  return (
    <Layout title="Tags | HunterMussel Blog" description="Browse all blog tags.">
      <div className="min-h-screen bg-background">
        <main className="container px-6 pt-28 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl"
          >
            <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
              // tags
            </span>
            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Browse by Tag
            </h1>
            <p className="mt-4 font-body text-muted-foreground">
              Explore articles by topic.
            </p>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {tags.map((tag) => (
                <li key={tag.permalink}>
                  <Link
                    to={tag.permalink}
                    className="group flex items-center justify-between rounded-lg border border-border bg-card/50 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-card"
                  >
                    <span className="font-heading text-sm text-foreground group-hover:text-primary">
                      {tag.label}
                    </span>
                    <span className="rounded-full border border-border bg-muted/30 px-2.5 py-1 font-heading text-[10px] uppercase tracking-wider text-muted-foreground">
                      {tag.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </main>
        <Footer />
      </div>
    </Layout>
  );
}
