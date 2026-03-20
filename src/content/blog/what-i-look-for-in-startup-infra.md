---
title: "What I look for in a startup's infra before I agree to work with them"
date: "2026-03-13"
authors:
  - iago-mussel
description: "Before signing any retainer, I run a quick infra audit. Here's my checklist — and what the red flags tell me about a team."
tags:
  - DevOps
  - Infrastructure
  - Consulting
  - Startup
  - Audit
keywords:
  - infrastructure audit
  - devops consulting checklist
  - startup infra review
  - devops assessment
  - technical due diligence
subtitle: "The 20-minute audit I run before every engagement"
status: "draft"
---

I say no to potential clients. Not often — but I do it.

Not because I don't need the work. Because some engagements are set up to fail before they start. The technical debt is load-bearing. The team isn't ready. The expectations are misaligned. Taking money in those situations doesn't help anyone — it delays the inevitable and puts my name on outcomes I can't control.

So before I agree to a retainer, I run an audit. Thirty minutes, five areas. Here's exactly what I look at.

<!-- truncate -->

## The five-area audit

### 1. How you deploy

The first question I ask is always: "Walk me through what happens when you push to main."

Good answer: automated pipeline, staging environment, automated tests pass, deploy to prod with rollback capability. Team can ship without a DevOps person in the room.

Red flag: "It depends on who's doing it." Manual steps. SSH access to production servers that multiple people share. A deploy process that exists in someone's head, not in a script.

The deploy process tells me how much risk you carry in your delivery workflow. It also tells me how much your team trusts their own tooling.

### 2. Observability — what do you know when things go wrong?

"How do you find out when something breaks?"

Good answer: alerting on error rate, latency, or key business metrics. Structured logs you can query. Some form of tracing. The team gets a Slack notification before users report the problem.

Red flag: "Usually someone on the team notices." Or worse: "Our support team tells us." Reactive discovery means every incident is a surprise. You're always a step behind, and you never build the intuition for what normal looks like.

No observability also means the first 20 minutes of every incident is spent trying to understand the state of the system rather than fixing it.

### 3. Secrets management

"Where do your production secrets live?"

Good answer: environment variables injected at deploy time from a vault or secrets manager. Rotation process exists. No developer has plaintext access to production credentials.

Red flag: secrets in `.env` files committed to the repo, even in a "private" repo. Shared passwords in a Notion doc. A production database password that's been the same for two years because "it would be a pain to rotate."

This one is non-negotiable for me. A compromised credential in a startup context can end the company. If secrets aren't managed properly, everything else is built on a weak foundation.

### 4. Environment parity

"Is your staging environment a realistic preview of production?"

Good answer: same infrastructure, same dependencies, different data. Bugs caught in staging don't reach prod because staging behaves the same way.

Red flag: staging is a Docker Compose file running locally, or a single EC2 instance that someone set up two years ago and nobody fully understands. Deploys work in staging and fail in prod because the environments are fundamentally different.

Parity issues mean you're always flying blind in prod. Every deploy is a discovery exercise.

### 5. On-call and incident ownership

"What happens if prod goes down at 2am on a Saturday?"

Good answer: a defined rotation, a runbook, an alert that fires to the right person. Post-mortems that actually result in changes. The team has been through an incident and learned from it.

Red flag: "Whoever's awake handles it." Or a single person who gets called for everything — usually the founding engineer, who has other things to do and will eventually burn out or leave. No runbooks. No post-mortems. Every incident treated as a fire to extinguish rather than a signal to learn from.

## Green flags: teams I want to work with

I'm looking for teams that have *some* things in place and know what they're missing.

Maybe they have solid CI but no observability. Maybe their deploy process is mostly automated but secrets are a mess. Maybe they've had one bad incident and decided they need help before the next one.

The best engagements are with teams that take infrastructure seriously, just don't have the bandwidth to do it right. They know what good looks like. They want a partner, not a vendor.

## Red flags: where engagements fail

Some patterns predict failure regardless of technical scope.

**No tests.** If there are no automated tests, the first conversation about CI/CD becomes a conversation about whether anyone will trust the pipeline. You can't automate confidence you don't have.

**No staging environment.** Deploying directly to production means every improvement I make carries risk. It also means the team has normalized risk-taking — which creates friction when I try to introduce process.

**Shared production access.** If everyone has SSH keys to prod, I can't introduce proper access controls without a political conversation. Not impossible, but it signals that security isn't a shared value yet.

**No ownership culture.** If nobody's accountable for reliability — no SRE role, no CTO caring about it, no one who loses sleep over incidents — improvements don't stick. I can build the system, but someone needs to own it after.

## Why I audit before I scope

Some consultants send a proposal after a single call. I don't.

The audit exists because I've learned that the conversations clients have are rarely about the real problem. A team will say "we need better CI/CD" when what they actually need is a secrets management overhaul and a deployment runbook. Scoping without looking leads to doing the wrong work with high confidence.

The audit also protects the client. If I discover the engagement would require more structural change than expected — a database migration, a team process overhaul — it's better to know that before signing, not after month two.

## What happens after the audit

The output is a 1-page summary: the three highest-risk items in your stack, the two quick wins we can ship in the first 30 days, and the 90-day roadmap for the rest.

From there, we either scope a retainer or I point you toward the right resource. Not every team needs a retainer. Some need a one-time fix. Some need to hire, not outsource.

The goal is to leave you with clarity — whether we work together or not.

[Request an infra audit call →](https://huntermussel.com/#contact)

---

_I work with teams building production systems and developer tooling. If this topic resonates, you can find more of my work at https://huntermussel.com._
