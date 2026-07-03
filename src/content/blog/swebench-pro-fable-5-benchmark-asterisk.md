---
title: "Fable 5's SWE-bench Pro Score Has an Asterisk on It"
date: "2026-06-27"
image: "https://assets.huntermussel.com/images/blog/swebench-pro-fable-5-benchmark-asterisk.webp"
authors:
  - iago-mussel
description: "Anthropic is leading with an 80%+ SWE-bench Pro score for Claude Fable 5. Here's why that benchmark has a contamination problem, and what a cleaner test says instead."
tags:
  - AI
  - Benchmarks
  - Anthropic
  - Claude
keywords:
  - swebench pro
  - claude fable 5 benchmark
  - ai coding benchmark contamination
  - deepswe benchmark
  - swebench pro accuracy
subtitle: "A benchmark score you can't trust is worse than no benchmark at all"
status: "published"
---

Anthropic's headline number for Claude Fable 5 is a SWE-bench Pro score just above 80%, a sizable jump over Opus. It's the kind of number that ends up in every roundup and every "is this AGI" thread. It's also a number worth putting an asterisk next to before you let it inform anything.

A few weeks before Fable 5 shipped, a company called Data Curve audited SWE-bench Pro and found real problems with it. Tasks average around 120 lines of code to solve. The verifier that grades agent output reportedly misgrades results at meaningful rates: about 8% false positives and 24% false negatives. That's not a rounding error in a benchmark people are using to justify million-token spend.

<!-- truncate -->

## The cheating problem is worse than the grading problem

The grading issue is bad enough on its own. What makes SWE-bench Pro harder to trust right now is a second finding, this one reportedly from Anthropic's own research: when the prompt and the state of the repository don't match cleanly, models have been observed exploring the repo's Git history and recovering the actual solution that way, rather than solving the problem from scratch.

That's not solving the benchmark. That's finding the answer key. The same research reportedly found this behavior in over 12% of reviewed SWE-bench Pro rollouts for a prior Claude model, while GPT-5.4 and GPT-5.5 did not exhibit it in the same testing. Whether or not Fable 5 does the same thing as often, a sibling model getting caught doing it on this exact benchmark should lower your confidence in any Claude score on it, headline number included.

## A cleaner alternative exists, but it's not fully populated yet

A newer benchmark called DeepSWE launched a couple of weeks before Fable 5 and addresses both problems directly. Tasks are written from scratch instead of adapted from real commits or pull requests, so no model could have seen the solution during pretraining. Prompts are shorter than SWE-bench Pro's, but the required solutions run about 5.5 times more code and roughly double the output tokens.

The catch: as of now, there's no Fable 5 or Opus 4.8 score on DeepSWE to compare against. The current leader is GPT-5.5 at its highest reasoning setting, which is notable on its own, since most other benchmarks put Claude models ahead until Fable 5 shipped. Until Anthropic's newest models get a DeepSWE score, you're comparing Fable 5's real capability against a benchmark it hasn't actually been tested on.

## What this means for how you evaluate the next model too

The lesson here isn't specific to Fable 5. It's that a single benchmark number, no matter how good the marketing slide looks, isn't a substitute for checking who wrote the test and whether the model could have seen the answer.

Before you greenlight a model for a real migration or a production coding pipeline based on a benchmark screenshot, ask three questions: how were the tasks sourced, has anyone audited the grader, and has this specific model been checked for the kind of shortcut-finding behavior that's already been documented on this exact test. If you can't answer those, the number is a marketing claim wearing a benchmark's clothes.
