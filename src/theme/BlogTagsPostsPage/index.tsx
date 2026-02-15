import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import BlogListPaginator from "@theme/BlogListPaginator";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Footer from "../../components/Footer";
import ResponsiveImage from "../../components/ResponsiveImage";

type TagMeta = {
  label: string;
  permalink: string;
  allTagsPath: string;
  description?: string;
};

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
  tag: TagMeta;
  items: BlogListItem[];
  listMetadata: {
    blogTitle?: string;
    blogDescription?: string;
  };
};

export default function BlogTagsPostsPage({
  tag,
  items,
  listMetadata,
}: Props): ReactNode {
  const title = `${tag.label} | ${listMetadata.blogTitle || "HunterMussel Blog"}`;
  const description =
    tag.description || listMetadata.blogDescription || `Articles tagged with ${tag.label}.`;

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
              // tag
            </span>
            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              {tag.label}
            </h1>
            {tag.description && (
              <p className="mt-4 font-body text-muted-foreground">{tag.description}</p>
            )}
            <div className="mt-4">
              <Link
                to={tag.allTagsPath}
                className="font-heading text-xs uppercase tracking-wider text-primary hover:underline"
              >
                View All Tags
              </Link>
            </div>

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
                            {tags.slice(0, 4).map((postTag) => (
                              <span
                                key={postTag.permalink}
                                className="rounded-full border border-border bg-muted/30 px-2.5 py-1 font-heading text-[10px] uppercase tracking-wider text-muted-foreground"
                              >
                                {postTag.label}
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

            <div className="mt-10">
              <BlogListPaginator metadata={listMetadata} />
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </Layout>
  );
}
