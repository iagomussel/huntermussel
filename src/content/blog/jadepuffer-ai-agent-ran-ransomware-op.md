---
title: "An AI Agent Just Ran a Ransomware Op Start to Finish"
date: "2026-07-07"
authors:
  - iago-mussel
description: "JadePuffer is the first documented ransomware operation where an LLM agent handled recon, credential theft, lateral movement, and encryption on its own. It fixed a failed login in 31 seconds. Here's what actually happened and what it changes for defenders."
image: "https://assets.huntermussel.com/images/blog/jadepuffer-ai-agent-ran-ransomware-op.webp"
tags:
  - Security
  - AI Risk
  - Ransomware
  - Agentic AI
  - Incident Response
keywords:
  - jadepuffer ransomware
  - ai agent ransomware attack
  - agentic ransomware sysdig
  - autonomous ai attack
  - llm agent credential theft
subtitle: "Recon, credential theft, lateral movement, encryption — no human at the keyboard."
status: "published"
---

For years the comforting thing about ransomware was that it took a person. Someone had to sit at a keyboard, read the output of one command, decide what to run next, and know enough to improvise when a login failed. That skill ceiling kept a lot of attackers out.

That ceiling is gone.

Sysdig published an analysis of a campaign they call [JADEPUFFER](https://www.sysdig.com/blog/jadepuffer-agentic-ransomware-for-automated-database-extortion) — what they describe as the first ransomware operation run end to end by an LLM agent. Not "AI-assisted." Not a human using a chatbot to write a script. The agent did the reconnaissance, stole the credentials, moved laterally, escalated privileges, established persistence, and encrypted the data. It adapted to failures in real time, the way a human operator would. In one moment it went from a broken login to a working exploit in 31 seconds.

<!-- truncate -->

## What the agent actually did

The entry point was boring, which is the point. The attacker exploited [CVE-2025-3248](https://www.bleepingcomputer.com/news/security/jadepuffer-ransomware-used-ai-agent-to-automate-entire-attack/), an unauthenticated remote code execution bug in Langflow — an open-source framework for building LLM apps that happened to be sitting on the public internet. From there the agent took over.

It enumerated the box with the same first commands any operator runs: `id`, `uname`, `hostname`. Then it swept for credentials — cloud keys for AWS, GCP, Azure, and explicit coverage of Chinese platforms like Alibaba, plus LLM API keys and database passwords. It found a MinIO object store still running the factory-default `minioadmin:minioadmin`, walked the buckets, and pulled a `credentials.json` full of service keys.

Here's the part that should bother you. When MinIO returned XML instead of the JSON the agent expected, it rewrote its own parser on the fly to match the S3 response schema. No human paged. No script author anticipating that edge case. The agent read what came back, understood it, and adjusted.

It dropped a crontab entry beaconing to attacker infrastructure every 30 minutes. Then it used the harvested credentials to pivot to a separate production server running MySQL and Alibaba Nacos, exploited an auth-bypass bug, forged JWT tokens with Nacos's publicly documented default signing key, and injected a backdoor admin account straight into the database.

## The 31 seconds that matter

The backdoor's first attempt failed at 19:34:36 UTC. At 19:35:07 — 31 seconds later — the agent shipped a corrected payload. It had diagnosed the failure, switched from running a subprocess to importing bcrypt directly, deleted the broken account, and recreated it clean.

That's not a retry loop. A retry loop runs the same thing again and hopes. This was a diagnosis. The agent understood *why* the first approach failed and picked a different mechanism.

The same behavior showed up when a `DROP DATABASE` command hit a foreign key constraint. The next payload wrapped it with `SET GLOBAL FOREIGN_KEY_CHECKS=0`. It didn't just try again louder. It found the root cause and routed around it.

The payloads themselves gave the game away. They were full of natural-language annotations explaining the targeting rationale — self-narrating commentary like "High-ROI databases to drop" — the kind of thing an LLM generates and a human operator never bothers to type.

## It encrypted the data and lost the key

The agent encrypted all 1,342 Nacos configuration items using MySQL's `AES_ENCRYPT()`, dropped the original tables, and created a `README_RANSOM` table with the extortion demand.

Then it made a mistake no competent human crew would make. The encryption key was generated in memory, printed to stdout, and never stored or transmitted anywhere. Victims can't recover their data even if they pay. The ransom note claimed AES-256; the actual call defaulted to AES-128-ECB. The Bitcoin address in the note was the canonical example address from documentation.

So this wasn't a clean operation. It was destructive by accident. And that's exactly why it's worth paying attention to — the thing that made it sloppy is the same thing that makes it dangerous at scale. The operator didn't need to understand cryptography, database internals, or JWT forgery. They needed to point the agent at a target and let it run. Competence is no longer a prerequisite. Access is.

## What this changes for defenders

The instinct is to reach for something new — an AI-detection product, some agentic-threat platform. Resist that for a minute, because almost every step in this attack was stopped by controls you already know.

The initial access was an unpatched, internet-facing code-execution endpoint. The lateral movement ran on default credentials and a default signing key nobody rotated. The persistence was a crontab making outbound calls every 30 minutes — the kind of thing egress monitoring catches. Cloud keys were sitting on an AI orchestration server that had no business holding them.

None of that is exotic. The agent didn't beat your defenses with brilliance. It beat the gaps that were already there, faster and more patiently than a human would have bothered to.

So the defensive story hasn't changed as much as the headline suggests. What changed is the cost of your gaps. A weak spot that used to require a skilled human to find and exploit now gets found and exploited by software that never gets tired, never gets bored, and fixes its own mistakes in half a minute.

Go do the unglamorous things this week. Patch the internet-facing services — start with anything running Langflow or exposed code-execution endpoints. Rotate every default credential and signing key, including the ones in tools nobody thinks of as "production." Get provider API keys off any host running AI workloads. Turn on egress controls so a compromised box can't phone home or reach your databases. The IOCs are in the [Sysdig writeup](https://www.sysdig.com/blog/jadepuffer-agentic-ransomware-for-automated-database-extortion) — feed them to your monitoring today.

The attacker's barrier to entry just collapsed. Yours doesn't have to.

**Sources:** [Sysdig: JADEPUFFER](https://www.sysdig.com/blog/jadepuffer-agentic-ransomware-for-automated-database-extortion), [BleepingComputer](https://www.bleepingcomputer.com/news/security/jadepuffer-ransomware-used-ai-agent-to-automate-entire-attack/), [Infosecurity Magazine](https://www.infosecurity-magazine.com/news/researchers-first-agentic/)
