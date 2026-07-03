import type { BlogPromoProps } from "./types";

export const defaultBlogPromoProps: BlogPromoProps = {
  title: "Claude Code Is Half the Tool Without These 10 Repos",
  subtitle:
    "Ten open-source repos that fix Claude Code’s biggest gaps — persistent memory, smarter prompts, RAG, MCP integrations, and more.",
  url: "https://huntermussel.com/blog/claude-tips-github-repos-you-should-know/",
  imageFile: "blog/claude-tips-github-repos.webp",
  bullets: ["Memory", "RAG", "MCP", "Prompts", "Slash commands"],
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
  scenes: [
    {
      text: "Most teams barely scratch Claude Code.",
      type: "hook",
      narration: "Most teams barely scratch Claude Code.",
    },
    {
      text: "These 10 repos unlock memory prompts and MCP connectors.",
      type: "point",
      narration: "These 10 repos unlock memory, prompts, and MCP connectors.",
    },
    {
      text: "Plug them in and the agent starts acting like a senior dev.",
      type: "proof",
      narration: "Plug them in and the agent starts acting like a senior dev.",
    },
    {
      text: "Full breakdown on huntermussel.com",
      type: "call-to-action",
      narration: "Full breakdown on huntermussel.com.",
    },
  ],
  audioFile: "static/cta.mp3",
};
