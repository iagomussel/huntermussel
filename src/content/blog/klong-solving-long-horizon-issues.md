---
title: "KLong: Advancing AI Agents for Extremely Long-Horizon Tasks"
date: "2026-02-26"
authors:
  - iago-mussel
description: "How KLong uses trajectory-splitting SFT and progressive RL to improve long-horizon performance in research and engineering tasks."
tags:
  - AI
  - AI Agents
  - Long Horizon
  - Reinforcement Learning
  - Research
keywords:
  - klong model
  - long horizon ai agents
  - trajectory splitting sft
  - progressive reinforcement learning
  - paperbench benchmark
image: "https://assets.huntermussel.com/images/blog/klong-trajectory-splitting.webp"
subtitle: "A compact analysis of KLong's training strategy and benchmark gains"
status: "published"
---

Today's models are genuinely good at short tasks. Hand one a failing test and a stack trace and it'll usually find the fix. Hand it something that takes hundreds or thousands of coordinated steps, though, and a quieter failure shows up: the agent doesn't crash, it drifts. Somewhere deep into the run it forgets why it made an early decision, and everything after that is confident work toward the wrong goal.

KLong targets this gap directly with training focused on extremely long-horizon task completion, allowing agents to stay coherent and goal-directed across extended processes.

<!-- truncate -->

## Why Long-Horizon Capability Matters

Real technical work rarely fits in a short prompt:

- Debugging distributed systems end to end
- Reproducing scientific papers
- Building and iterating complete ML pipelines
- Running deep security audits

These tasks demand planning continuity, memory of prior decisions, and stable alignment to an overall objective. Many current agents still break mid-process.

And the breakage compounds. A small mistake at step 40 doesn't stay small; it feeds every decision after it. Even an agent that gets each individual step right almost every time is playing terrible odds across a thousand steps, because failures multiply instead of averaging out. That's why long-horizon work feels categorically harder than short work rather than just longer. It's the same problem stacked until any weakness shows.

There's also a data problem underneath. Models get good at what they're trained on, and the internet is full of short question-answer pairs and single-file code changes. Complete traces of someone spending three days reproducing a paper, dead ends included, barely exist as training data. KLong's real contribution is less "bigger model" and more "here's how to train on that kind of trace at all."

## KLong's Two-Stage Training Strategy

### 1. Trajectory-Splitting Supervised Fine-Tuning

Standard SFT on full, very long trajectories can exceed context limits. KLong splits expert trajectories into overlapping sub-trajectories, preserving key early context while keeping training windows tractable.

The obvious alternatives are both bad. Truncate long trajectories to fit and you throw away exactly the part you care about, the late steps where endurance matters. Skip them entirely and the model never sees what step 900 of a real task looks like. Overlapping splits keep the long examples in the training set while making sure each window still carries the original goal and the decisions that shaped it.

That "pick up midstream" skill matters more than it sounds. A deployed agent on a long task is effectively always midstream: its context holds a compressed view of what came before, not the raw history. Training on sub-trajectories that start in the middle, with early context carried along, is a much closer match to how the model will actually be used than tidy start-to-finish runs.

<img src="https://assets.huntermussel.com/images/blog/klong-trajectory-splitting_16x9_med.webp" srcSet="https://assets.huntermussel.com/images/blog/klong-trajectory-splitting_16x9_thumb.webp 320w, https://assets.huntermussel.com/images/blog/klong-trajectory-splitting_16x9_low.webp 640w, https://assets.huntermussel.com/images/blog/klong-trajectory-splitting_16x9_med.webp 1280w, https://assets.huntermussel.com/images/blog/klong-trajectory-splitting_16x9_high.webp 1920w" sizes="(max-width: 1280px) 100vw, 1280px" alt="KLong trajectory-splitting setup for long-horizon supervised fine-tuning" className="w-full h-auto object-contain md:aspect-video md:object-cover" loading="lazy" />

