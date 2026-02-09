import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import NotFound from "./NotFound";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} | HunterMussel</title>
        {post.description && (
          <meta name="description" content={post.description} />
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
            Voltar ao blog
          </Link>

          {post.date && (
            <time className="block font-body text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>
          )}
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {post.title}
          </h1>

          <div className="prose prose-invert prose-headings:font-heading prose-p:font-body prose-a:text-primary prose-strong:text-foreground mt-10 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </motion.article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
