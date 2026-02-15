import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";
import ResponsiveImage from "../../components/ResponsiveImage";

type BlogListItem = {
  content: {
    metadata: {
      title: string;
      permalink: string;
      date?: string;
      description?: string;
      tags?: Array<{
        label: string;
        permalink: string;
      }>;
      frontMatter?: {
        image?: string;
        subtitle?: string;
      };
    };
  };
};

type Props = {
  metadata: {
    blogDescription?: string;
    blogTitle?: string;
    permalink?: string;
  };
  items: BlogListItem[];
};

export default function BlogListPage(props: Props): ReactNode {
  const { metadata, items } = props;
  const title = metadata.blogTitle || "Blog | HunterMussel";
  const description =
    metadata.blogDescription ||
    "Articles on process management, AI, automation, and DevOps.";

  return (
    <Layout title={title} description={description}>
      <div className="min-h-screen bg-background">
        <main className="container px-6 pt-28 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl"
          >
            <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
              // blog
            </span>
            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Blog
            </h1>
            <p className="mt-4 font-body text-muted-foreground">
              Articles on process management, AI, and DevOps.
            </p>

            <ul className="mt-12 space-y-6">
              {items.map((item) => {
                const meta = item.content.metadata;
                const image = meta.frontMatter?.image;
                const subtitle = meta.frontMatter?.subtitle;
                const descriptionText = meta.description || "";
                const tags = meta.tags ?? [];

                return (
                  <li key={meta.permalink}>
                    <Link
                      to={meta.permalink}
                      className="group block overflow-hidden rounded-lg border border-border bg-card/50 transition-all hover:border-primary/30 hover:bg-card"
                    >
                      {image && (
                        <div className="aspect-[9/16] sm:aspect-square md:aspect-video w-full overflow-hidden border-b border-border text-center bg-muted/20">
                          <ResponsiveImage
                            src={image}
                            alt={meta.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h2 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                          {meta.title}
                        </h2>
                        {subtitle && (
                          <p className="mt-1 font-body text-sm text-muted-foreground/80 italic">
                            {subtitle}
                          </p>
                        )}
                        {meta.date && (
                          <time className="mt-2 block font-body text-xs text-muted-foreground">
                            {new Date(meta.date).toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </time>
                        )}
                        {descriptionText && (
                          <p className="mt-3 font-body text-sm text-muted-foreground">
                            {descriptionText}
                          </p>
                        )}
                        {tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag.permalink}
                                className="rounded-full border border-border bg-muted/30 px-2.5 py-1 font-heading text-[10px] uppercase tracking-wider text-muted-foreground"
                              >
                                {tag.label}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="mt-4 inline-flex items-center gap-1 font-heading text-xs text-primary">
                          Read more
                          <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </main>
        <Footer />
      </div>
    </Layout>
  );
}
