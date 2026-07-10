---
title: "LLMs Don't Think. Here's the Math and the Path Out."
date: "2026-07-10"
authors:
  - iago-mussel
description: "LLMs sound like they're reasoning, but they're stuck in parallel prediction. This article breaks down the math behind the illusion and the research that could change it."
tags:
  - LLM
  - AI Research
  - Machine Learning
  - Cognitive Science
  - Slow Thinking
keywords:
  - llms don't think
  - transformer limitations
  - slow thinking ai
  - chain of thought reasoning
  - active lifting
  - explanatory samplers
  - system 1 system 2 ai
  - constant depth circuits
  - active perception
subtitle: "Current LLMs are System 1, only bigger. A new first-principles theory explains why that isn't enough — and what comes next."
status: "published"
image: "https://assets.huntermussel.com/images/blog/llms-dont-think-math-and-fix-infographic.png"
---

Ask a large language model to track a ball through three cup swaps and the confident answer often falls apart. That's not a quirk of training data. It's a structural limit. Current LLMs are fast pattern-matching machines dressed up as reasoners, and a recent first-principles theory finally gives us the math to say so out loud.

<!-- truncate -->

![Theory of "Slow Thinking": AI Beyond Instinct — an infographic showing System 1 vs System 2, Active Lifting, and the Sampling Hierarchy.](https://assets.huntermussel.com/images/blog/llms-dont-think-math-and-fix-infographic.png)

## They're System 1, not System 2

Kahneman's split is useful here. System 1 is the fast, automatic, pattern-driven stuff. System 2 is the slow, deliberate, sequential stuff.

Today's LLMs are System 1, only bigger.

Under the hood, a Transformer is basically a constant-depth boolean circuit — the complexity class TC^0 if you want the label. Every token prediction runs through a fixed number of layers in parallel. The model looks at the context, computes attention in parallel, and spits out the next word. No matter how big the model is, it doesn't get to think longer about harder questions. It just gets wider.

That works beautifully for "the capital of Brazil is..." because the pattern is right there in the training data. It fails for anything that needs step-by-step tracking over many moves. The cup-and-ball problem is one of those: you can't solve it with pure parallel computation once the chain of swaps grows. The model has no internal clock, no budget of deliberation, only a budget of parameters.

## The prediction wall

LLMs are statistical predictors. They try to approximate the true distribution P* of human text. The Representation Hierarchy Theory — part of the slow-thinking framework — shows that plain fast-thinking models hit a hard expressiveness ceiling.

Because Transformers are depth-limited, they can't approximate simple but sequential distributions over long ranges. Hidden Markov Models are a clean example: the dependencies stretch across steps, and shallow parallel circuits can't unfold them cleanly. So the model compensates by memorizing surface patterns, piling on parameters, and smoothing over the parts it can't actually reason through.

That isn't thinking. It's impressive compression.

## The way out: slow thinking and active lifting

The fix isn't more parameters. It's a different kind of computation.

Slow thinking gives the model an internal timeline. Instead of producing each token in one parallel step, it generates intermediate "thought" tokens — chain-of-thought style — that live between the input and the output. The model gets to think before it commits.

The theory formalizes this through active lifting. Instead of trying to model the messy observable world directly, the model lifts the distribution into a much larger latent space. In that space, hard structures become sequences of simpler thoughts that are easier to learn.

It's the difference between reading a tough book once and reading it with a pencil in the margin. The notes don't replace the text; they make the text tractable.

## Samplers that explain, not just continue

Not all thought generation is equal. The paper lays out a hierarchy of samplers — the strategies a model uses to produce those latent thoughts.

At the bottom are identity and predictive samplers. They generate the next thought based only on what came before, like a causal continuation of the chain. That's where current chain-of-thought models live.

The interesting target is the explanatory sampler. It isn't locked into forward-time causality during training. It can look at both the problem and the desired solution and build a logical bridge between them. The authors report roughly a 264% efficiency improvement over predictive samplers — same complexity, more useful training signal.

That changes what "learning to reason" means. It stops being about predicting the next word humans wrote and starts being about discovering the explanation that connects question to answer.

## Make thinking persistent and everywhere

![Mind map of the paper's structure: Core Theoretical Framework, Representation Hierarchy, Sampler Hierarchy, Mechanisms and Processes, and Applications and Improvements.](https://assets.huntermussel.com/images/blog/llms-dont-think-math-and-fix-mindmap.png)

Right now, slow thinking in models like DeepSeek-R1 is mostly a single-round trick. You ask, it thinks, it answers, and the thought trail evaporates.

The theory argues for ubiquitous and persistent thinking.

Ubiquitous means reasoning tokens belong anywhere in the text — not just between question and answer, but during pre-training too. If a model reasons while reading raw data, it can pick up logic, physics, and math from the source instead of merely imitating the surface forms.

Persistent means each thought leaves a lasting mark on later processing, like human working memory. A model reading a long chapter could carry insights from page one to page twenty, instead of treating every paragraph as an isolated statistical event.

That fixes the forgetful-LLM problem at the root. The issue isn't context length; it's that the model never had a real state to begin with.

## Inventing a mental language

The endgame of active lifting is more than chain-of-thought in English. It's letting the model invent its own compact internal language — a mental language — to describe the world efficiently.

Instead of predicting the next human word, the model tries to reduce its uncertainty about what it sees as fast as possible. It's closer to how humans built concepts, then languages, to organize thought. The model isn't just parroting our symbols; it's learning to name what matters.

## What to watch

Don't treat fluency as reasoning. The next time a model gives a slick answer, ask yourself whether it's tracking a chain or finishing a pattern.

The research direction is clear: active lifting, slow internal time, explanatory samplers, and persistent state. If that work lands, we'll move from models that imitate human answers to models that can actually process a problem. That's a bigger shift than another 100 billion parameters.

Read the paper if you want the proofs: [A First-Principles Theory of Slow Thinking and Active Perception](https://www.global-sci.com/jml/article/view/24168).

---

_I work with teams building production systems and developer tooling. If this topic resonates, you can find more of my work at https://huntermussel.com._
