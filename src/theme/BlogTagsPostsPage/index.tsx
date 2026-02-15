import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import BlogTagsPostsPageOriginal from "@theme-original/BlogTagsPostsPage";
import Footer from "../../components/Footer";

type Props = Record<string, unknown>;

export default function BlogTagsPostsPage(props: Props): ReactNode {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <main className="container px-6 pt-28 pb-24">
          <BlogTagsPostsPageOriginal {...props} />
        </main>
        <Footer />
      </div>
    </Layout>
  );
}
