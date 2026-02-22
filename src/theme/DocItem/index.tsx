import React, { type ReactNode } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Footer from "../../components/Footer";

type Props = {
  content: {
    readonly metadata: {
      readonly title: string;
      readonly description: string;
      readonly permalink: string;
    };
    readonly frontMatter: {
      readonly subtitle?: string;
      readonly image?: string;
    };
    (): ReactNode;
  };
};

export default function DocItem(props: Props): ReactNode {
  const { content: DocContent } = props;
  const { metadata, frontMatter } = DocContent;
  const isCase = metadata.permalink.startsWith("/cases");
  const backLink = isCase ? "/#cases" : "/#services";
  const backLabel = isCase ? "Back to cases" : "Back to services";

  return (
    <Layout title={metadata.title} description={metadata.description}>
      <div className="min-h-screen bg-background">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        
        <main className="container relative z-10 px-6 pt-32 pb-24">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl"
          >
            <Link
              to={backLink}
              className="mb-12 inline-flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft size={16} />
              {backLabel}
            </Link>

            <header className="mb-16">
              <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
                // {isCase ? "case study" : "service"}
              </span>
              <h1 className="font-heading text-4xl font-bold tracking-tight md:text-6xl mb-6">
                {metadata.title.split(":")[0]}
                <span className="gradient-text">
                  {metadata.title.includes(":") ? `:${metadata.title.split(":")[1]}` : ""}
                </span>
              </h1>
              {metadata.description && (
                <p className="font-body text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  {metadata.description}
                </p>
              )}
            </header>

            <div className="prose prose-invert prose-headings:font-heading prose-p:font-body prose-a:text-primary prose-strong:text-foreground mt-10 max-w-none 
              prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
              prose-li:text-muted-foreground prose-li:mb-2
              bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-12 shadow-2xl">
              <DocContent />
            </div>

            <div className="mt-20 text-center">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-12 backdrop-blur-md">
                <h2 className="font-heading text-2xl font-bold mb-4">Ready to achieve similar results?</h2>
                <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
                  Let's discuss how we can apply our expertise to your specific business challenges.
                </p>
                <Link
                  to="/#contact"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 font-heading text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(145_80%_50%/0.3)]"
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </motion.article>
        </main>
        <Footer />
      </div>
    </Layout>
  );
}
