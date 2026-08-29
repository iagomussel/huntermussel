---
title: "GPT-5.6 Sol, Terra, and Luna: You Don't Need All Three"
date: "2026-08-29"
authors:
  - iago-mussel
description: "OpenAI's GPT-5.6 family gives you three models with the same huge context window and very different economics. Here's how to pick Sol, Terra, or Luna without turning model choice into a tax on every feature."
image: "https://huntermussel.com/images/blog/gpt-5-6-sol-terra-luna.webp"
tags:
  - AI
  - OpenAI
  - GPT-5.6
  - AI Engineering
  - Cost Optimization
keywords:
  - GPT-5.6 Sol vs Terra vs Luna
  - GPT-5.6 model comparison
  - OpenAI GPT-5.6 pricing
  - GPT-5.6 Luna use cases
  - GPT-5.6 Terra use cases
  - GPT-5.6 Sol use cases
subtitle: "Same context window. Very different jobs."
status: "published"
---

Most teams don't have a model-selection problem. They have a default-model problem.

Someone picks the smartest model on day one, it works, and then every internal tool, support workflow, classifier, and agent quietly inherits the same choice. Six weeks later, the invoice is bigger than expected and nobody can tell you which feature earned the spend.

OpenAI's GPT-5.6 family makes that lazy habit harder to defend. There are three models: **Sol**, **Terra**, and **Luna**. They share the same 1.05 million-token context window, 128,000-token maximum output, vision input, tool calling, and configurable reasoning. The difference isn't whether one is "real AI" and the others are compromises. The difference is what kind of work you're paying them to do.

<!-- truncate -->

## The short version

**Use Sol when getting the answer wrong is expensive.**

**Use Terra when the task needs judgment but happens often.**

**Use Luna when the job is narrow, repeatable, and has volume.**

That's the whole framework. Everything else is implementation detail.