### 2. Progressive Reinforcement Learning

Long tasks have delayed rewards. KLong addresses this with a progressive curriculum: shorter and simpler horizons first, then increasing execution windows over stages. This stabilizes optimization and improves long-range credit assignment.

The delayed-reward problem is worth sitting with for a second. If the only signal is pass-or-fail at the end of a thousand-step run, the model learns almost nothing about which of those steps helped and which hurt. Worse, if you start RL on full-length tasks, most early attempts fail outright, and a pile of failed runs teaches very little. You burn enormous compute collecting noise.

The curriculum sidesteps that. Short horizons early in training mean frequent, informative outcomes. The execution window stretches only once the model can reliably close out shorter tasks, so there's always usable signal. It's the same logic as building up to a marathon with progressively longer races instead of running marathons badly from day one.

The trade-off is that the curriculum becomes a design surface of its own. Stage the horizons poorly and you can teach habits that win short tasks and sabotage long ones, like rushing toward a plausible-looking finish. KLong's results suggest the staging paid off here, but anyone copying the recipe should budget real effort for deciding where those stage boundaries sit.

## Key Results

The paper reports that KLong (106B) outperforms Kimi K2 Thinking (1T) by +11.28% on PaperBench, with transfer gains to SWE-bench Verified and MLE-bench.

<img src="https://assets.huntermussel.com/images/blog/klong-paperbench-results_16x9_med.webp" srcSet="https://assets.huntermussel.com/images/blog/klong-paperbench-results_16x9_thumb.webp 320w, https://assets.huntermussel.com/images/blog/klong-paperbench-results_16x9_low.webp 640w, https://assets.huntermussel.com/images/blog/klong-paperbench-results_16x9_med.webp 1280w, https://assets.huntermussel.com/images/blog/klong-paperbench-results_16x9_high.webp 1920w" sizes="(max-width: 1280px) 100vw, 1280px" alt="KLong benchmark results across PaperBench and engineering evaluations" className="w-full h-auto object-contain md:aspect-video md:object-cover" loading="lazy" />

The interesting part isn't the raw score. It's the size gap. KLong is a 106B model beating a 1T model on the benchmark it was trained for, which means roughly an order of magnitude in parameters was conceded and won back through data curation and training structure. If temporal endurance came free with scale, the bigger model should've kept the lead.

The transfer matters too. Gains that show up on SWE-bench Verified and MLE-bench, not just PaperBench, suggest the training taught something general about sustaining long work instead of memorizing one benchmark's shape. The usual caveats apply: these are the paper's own numbers, on a small set of benchmarks, and independent replication is the thing to wait for before treating any of it as settled.

## What This Means If You're Building Agents

You probably can't retrain a foundation model. You can still steal the ideas at the harness level.

Borrow the trajectory-splitting insight for context management. Agents hold up better when every working window carries a distilled version of the original goal and the key decisions made so far. That's an argument for structured summarization when you compact context, not just dropping the oldest messages and hoping.

Borrow the curriculum insight for task design. If your agent falls apart on day-long tasks, decompose them into shorter sub-goals with checkpoints where progress gets verified against the original objective before continuing. You're doing manually what KLong bakes in through training.

And borrow the evaluation lens when picking models. One-shot coding benchmarks say little about hour-long runs. If long-horizon work is what you're buying, test endurance directly: give candidate models a task that takes a strong engineer a full day and watch where each one loses the plot.

## Takeaway

KLong highlights temporal endurance as a trainable capability. Better data curation and staged training can beat raw parameter scaling for long workflows.

If that pattern holds, the next round of agent progress comes less from bigger checkpoints and more from whoever figures out how to manufacture long, messy, realistic work traces to train on. Go read the paper, and pay particular attention to how the trajectories were built. That's the part worth stealing.

Original paper: [https://arxiv.org/pdf/2602.17547](https://arxiv.org/pdf/2602.17547)
