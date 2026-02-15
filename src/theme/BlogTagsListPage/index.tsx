import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import BlogTagsListPageOriginal from "@theme-original/BlogTagsListPage";
import Footer from "../../components/Footer";

type Props = Record<string, unknown>;

export default function BlogTagsListPage(props: Props): ReactNode {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <main className="container px-6 pt-28 pb-24">
          <BlogTagsListPageOriginal {...props} />
        </main>
        <Footer />
      </div>
    </Layout>
  );
}
