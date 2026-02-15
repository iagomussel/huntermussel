import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import {
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { BlogPostProvider } from "@docusaurus/plugin-content-blog/client";
import BlogPostPageMetadata from "@theme/BlogPostPage/Metadata";
import BlogPostPageStructuredData from "@theme/BlogPostPage/StructuredData";
import Footer from "../../components/Footer";
import ResponsiveImage from "../../components/ResponsiveImage";
import DisqusComments from "../../components/DisqusComments";
import BlogShareSection from "../../components/BlogShareSection";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

type PostContent = {
  metadata: {
    title: string;
    description?: string;
    date?: string;
    permalink?: string;
    tags?: Array<{
      label: string;
      permalink: string;
    }>;
    frontMatter?: {
      subtitle?: string;
      image?: string;
    };
    prevItem?: {
      title: string;
      permalink: string;
    };
    nextItem?: {
      title: string;
      permalink: string;
    };
  };
};

type Props = {
  content: PostContent & ((props: unknown) => ReactNode);
  sidebar?: unknown;
};

export default function BlogPostPage(props: Props): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const BlogPostContent = props.content as unknown as (
    props: unknown,
  ) => ReactNode;
  const metadata = props.content.metadata;
  const subtitle = metadata.frontMatter?.subtitle;
  const image = metadata.frontMatter?.image;
  const tags = metadata.tags ?? [];
  const siteUrl = siteConfig.url.replace(/\/+$/, "");
  const postPath = metadata.permalink ?? "/blog";
  const shareUrl = `${siteUrl}${postPath}`;

  return (
    <BlogPostProvider content={props.content} isBlogPostPage>
      <HtmlClassNameProvider
        className={clsx(
          ThemeClassNames.wrapper.blogPages,
          ThemeClassNames.page.blogPostPage,
        )}
      >
        <BlogPostPageMetadata />
        <BlogPostPageStructuredData />

        <Layout title={metadata.title} description={metadata.description}>
          <div className="min-h-screen bg-background">
            <main className="container px-6 pt-28 pb-24">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-3xl"
              >
                <Link
                  to="/blog"
                  className="mb-8 inline-flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft size={16} />
                  Back to blog
                </Link>

                {metadata.date && (
                  <time className="block font-body text-sm text-muted-foreground">
                    {new Date(metadata.date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                )}
                <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                  {metadata.title}
                </h1>

                {subtitle && (
                  <p className="mt-4 font-body text-xl text-muted-foreground italic">
                    {subtitle}
                  </p>
                )}

                {tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag.permalink}
                        to={tag.permalink}
                        className="rounded-full border border-border bg-muted/30 px-2.5 py-1 font-heading text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {tag.label}
                      </Link>
                    ))}
                  </div>
                )}

                {image && (
                  <div className="mt-8 overflow-hidden rounded-xl border border-border">
                    <ResponsiveImage
                      src={image}
                      alt={metadata.title}
                      className="aspect-video w-full object-cover"
                    />
                  </div>
                )}

                <div className="prose prose-invert prose-headings:font-heading prose-p:font-body prose-a:text-primary prose-strong:text-foreground mt-10 max-w-none">
                  <BlogPostContent />
                </div>

                <BlogShareSection title={metadata.title} url={shareUrl} />

                <DisqusComments
                  identifier={metadata.permalink ?? metadata.title}
                  title={metadata.title}
                />

                {(metadata.nextItem || metadata.prevItem) && (
                  <section className="mt-16 border-t border-border pt-10">
                    <h2 className="font-heading text-2xl font-semibold tracking-tight">
                      Related Articles
                    </h2>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                      {metadata.prevItem && (
                        <li key={metadata.prevItem.permalink}>
                          <Link
                            to={metadata.prevItem.permalink}
                            className="group block h-full rounded-lg border border-border bg-card/50 p-5 transition-colors hover:border-primary/40"
                          >
                            <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary">
                              {metadata.prevItem.title}
                            </h3>
                            <span className="mt-4 inline-flex items-center gap-1 font-heading text-xs text-primary">
                              Read article
                              <ArrowRight size={14} />
                            </span>
                          </Link>
                        </li>
                      )}
                      {metadata.nextItem && (
                        <li key={metadata.nextItem.permalink}>
                          <Link
                            to={metadata.nextItem.permalink}
                            className="group block h-full rounded-lg border border-border bg-card/50 p-5 transition-colors hover:border-primary/40"
                          >
                            <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary">
                              {metadata.nextItem.title}
                            </h3>
                            <span className="mt-4 inline-flex items-center gap-1 font-heading text-xs text-primary">
                              Read article
                              <ArrowRight size={14} />
                            </span>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </section>
                )}
              </motion.article>
            </main>
            <Footer />
          </div>
        </Layout>
      </HtmlClassNameProvider>
    </BlogPostProvider>
  );
}
