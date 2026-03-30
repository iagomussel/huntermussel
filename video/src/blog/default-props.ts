import type {BlogPromoProps} from "./types";

export const defaultBlogPromoProps: BlogPromoProps = {
  title: "Claude Code Is Half the Tool Without These 10 Repos",
  subtitle:
    "Ten open-source repos that fix Claude Code’s biggest gaps — persistent memory, smarter prompts, RAG, MCP integrations, and more.",
  bullets: [
    "Persistent memory across sessions",
    "RAG on your own codebase",
    "MCP connectors for real workflows",
    "Slash commands and repeatable prompts",
  ],
  url: "https://huntermussel.com/blog/claude-tips-github-repos-you-should-know/",
  imageFile: "blog/claude-tips-github-repos.webp",
  brand: {
    name: "HunterMussel",
    website: "huntermussel.com",
    handle: "@huntermussel",
    primaryColor: "#00C2FF",
    secondaryColor: "#7C3AED",
    backgroundColor: "#050A14",
    textColor: "#F8FAFC",
    logoFile: "logo.svg",
  },
};

