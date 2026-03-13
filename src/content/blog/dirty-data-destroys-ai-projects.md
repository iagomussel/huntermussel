---
title: "Why dirty data destroys AI projects — before the first deploy"
date: "2026-03-13"
authors:
  - iago-mussel
description: "Data quality is the most common and least discussed reason AI projects fail. Here's how to assess what you have, what it costs you, and what to fix first."
tags:
  - Data Quality
  - AI
  - Machine Learning
  - Data Engineering
  - Project Risk
keywords:
  - dirty data ai projects
  - data quality ai
  - data preparation machine learning
  - ai project data requirements
  - garbage in garbage out ai
subtitle: "The model is the last thing that fails. The data is the first."
status: "draft"
---

Teams spend weeks evaluating AI models. Comparing benchmarks. Reading papers. Debating which LLM to use.

Then they connect the model to their data and discover that none of that matters yet — because the data isn't ready.

I've seen this happen more times than I can count. Data quality problems destroy more AI projects than model limitations. And they destroy them earlier — before anything is deployed, when the team discovers that the 18 months of historical data they were counting on is inconsistent, incomplete, or structured in a way that makes it nearly useless.

<!-- truncate -->

## The data quality audit nobody does before starting

Most AI projects begin with an assumption: "we have data." What they actually mean is "we have records stored somewhere." Those are different things.

Data quality has five dimensions. Most teams check one (completeness) and miss the other four.

**Completeness.** Are the fields you need present? A dataset with 40% null values in a key column is incomplete. You can impute some of it. You can't impute your way out of a systemic collection problem.

**Consistency.** Does the same concept appear the same way across records? "United States," "US," "U.S.A.," and "usa" are the same country. To a naive model, they're four different values. If your CRM has been populated by 50 different people over 8 years, it has consistency problems. Guaranteed.

**Accuracy.** Does the data reflect reality? Old records with addresses that have changed. Products with prices that haven't been updated. Customer segments defined under a different business model. Accurate at the time of collection doesn't mean accurate now.

**Timeliness.** Is the data current enough to be useful? A model trained on 3-year-old transaction data will reflect behavioral patterns from a different market. For dynamic domains, stale training data is worse than no data — it trains confidently on patterns that no longer hold.

**Uniqueness.** Are there duplicates? The same customer appearing 17 times in the CRM because different reps entered them slightly differently. The same product with multiple SKUs that weren't merged after an acquisition. Duplicates bias models toward whatever the most-duplicated records represent.

## What it costs you

Bad data doesn't just slow down model training. It creates a compounding cost throughout the project.

**Discovery delay.** Data quality problems are usually found mid-project, not at the start. Teams discover issues when they start training and see nonsensical outputs. This delays the entire timeline while data is investigated and cleaned. I've seen projects lose 6 weeks to this.

**Rework.** If the data pipeline is built before data quality issues are understood, it gets rebuilt. Cleaning logic added retroactively is messier and harder to maintain than cleaning logic designed in from the start.

**Model performance shortfall.** A model trained on dirty data performs worse than its architecture theoretically allows. When the client sees the results, the shortfall gets attributed to the model or the approach — not the data quality problem that caused it. **The team chases model improvements that won't help.**

**Trust erosion.** If the model's outputs are inconsistent — because inconsistent data produced inconsistent training — stakeholders lose trust. An AI system that's right 80% of the time and wrong 20% of the time in unpredictable ways is often harder to adopt than one that's slower but trustworthy.

## The minimum viable data assessment

Before starting any AI project that involves historical data, run this assessment:

**1. Sample the data.** Pull 500 random records. Look at them. Not aggregate statistics — actual records. Read the raw values. You will find things that no profiling tool would surface.

**2. Calculate field completeness.** For every field you plan to use: what's the null rate? What's the rate of sentinel values that indicate missing data ("N/A," "0," "unknown")?

**3. Check the distribution of key fields.** If 70% of your training data comes from a single month two years ago, your model will be biased toward conditions from that period.

**4. Validate consistency for categorical fields.** List all unique values for every categorical field. Look for synonyms, case variants, and typos. This tells you the normalization work required.

**5. Check temporal distribution.** When was each record created? Is the data spread evenly over time or concentrated in specific periods? How recent is the most recent training data?

This takes a few days. It prevents months of wasted work.

## What to fix first

You'll never have perfect data. The goal is "good enough to train a model that's useful."

Prioritize cleaning in this order:

1. **Remove or flag records with null values in critical fields.** If you can't impute them sensibly, exclude them from training.
2. **Normalize high-cardinality categorical fields.** Country names, product categories, customer segments. Build a mapping table and apply it.
3. **Deduplicate.** Choose a deduplication key, merge duplicates by your business rules, and commit to that decision in writing.
4. **Remove records outside your valid time range.** Training on data that's too old usually hurts more than it helps.

Document every cleaning decision. What was removed, why, and what effect it had on dataset size. This becomes the data card for your model — required for any serious governance or auditability requirement.

## The real lesson

The teams that succeed with AI treat data quality as a prerequisite, not a parallel workstream.

They assess the data first. They define what "clean enough" means before they start the project. They build the cleaning pipeline as part of the data engineering work, not as an emergency fix when training produces bad results.

The model is the last thing that fails. The data is the first.

---

_I work with teams building production systems and developer tooling. If this topic resonates, you can find more of my work at https://huntermussel.com._