OpenAI describes Sol as the flagship model for complex professional work, Terra as the balance between intelligence and cost, and Luna as the cost-sensitive, high-volume option. The `gpt-5.6` alias points to Sol. [Those are not marketing tiers you should ignore; they're the first routing decision your product needs.](https://developers.openai.com/api/docs/models)

## Sol is for decisions with a real blast radius

Sol is the model you use when the task needs deep reasoning, a long chain of tool calls, or a result that will change something important.

That might be diagnosing a production incident across logs, traces, deploy history, and infrastructure code. It might be reviewing a security-sensitive pull request. It might be an agent planning a migration across a large codebase, where a confident-but-wrong edit costs the team a week.

At $4 per million input tokens and $20 per million output tokens, Sol isn't the model to point at every webhook. But it's also cheaper than pretending all model calls are interchangeable. A weak analysis that sends an engineer down the wrong path is not a cost saving. It's just a hidden cost with better formatting.

Use Sol when you would otherwise put a senior engineer in a room with the evidence and ask them to think for an hour. Give it the context, give it the tools it needs, and keep a human in the approval path for anything consequential.

The tempting mistake is to make Sol the default because it produces the nicest first demo. Don't. A demo is one task. Production is a distribution of tasks.

## Terra is probably where most of your product belongs

Terra is the unglamorous answer, which is why it's often the right one.

It costs $2 per million input tokens and $12 per million output tokens. That's half Sol's input price and 40% less on output, while keeping the same context window and tool-capable workflow shape. [OpenAI positions it as the model that balances intelligence and cost.](https://developers.openai.com/api/docs/models/gpt-5.6-terra)

This is the model for work that's genuinely variable but not existential:

- A support assistant that reads a customer's account history before drafting a reply.
- An internal operations agent that reconciles messy spreadsheet data and asks for a missing field.
- A coding workflow that turns a well-scoped ticket into a patch and tests it.
- A document-review step that extracts obligations and routes exceptions to the right person.

The important part is that Terra isn't a fallback. It's a deliberate choice for work that benefits from reasoning but doesn't justify paying flagship prices every time.

If you're building an AI feature and don't yet have production traces showing the task needs Sol, start on Terra. Measure failures. Promote only the requests that actually need more capability. That gives you a routing policy based on evidence instead of anxiety.

## Luna is where volume stops being theoretical

Luna costs $0.20 per million input tokens and $1.20 per million output tokens. That's an order of magnitude below Terra on input and output. It isn't there to make your architecture diagram look complete. It's there because some AI jobs happen hundreds of thousands of times.

Classification, extraction, first-pass routing, metadata cleanup, short summaries, policy tagging, and structured data normalization are all good Luna territory. The jobs are constrained. You can evaluate them. You can retry the outliers. And the unit economics matter more than having the cleverest possible answer to each one.

[OpenAI explicitly positions Luna for cost-sensitive, high-volume workloads.](https://developers.openai.com/api/docs/models/gpt-5.6-luna) That doesn't mean "cheap enough to use carelessly." It means you can finally stop using a flagship model to sort emails or turn a five-line form response into JSON.

One warning: don't confuse high volume with low importance. A fraud label, a medical workflow, or a destructive automation can have a small prompt and a large consequence. Luna may still be part of the pipeline, but the decision needs validation, confidence thresholds, and a human escape hatch.

## Same context window doesn't mean same job

All three models support a 1.05 million-token context window. That makes it easy to reach the wrong conclusion: if they can all read the same pile of documents, use the cheapest one every time.

Reading context and using it well are different things.

The question isn't, "Can Luna fit this repository?" It can. The question is whether the task requires it to weigh contradictory requirements, recover from a bad tool result, decide what evidence matters, and propose a change whose side effects aren't obvious. That's where the capability gap earns its keep.

The same principle applies in reverse. If you already know what fields you need extracted from an invoice, Sol's extra reasoning won't make that schema more correct. Better validation will.

Treat the context window as a capacity limit, not a model-selection rule.

## Reasoning effort is a second dial, not a decoration

Sol, Terra, and Luna all support `none`, `low`, `medium`, `high`, `xhigh`, and `max` reasoning effort. OpenAI's guidance is straightforward: start with your current setting when migrating, then test one level lower on representative work. The newer family can often maintain quality with fewer reasoning tokens. [The model guidance also recommends `medium` as the balanced starting point and `low` for latency-sensitive work.](https://developers.openai.com/api/docs/guides/latest-model)

This matters because model choice alone doesn't control spend or latency. A Terra request at `max` can be a worse fit than a Sol request at `medium`. A Luna classification at `none` may be exactly right.

Don't standardize on a single effort level across your product. That's just the default-model problem wearing a different hat.

Instead, define the expected output for each workflow. Is it a JSON record? Start at `none` or `low`. Is it a multi-source recommendation that will reach a customer? Start at `medium`. Is it a migration plan or a complex diagnosis? Test Sol with higher effort, then compare whether the extra work changed the outcome enough to justify it.

## Build a router before you build a debate club

You don't need an elaborate machine-learning router on day one. You need a few honest rules.

Start with something like this:

| Work | First model to try | Why |
| --- | --- | --- |
| Extraction, tagging, short structured responses | Luna | Cheap, fast, easy to evaluate |
| Customer-facing analysis, variable internal workflows, coding tickets | Terra | Enough judgment without flagship spend |
| High-stakes decisions, long-running agents, complex debugging | Sol | Capability matters more than the per-token discount |

Then log three things for every model call: task type, model and reasoning effort, and whether a human accepted the result without rework. Cost without quality is just accounting. Quality without cost is how teams convince themselves a demo can become a business.

After a few weeks, you'll know which requests deserve promotion from Luna to Terra, and which Sol requests were just expensive habits. That data is more useful than any benchmark chart.

## What to do next

Take the three most common AI calls in your product and classify them by consequence, ambiguity, and volume. Put Luna on the narrow high-volume one, Terra on the variable everyday workflow, and Sol on the one where a bad answer creates real engineering or business risk.

Run that setup for a month. Review the exceptions, not just the bill. The best model strategy isn't picking the smartest model. It's making sure intelligence shows up exactly where your product needs it.

---

_I work with teams building production AI systems, automation, and developer tooling. If you're deciding where an AI workflow should use judgment and where it should just execute, you can find more of my work at https://huntermussel.com._
