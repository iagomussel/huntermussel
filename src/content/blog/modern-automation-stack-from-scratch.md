---
title: "How to build a modern automation stack from scratch — an opinionated guide"
date: "2026-03-13"
authors:
  - iago-mussel
description: "An opinionated, experience-backed guide to the tools, patterns, and sequencing that make up a modern automation stack in 2026 — from first workflow to production-grade system."
tags:
  - Automation Stack
  - DevOps
  - AI
  - Architecture
  - Tooling
keywords:
  - modern automation stack 2026
  - build automation infrastructure
  - automation architecture guide
  - devops automation stack
  - workflow automation stack
subtitle: "Opinions built from 16 years of watching stacks succeed and fail."
status: "draft"
---

I've been building automation systems since before "automation" was a product category. From raw bash scripts and cron jobs to modern AI agent pipelines. I've watched stacks succeed and fail across every scale.

This is not a neutral comparison of options. It's what I actually build, and why.

<!-- truncate -->

## The philosophy first

A good automation stack has three properties. Everything else flows from these.

**Observable.** Every action is logged. Every failure is surfaced. You can answer "what happened and why" for any execution going back 90 days.

**Recoverable.** When something breaks — and it will — the state is recoverable. Failed jobs retry intelligently. Idempotent operations mean re-running is safe. Rollback is designed in, not bolted on.

**Composable.** Automations can call other automations. Outputs feed inputs. A webhook triggers a pipeline that calls an AI model that writes to a database and sends a notification. Each piece does one thing. They combine to do many things.

Every tool I choose and every pattern I recommend comes back to these three. If a tool doesn't serve at least two of them, I don't add it.

## Layer 1: Workflow orchestration

The workflow layer is the core of the stack. It sequences steps, handles failures, retries intelligently, and maintains state across a multi-step process.

**My current recommendation: Temporal.**

Temporal is a workflow orchestration platform built for durability. Workflows are written in code (Go, TypeScript, Python, Java) rather than YAML or visual editors. When a workflow is interrupted — server restart, network failure, exception — Temporal replays it from where it left off automatically.

That's the property that makes it different from every queue-based or YAML-based alternative. You don't have to design retry logic, state recovery, or failure handling into every workflow. Temporal handles it at the infrastructure level.

For teams that find Temporal's operational overhead too high at small scale, **n8n** is a reasonable starting point. Self-hostable, visual workflow builder, good integration breadth. The ceiling is lower, but the floor is accessible.

For pure CI/CD pipelines: **GitHub Actions**. It does one thing well and requires no infrastructure to operate.

## Layer 2: Event streaming

Automations need triggers. Something happens → a workflow starts.

For internal events (a record was created, a status changed, a file was uploaded): a lightweight message broker.

**My recommendation: Redis Streams or Kafka depending on scale.**

Redis Streams handles most startup-to-mid-scale event streaming with near-zero operational overhead. It's already in most stacks as a cache. Using it for lightweight event streaming avoids adding a new system.

At higher volume or when you need durable event replay across multiple consumers: Kafka. More operational complexity, but built for the use case.

Avoid full-featured event buses until you need them. Premature event bus adoption creates complexity before you have the operational maturity to manage it.

## Layer 3: AI model integration

The AI layer handles tasks that require reasoning, interpretation, or judgment. Classification, extraction, generation, routing.

**My default: Anthropic Claude via API for inference tasks, with a structured prompt management system.**

Prompts are code. They live in version control. They have versioned releases. Changes go through review. A change to a prompt in production gets the same treatment as a change to application code — because it has the same potential to change behavior.

For agent-based workflows: the Claude API with tool use. Define the tools the agent can access. Set the goal. Let the model reason about execution. Log every tool call and result.

For tasks that need to run fast and cheap at high volume: smaller, specialized models (embedding models for classification, fine-tuned models for narrow domains).

**The anti-pattern I see constantly:** a single prompt string embedded in application code, changed directly in production by whoever has access. This is how you end up with AI behavior that nobody can explain or reproduce.

## Layer 4: Data and state

Automations produce and consume data. Where that data lives matters.

**For workflow state:** Let the orchestration layer own it. Don't build separate state management when Temporal or n8n already handles it.

**For vector storage (AI context, embeddings):** PostgreSQL with pgvector for most use cases. Avoids adding a specialized vector database to the stack until you have a workload that genuinely requires one.

**For operational data (logs, metrics, run history):** A structured logging system that pushes to a queryable store. I use structured JSON logs → Loki or Elasticsearch depending on the team's existing stack.

**For secrets:** HashiCorp Vault or cloud provider secrets managers (AWS Secrets Manager, GCP Secret Manager). Secrets are never in environment files in repositories. Ever.

## Layer 5: Observability

This is the layer most teams underinvest in. It's also the layer that makes the difference between a system you trust and a system you hope is working.

Every automation run produces:
- A unique run ID
- Structured event log (start, each step, end, errors)
- Duration and cost metrics
- Input fingerprint and output summary
- Downstream systems touched

All of this goes into a central observability store. The dashboard shows: runs per hour, error rate by automation, p95 latency, and any run that required human intervention.

When something breaks, you can trace backward from the symptom to the exact execution that caused it.

**My stack:** OpenTelemetry for instrumentation, Grafana + Loki for visualization. Self-hostable, open-source, no vendor lock-in.

## The sequencing

Don't build all five layers at once. That's how you end up with a six-month architecture project that produces nothing useful.

**Month 1:** GitHub Actions for CI/CD. Redis for basic event queuing. Structured logging.

**Month 2–3:** Add Temporal for the first complex workflow. Integrate AI model for first inference task.

**Month 4–6:** Observability dashboard. Secrets management. Prompt versioning.

**Month 6+:** Scale each layer as volume and complexity demand it.

The worst automation stacks I've seen tried to build the full architecture on day one. The best ones built what they needed, when they needed it, with the discipline to not skip the foundational layers that aren't exciting.

Observable, recoverable, composable. In that order.

---

_I work with teams building production systems and developer tooling. If this topic resonates, you can find more of my work at https://huntermussel.com._
