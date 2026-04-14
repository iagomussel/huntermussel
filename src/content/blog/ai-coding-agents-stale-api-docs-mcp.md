---
title: "Your Coding Agent Doesn't Have an API Problem. It Has a Freshness Problem."
date: "2026-04-01"
authors:
  - iago-mussel
description: "AI coding agents hallucinate deprecated endpoints because they're frozen in training time. Here's what actually breaks in real repos, how Google is pushing live docs over MCP, and how you'd test whether wiring that up is worth it."
tags:
  - AI
  - Developer Tools
  - MCP
  - Gemini
  - Software Engineering
keywords:
  - ai coding agent deprecated api
  - mcp api documentation agent
  - gemini api agents mcp
  - coding agent training cutoff
  - model context protocol developer tools
  - agent golden tests ci
image: "https://assets.huntermussel.com/images/blog/ai-coding-agents-api-freshness-mcp.webp"
subtitle: "The model memorized a snapshot. Your SDK shipped three releases since then."
status: "published"
---

You paste an error into the agent. It answers fast. It cites a method that doesn't exist, a parameter that got renamed, or a whole endpoint your vendor retired last year. You don't get a thoughtful "I'm not sure." You get confidence.

That's not because the model is dumb. It's because the model is **stale**. It learned the world up to a cutoff. Your dependencies didn't agree to stop moving on that date.

Google's been leaning into the obvious fix: stop asking the model to **remember** the API and give it a pipe to **read** the API. MCP (Model Context Protocol) is the plumbing lots of teams are standardizing on: a structured way for an agent to call tools and pull context at runtime instead of guessing from weights. Their public [gemini-skills](https://github.com/google-gemini/gemini-skills) repo and the broader Gemini agents story ([ai.google.dev/gemini-api/docs/agents](https://ai.google.dev/gemini-api/docs/agents)) are part of the same bet — skills and tools that specialize the agent instead of hoping one frozen snapshot knows every SDK.

This isn't a product review. It's what breaks in real repos, how you'd **test** whether an agent change actually helped, and when full MCP-plus-docs wiring beats a thinner fix.

<!-- truncate -->

## What breaks first (and why it looks like "bad API usage")

**Renames and deprecations.** The agent "knows" `createFoo` because that was true when the internet it trained on still said so. Your codebase is on v4. The method is `createFooV2` and the old one throws.

**Auth and headers.** OAuth flows, API keys in query params vs. headers, regional endpoints — the boring stuff. The model will happily write the 2019 version of "correct."

**Error messages that lie.** The agent reads your stack trace, pattern-matches to something similar from training, and proposes a fix for a **different** failure mode. You burn an hour proving it wrong.

None of that is fixed by "prompt harder." You're asking memory to substitute for a live contract.

## The freshness fix in one sentence

Treat documentation and schema the way you treat production config: **versioned, fetchable, and testable** — not something the model is supposed to internalize.

MCP fits that mental model. You expose tools (search docs, fetch a page, call an internal schema registry). The agent chooses when to look. The answer can still be wrong, but it's wrong against **today's** text, not 18 months ago's shadow.

Google Cloud's agentic coding path already talks about **configuring MCP servers** to extend what the assistant can do ([docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer](https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer)). On the open side, skills packs like `gemini-skills` are Google's way of shipping **task-specific context** (including API-oriented skills) instead of hoping the base model carries all of it. Different packaging, same instinct: **inject freshness at call time.**

## What I'd actually test before trusting the wiring

If you add doc-MCP or any "live reference" tool, you need proof the **agent uses it** when it matters — not just that the server works in isolation.

**Golden tasks.** Pick five real failures you've already hit: deprecated method, wrong base URL, wrong auth header, wrong pagination, wrong type for a field. Run the agent **with** and **without** the doc tool enabled. Score pass/fail. If the score doesn't move, you built plumbing nobody's actually using.

**Adversarial prompts.** Ask for code against an API you **know** changed recently (your own changelog is perfect). The desired behavior is: tool call → doc fetch → answer that matches current docs. If it still freehands, your system prompt or tool descriptions need work.

**CI that isn't magical.** I'm not saying "run the LLM in GitHub Actions on every PR" unless you've accepted the cost and flakiness. I'm saying: when you **do** ship agent-assisted codegen, snapshot the **outputs** you care about (OpenAPI diff, generated client compile, a small contract test suite). The agent is non-deterministic; your pipeline shouldn't pretend it isn't.

## When the full MCP stack is worth it vs. when it's overkill

**Worth the wiring** if you're generating against **fast-moving** external APIs, you have more than one agent surface (IDE, CI bot, internal chat), or you're tired of pasting doc links into every thread.

**A thin wrapper is enough** if you have **one** stable internal API, good OpenAPI in-repo, and the team already runs codegen from that spec. Point the agent at the generated types and examples in the repo. That's freshness without a server.

**Overkill** if nobody owns the doc source, the MCP server would point at a wiki that rots anyway, or you're not willing to maintain tool schemas when APIs change. Bad live docs are worse than honest stale weights — they look authoritative.

## What to do next week

Pick **one** API that's burned you recently. Write down the exact mistake the agent made. Decide whether the fix is **in-repo truth** (types, examples, comments the agent can read) or **runtime truth** (doc search MCP, internal schema endpoint). Then run three golden tasks and write down the score.

If the number doesn't improve, you didn't fail at MCP. You proved the bottleneck was never "more model" — it was always **where the contract lives** and whether anything in the loop is allowed to read it fresh.

_I build automation and developer tooling with teams that ship to production. If this clicked, more of that shows up at [huntermussel.com](https://huntermussel.com)._
