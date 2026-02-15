import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPosts } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  buildKeywords,
} from "@/lib/seo";

const Blog = () => {
  const posts = getPosts();
  const title = `Blog | ${SITE_NAME}`;
  const description = "Articles on process management, AI, automation, and DevOps.";
  const canonical = `${SITE_URL}/blog`;
  const keywords = buildKeywords(
    "blog",
    "engineering blog",
    "AI",
    "DevOps",
    "automation",
    posts.map((post) => post.title),
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={canonical} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      </Helmet>
      <Navbar />
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
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block overflow-hidden rounded-lg border border-border bg-card/50 transition-all hover:border-primary/30 hover:bg-card"
                >
                  {post.image && (
                    <div className="aspect-[9/16] sm:aspect-square md:aspect-video w-full overflow-hidden border-b border-border text-center bg-muted/20">
                      <ResponsiveImage
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                      {post.title}
                    </h2>
                    {post.subtitle && (
                      <p className="mt-1 font-body text-sm text-muted-foreground/80 italic">
                        {post.subtitle}
                      </p>
                    )}
                    {post.date && (
                      <time className="mt-2 block font-body text-xs text-muted-foreground">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    )}
                    {post.description && (
                      <p className="mt-3 font-body text-sm text-muted-foreground">
                        {post.description}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 font-heading text-xs text-primary">
                      Read more
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
