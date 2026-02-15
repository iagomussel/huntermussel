import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { getPost, getRelatedPosts } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import NotFound from "./NotFound";
import ResponsiveImage from "@/components/ResponsiveImage";
import {
  createBlogPostingJsonLd,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  buildKeywords,
  toAbsoluteUrl,
} from "@/lib/seo";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  if (!post) {
    return <NotFound />;
  }

  const title = `${post.title} | ${SITE_NAME}`;
  const description = post.description || DEFAULT_DESCRIPTION;
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const image = post.image
    ? toAbsoluteUrl(post.image)
    : toAbsoluteUrl("/placeholder.svg");
  const publishedDate = post.date;
  const parsedPostDate = post.date ? new Date(post.date) : null;
  const publishedIso =
    parsedPostDate && !Number.isNaN(parsedPostDate.getTime())
      ? parsedPostDate.toISOString()
      : undefined;
  const keywords = buildKeywords(
    post.tags,
    post.keywords,
    post.title,
    post.subtitle,
  );
  const articleJsonLd = createBlogPostingJsonLd({
    title: post.title,
    description,
    canonicalUrl: canonical,
    imageUrl: image,
    authorName: "Iago Mussel",
    keywords,
    publishedDate,
  });
  const relatedPosts = getRelatedPosts(post, 3);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={canonical} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:image" content={image} />
        {publishedIso && (
          <meta property="article:published_time" content={publishedIso} />
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {articleJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
          />
        )}
      </Helmet>
      <Navbar />
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

          {post.date && (
            <time className="block font-body text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>
          )}
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {post.title}
          </h1>

          {post.subtitle && (
            <p className="mt-4 font-body text-xl text-muted-foreground italic">
              {post.subtitle}
            </p>
          )}

          {post.image && (
            <div className="mt-8 overflow-hidden rounded-xl border border-border">
              <ResponsiveImage
                src={post.image}
                alt={post.title}
                className="aspect-video w-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-invert prose-headings:font-heading prose-p:font-body prose-a:text-primary prose-strong:text-foreground mt-10 max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {relatedPosts.length > 0 && (
            <section className="mt-16 border-t border-border pt-10">
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                Related Articles
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {relatedPosts.map((related) => (
                  <li key={related.slug}>
                    <Link
                      to={`/blog/${related.slug}`}
                      className="group block h-full rounded-lg border border-border bg-card/50 p-5 transition-colors hover:border-primary/40"
                    >
                      <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary">
                        {related.title}
                      </h3>
                      {related.description && (
                        <p className="mt-2 font-body text-sm text-muted-foreground line-clamp-3">
                          {related.description}
                        </p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1 font-heading text-xs text-primary">
                        Read article
                        <ArrowRight size={14} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </motion.article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
