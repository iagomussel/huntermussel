---
title: "Your MCP Server Approval Doesn't Mean What You Think It Means"
date: "2026-07-07"
authors:
  - iago-mussel
description: "You approved an MCP server in Cursor once. MCPoison (CVE-2025-54136) let an attacker swap in a malicious tool definition afterward — no re-prompt, silent code execution every time you opened the editor. Here's the trust bug and how to not get burned by the next one."
image: "https://assets.huntermussel.com/images/blog/mcp-server-approval-mcpoison.webp"
tags:
  - Security
  - MCP
  - Claude Code
  - Developer Tools
  - Supply Chain
keywords:
  - mcpoison cve-2025-54136
  - cursor mcp vulnerability
  - mcp server approval security
  - mcp trust bypass
  - ai coding agent security
subtitle: "Approve once, trust forever — and that's the whole problem."
status: "published"
---

When you approve an MCP server in your editor, what exactly are you approving? Most people would say "this tool, the one I just read." That feels right. It's also wrong, and the gap between what you think you approved and what you actually approved is where MCPoison lived.

Here's the uncomfortable version. In Cursor, that approval didn't bind to the command the server runs. It bound to the *name*. Approve a server called "my plugin" once, and Cursor remembered "my plugin is trusted" — not "this specific command with these specific arguments is trusted." Change what "my plugin" actually does after the fact, and the editor never asked again.

<!-- truncate -->

## How MCPoison worked

Check Point Research [named it MCPoison](https://research.checkpoint.com/2025/cursor-vulnerability-mcpoison/), tracked as [CVE-2025-54136](https://www.tenable.com/blog/faq-cve-2025-54135-cve-2025-54136-vulnerabilities-in-cursor-curxecute-mcpoison). The attack is almost insultingly simple, which is what makes it good.

You commit a harmless MCP config to a shared repo. Something that reads a file, calls a linter, whatever. A teammate pulls the code, sees a reasonable-looking tool, and approves it once in Cursor. Normal Tuesday.

Then you change the config. Same name, "my plugin," but now the command behind it is a reverse shell. Your teammate never sees a prompt. Cursor already trusts "my plugin." Every time they open the editor, your payload runs — silently, with their permissions, on their machine.

That's the whole thing. No zero-day in a parser, no memory corruption. It abuses the one decision the user made and quietly rewrites what that decision meant. Check Point called it what it is: [persistent code execution via an MCP trust bypass](https://blog.checkpoint.com/research/cursor-ide-persistent-code-execution-via-mcp-trust-bypass/).

Cursor fixed it in version 1.3, released late July 2025, by re-prompting whenever an entry in the MCP config changes. Good. Patch and move on.

But if you stop at "patch Cursor," you missed the point.

## This isn't one bug, it's a pattern

MCPoison is one entry in a long list. The Cloud Security Alliance has been calling the whole situation an [MCP security crisis](https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-security-crisis-20260504-csa-styled/), and there's a running [database of MCP vulnerabilities](https://vulnerablemcp.info/) that keeps filling up. Dozens of CVEs against the ecosystem in a couple of months. Different products, same shape of mistake.

And the shape is always the same: trust gets granted once, to something mutable, and nobody checks whether the thing changed.

Think about how much of your setup fits that description. MCP servers you approved months ago. Rules files your agent reads on every run. Extensions that auto-update. Skills you installed from a repo because the README looked fine. You made one trust decision per item, usually fast, usually without reading the actual command. Then those items kept the ability to change out from under you.

MCP made this worse for a specific reason. The protocol was built to let agents discover and use tools dynamically. Dynamic is the feature. But "the tool definition can change at runtime" and "I approved this tool" are in direct tension, and MCPoison is what that tension looks like when someone leans on it.

## What to actually do

Don't panic about MCP. It's genuinely useful and it's not going away. But treat server configs as code that runs, because that's what they are — you wouldn't merge a shell script from a stranger without reading it, and an MCP command is a shell script wearing a JSON costume.

Update your editor. Cursor 1.3 or later, and stay current — this class of bug gets found and patched constantly, and the patched version is the whole fix.

Review MCP config changes in code review like you'd review any other executable. A diff that changes the `command` or `args` of an existing server is not a config tweak. It's someone changing what runs on every developer's machine. Give it the same scrutiny you'd give a change to your CI pipeline.

Keep the config out of the shared repo when you can. If each developer's MCP setup lives locally instead of in a file everyone pulls, the "commit benign, swap malicious" trick loses its delivery mechanism. You lose some convenience. You lose a lot of attack surface.

Prefer servers where the command is pinned and the source is one you can actually inspect. "It's on npm" is not inspection.

The real fix isn't a version bump. It's noticing that "I approved this once" and "this is safe now" are different sentences — and that every tool you've handed trust to is one silent edit away from proving it.

**Sources:** [Check Point Research: MCPoison](https://research.checkpoint.com/2025/cursor-vulnerability-mcpoison/), [The Hacker News](https://thehackernews.com/2025/08/cursor-ai-code-editor-vulnerability.html), [Tenable FAQ](https://www.tenable.com/blog/faq-cve-2025-54135-cve-2025-54136-vulnerabilities-in-cursor-curxecute-mcpoison), [Vulnerable MCP Project](https://vulnerablemcp.info/)
