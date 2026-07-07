---
title: "NVIDIA Built a Scanner for AI Agent Skills. You Probably Need It."
date: "2026-07-07"
authors:
  - iago-mussel
description: "A quarter of AI agent skills carry vulnerabilities and 1 in 20 look outright malicious. NVIDIA's SkillSpector scans them before you install. Here's what it catches, what it misses, and why 'I trust this skill' is a decision you keep making blind."
image: "https://assets.huntermussel.com/images/blog/nvidia-skillspector-are-you-secure-using-ai.webp"
tags:
  - Security
  - AI Risk
  - Agentic AI
  - Developer Tools
  - Supply Chain
keywords:
  - nvidia skillspector
  - ai agent skill security scanner
  - agent skills vulnerabilities
  - claude code skill security
  - ai supply chain security
subtitle: "You install skills the way you install npm packages. That should worry you."
status: "published"
---

Be honest about the last skill you installed for your agent. Did you read it? All of it — the prompt, the code it runs, the files it touches, the network calls it can make? Or did the README look reasonable, the star count seemed fine, and you moved on?

That's not a knock on you. It's how everyone installs skills. And it's a problem, because a skill runs with your agent's trust, on your machine, with access to whatever your agent can reach. We vet npm packages more carefully than the things we hand direct execution to.

NVIDIA looked at the numbers and decided this needed a tool. So they built [SkillSpector](https://github.com/nvidia/skillspector) — a security scanner you run on a skill before you install it.

<!-- truncate -->

## The numbers are worse than you'd guess

NVIDIA's research found that 26.1% of agent skills contain vulnerabilities. Just over a quarter. And 5.2% show likely malicious intent — one in twenty is not sloppy, it's hostile.

Sit with that for a second. If one in twenty packages in your dependency tree were actively trying to hurt you, you'd stop installing packages. But skills feel different. They read like documentation. They're short. They look like a helpful markdown file with a bit of code attached. That framing is exactly what makes them easy to abuse — a malicious instruction hidden in a skill doesn't look like malware, it looks like a prompt.

## What SkillSpector actually checks

The tool runs fast static checks by default, then optionally layers in LLM-based semantic analysis for the stuff that needs judgment rather than pattern matching. It covers 68 vulnerability patterns across 17 categories, and the category list is the interesting part because it tells you what people are actually worried about: prompt injection, data exfiltration, privilege escalation, supply chain, excessive agency, system prompt leakage, memory poisoning, tool misuse, and a handful more.

The semantic pass is what sets it apart from a plain malware scanner. A regex can find a hardcoded exfil URL. It can't notice that a skill *claims* to format your code but *actually* reads your environment variables and phones home. That mismatch — declared purpose versus real behavior — is where the malicious 5% hides, and catching it needs a model that can read intent, not just strings.

It takes whatever you'd realistically hand it: a Git repo, a URL, a zip, a directory, a single file. It's already wired into the workflow for Claude Code, Codex CLI, Gemini CLI, and others. So the friction to actually running it is low, which matters — a security tool nobody runs is theater.

## Read the limitations, because they're the whole story

Here's where I'd push back on treating SkillSpector as a solved-it button. NVIDIA is refreshingly blunt about what it can't do, and you should internalize the list.

It flags risky patterns before you install. It does not contain or isolate a skill you install anyway. So if you scan, see a warning, and shrug, the tool did its job and you did not.

Non-English content can slip past the pattern matching. Anything hidden inside an image can't be inspected. Encrypted or compiled code is opaque to it. Every one of those is a place an attacker who knows SkillSpector exists will go next — a malicious instruction written in a language the patterns don't cover, or tucked into an image the scanner can't read, sails right through.

That's not a flaw in the tool. It's the nature of scanning. A scanner tells you about the risks it recognizes. It says nothing about the ones it doesn't, and silence from a scanner is not the same as safety.

## So — are you secure using AI?

That was the actual question, and the honest answer is: not by default, and not because of the model.

The model isn't the soft spot. The soft spot is everything you plug into it and every trust decision you make in a hurry — the skill you didn't read, the MCP server you approved once, the extension that updates itself. Each one is a small "eh, probably fine" and they stack up into an attack surface nobody's actually looking at.

SkillSpector makes one of those decisions less blind, and that's worth a lot. Scan skills before you install them. Wire it into your workflow so scanning is the default, not a thing you remember to do after something breaks. Treat a warning as a stop sign, not a suggestion.

Then keep going, because the scanner is one layer. Run agents with the least access they need to do the job. Assume a skill can be hostile and make sure it can't reach your secrets or your production data when it is. Review what your agent can touch as carefully as you review what it says.

Being secure using AI isn't a setting you flip on. It's the same discipline you already owe the rest of your stack — you just haven't been extending it to the parts that look like documentation. Start with [SkillSpector](https://github.com/nvidia/skillspector). Scan the next skill before you install it.

**Sources:** [NVIDIA/SkillSpector on GitHub](https://github.com/nvidia/skillspector), [NVIDIA Skill Documentation: Scanning Agent Skills](https://docs.nvidia.com/skills/scanning-agent-skills), [NVIDIA Technical Blog](https://developer.nvidia.com/blog/nvidia-verified-agent-skills-provide-capability-governance-for-ai-agents/)
