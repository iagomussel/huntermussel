import type { ReactNode } from "react";
import BlogArchivePageOriginal from "@theme-original/BlogArchivePage";

type Props = Record<string, unknown>;

export default function BlogArchivePage(props: Props): ReactNode {
  return <BlogArchivePageOriginal {...props} />;
}
