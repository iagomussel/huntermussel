// @ts-check

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "HunterMussel",
  tagline: "AI Process Management & DevOps",
  favicon: "img/favicon.ico",

  url: "https://huntermussel.com",
  baseUrl: "/",

  organizationName: "huntermussel",
  projectName: "huntermussel",
  trailingSlash: false,
  customFields: {
    disqus: {
      shortname: "huntermussel",
      siteUrl: "https://huntermussel.com",
      language: "en_US",
    },
  },

  onBrokenLinks: "throw",
  onBrokenAnchors: "ignore",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: "services",
          routeBasePath: "services",
          sidebarPath: "./sidebarsServices.mjs",
        },
        blog: {
          routeBasePath: "blog",
          blogTitle: "HunterMussel Blog",
          blogDescription:
            "Articles on process management, AI automation, and DevOps.",
          postsPerPage: 10,
          showReadingTime: true,
          feedOptions: {
            type: "all",
            copyright: `Copyright ${new Date().getFullYear()} HunterMussel`,
          },
        },
        theme: {
          customCss: "./src/index.css",
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/blog/tags/**", "/blog/archive"],
        },
      }),
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "cases",
        path: "cases",
        routeBasePath: "cases",
        sidebarPath: "./sidebarsCases.mjs",
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            to: "/blog/fast-code-weak-engineers",
            from: "/blog/fast-code-weak-engeneers",
          },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "images/blog/rich-content-google-search_16x9_high.webp",
      navbar: {
        title: "Hunter Mussel",
        logo: {
          alt: "HunterMussel Target Logo",
          src: "img/logo.svg",
          srcDark: "img/logo.svg",
          width: 28,
          height: 28,
        },
        items: [
          { label: "Services", href: "/#services", position: "right" },
          { label: "Cases", href: "/#cases", position: "right" },
          { label: "About", href: "/#about", position: "right" },
          { label: "Tecnologies", href: "/#technologies", position: "right" },
          { label: "BLOG", to: "/blog", position: "right" },
          { label: "Contact us", href: "/#contact", position: "right" },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      metadata: [
        {
          name: "description",
          content:
            "Automate and optimize your company's process management with Artificial Intelligence, intelligent automation, and DevOps.",
        },
        {
          name: "keywords",
          content:
            "process management, artificial intelligence, AI automation, DevOps, workflow automation, RPA, cloud infrastructure",
        },
        {
          name: "robots",
          content: "index,follow,max-image-preview:large",
        },
      ],
    }),

  headTags: [
    {
      tagName: "script",
      attributes: {
        async: "true",
        src: "https://www.googletagmanager.com/gtag/js?id=G-NENC1CBCTS",
      },
    },
    {
      tagName: "script",
      attributes: { type: "application/ld+json" },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://huntermussel.com/#organization",
        name: "HunterMussel",
        url: "https://huntermussel.com",
        description:
          "Automate and optimize your company's process management with Artificial Intelligence, intelligent automation, and DevOps.",
        logo: {
          "@type": "ImageObject",
          url: "https://huntermussel.com/img/og-default.svg",
        },
        founder: {
          "@type": "Person",
          name: "Iago Mussel",
          jobTitle: "CEO & Founder",
        },
        areaServed: "Worldwide",
      }),
    },
  ],
};

export default config;
