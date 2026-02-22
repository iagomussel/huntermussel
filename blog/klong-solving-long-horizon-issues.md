---
title: "KLong: Advancing AI Agents for Extremely Long-Horizon Tasks"
date: "2026-02-19"
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
image: "/images/blog/klong-trajectory-splitting.webp"
subtitle: "A compact analysis of KLong's training strategy and benchmark gains"
status: "published"
---

Artificial intelligence has made major progress in reasoning, coding, and natural language tasks. But many systems still fail on workflows that require hundreds or thousands of coordinated steps over long periods.

KLong targets this gap directly with training focused on extremely long-horizon task completion, allowing agents to stay coherent and goal-directed across extended processes.

<!-- truncate -->

## Why Long-Horizon Capability Matters

Real technical work often does not fit short prompts:

- Debugging distributed systems end to end
- Reproducing scientific papers
- Building and iterating complete ML pipelines
- Running deep security audits

These tasks demand planning continuity, memory of prior decisions, and stable alignment to an overall objective. Many current agents still break mid-process.

## KLong's Two-Stage Training Strategy

### 1. Trajectory-Splitting Supervised Fine-Tuning

Standard SFT on full, very long trajectories can exceed context limits. KLong splits expert trajectories into overlapping sub-trajectories, preserving key early context while keeping training windows tractable.

<img src="/images/blog/klong-trajectory-splitting_16x9_med.webp" srcSet="/images/blog/klong-trajectory-splitting_16x9_thumb.webp 320w, /images/blog/klong-trajectory-splitting_16x9_low.webp 640w, /images/blog/klong-trajectory-splitting_16x9_med.webp 1280w, /images/blog/klong-trajectory-splitting_16x9_high.webp 1920w" sizes="(max-width: 1280px) 100vw, 1280px" alt="KLong trajectory-splitting setup for long-horizon supervised fine-tuning" className="w-full h-auto object-contain md:aspect-video md:object-cover" loading="lazy" />

### 2. Progressive Reinforcement Learning

Long tasks have delayed rewards. KLong addresses this with a progressive curriculum: shorter and simpler horizons first, then increasing execution windows over stages. This stabilizes optimization and improves long-range credit assignment.

## Key Results

The paper reports that KLong (106B) outperforms Kimi K2 Thinking (1T) by +11.28% on PaperBench, with transfer gains to SWE-bench Verified and MLE-bench.

<img src="/images/blog/klong-paperbench-results_16x9_med.webp" srcSet="/images/blog/klong-paperbench-results_16x9_thumb.webp 320w, /images/blog/klong-paperbench-results_16x9_low.webp 640w, /images/blog/klong-paperbench-results_16x9_med.webp 1280w, /images/blog/klong-paperbench-results_16x9_high.webp 1920w" sizes="(max-width: 1280px) 100vw, 1280px" alt="KLong benchmark results across PaperBench and engineering evaluations" className="w-full h-auto object-contain md:aspect-video md:object-cover" loading="lazy" />

## Takeaway

KLong highlights temporal endurance as a trainable capability. Better data curation and staged training can beat raw parameter scaling for long workflows.

Original paper: [https://arxiv.org/pdf/2602.17547](https://arxiv.org/pdf/2602.17547)
