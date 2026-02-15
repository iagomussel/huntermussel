import React, { useEffect } from "react";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

type DisqusConfig = {
  shortname?: string;
  siteUrl?: string;
  language?: string;
};

type Props = {
  identifier?: string;
  title?: string;
};

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: { reload: boolean; config: () => void }) => void;
    };
    disqus_config?: () => void;
  }
}

export default function DisqusComments({ identifier, title }: Props) {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const disqus = (siteConfig.customFields?.disqus ?? {}) as DisqusConfig;
  const shortname = disqus.shortname?.trim();
  const language = disqus.language?.trim();

  const baseUrl = (disqus.siteUrl ?? siteConfig.url ?? "").replace(/\/+$/, "");
  const pagePath = location.pathname;
  const pageUrl = `${baseUrl}${pagePath}`;
  const pageIdentifier = identifier ?? pagePath;
  const pageTitle = title ?? siteConfig.title;

  useEffect(() => {
    if (!shortname || !baseUrl) return;

    window.disqus_config = function disqusConfig() {
      // DISQUS reads this function with its own `this` context.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const context = this as any;
      context.page.url = pageUrl;
      context.page.identifier = pageIdentifier;
      context.page.title = pageTitle;
      if (language) {
        context.language = language;
      }
    };

    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: window.disqus_config,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.async = true;
    script.setAttribute("data-timestamp", String(Date.now()));
    document.body.appendChild(script);
  }, [baseUrl, language, pageIdentifier, pageTitle, pageUrl, shortname]);

  if (!shortname || !baseUrl) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">
        Comments
      </h2>
      <div className="mt-4 rounded-lg border border-border bg-card/40 p-4">
        <div id="disqus_thread" />
      </div>
    </section>
  );
}
