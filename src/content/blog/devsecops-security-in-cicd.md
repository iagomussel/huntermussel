---
title: "How to integrate security into CI/CD without slowing your team down"
date: "2026-03-13"
authors:
  - iago-mussel
description: "DevSecOps in practice: the security checks that belong in every pipeline, how to run them without adding friction, and where to draw the hard lines."
tags:
  - DevSecOps
  - CI/CD
  - Security
  - DevOps
  - GitHub Actions
keywords:
  - devsecops cicd
  - security in pipeline
  - shift left security
  - cicd security checks
  - devsecops practices
subtitle: "Shift left doesn't mean shift slow."
status: "draft"
---

"We'll add security later" is how you end up with a CVE in production, a compliance audit you failed, or a compromised dependency you didn't know existed.

But I get the pushback. Engineers have seen security processes that added 20 minutes to every build, blocked deploys over low-severity findings that had been "known and accepted" for months, and required three approvals for a CSS change. That's not security. That's theater with a badge on it.

The goal is security that actually catches real problems — without turning your pipeline into a parking lot.

<!-- truncate -->

## The principle: only block on what actually matters

Security checks should run early, run automatically, and hard-block only on findings that represent real risk.

Everything else — informational findings, accepted risks, known false positives — goes into a report reviewed on a cadence. Not a gate that stops shipping.

The teams that hate security in CI/CD are the ones running noisy scanners sequentially, getting blocked by the same stale finding every deploy, and spending more time managing the security tool than the security problem.

Fix the noise. The signal is worth protecting.

## Layer 1: Secret scanning — non-negotiable, runs everywhere

A leaked API key or database credential in your repository is an incident. This is the highest-severity risk with the simplest fix.

Run secret scanning on every commit. It's fast and the false positive rate is manageable with the right configuration.

```yaml
- name: Secret scanning
  uses: trufflesecurity/trufflehog@main
  with:
    path: ./
    base: ${{ github.event.repository.default_branch }}
    head: HEAD
    extra_args: --only-verified
```

`--only-verified` filters to credentials that are confirmed active. This eliminates the majority of false positives from test fixture data and example configs.

If a secret is found: rotate it immediately, then fix the commit. That order matters. Rotate first.

## Layer 2: Dependency scanning

Your application is mostly other people's code. That's fine — until one of those libraries has a known vulnerability and you're carrying it to production unaware.

```yaml
- name: Dependency audit
  run: npm audit --audit-level=high
```

Run this in every PR. Block on CRITICAL and HIGH. Report MODERATE and LOW for scheduled review.

For container images, add scanning before push:

```yaml
- name: Scan image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ env.IMAGE_NAME }}:${{ github.sha }}
    format: 'sarif'
    output: 'trivy-results.sarif'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
```

My defaults: CRITICAL always blocks. HIGH blocks with an exception process. MEDIUM and LOW go to a scheduled review. These aren't magic thresholds — adjust for your risk tolerance — but having a documented policy matters more than the specific levels.

## Layer 3: Static analysis (SAST)

SAST tools scan your code for security patterns: SQL injection, XSS, unsafe deserialization, hardcoded credentials. They catch things that linters miss.

GitHub's CodeQL is free for open source:

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v3
  with:
    languages: javascript

- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v3
  with:
    category: "/language:javascript"
```

SAST has a false positive problem. Every tool does. Tune the ruleset to your language and framework, and start in report-only mode before enabling hard blocking. If you turn on hard blocking before you've reviewed the initial findings, you'll immediately have a backlog of blocked deploys and a team that resents the tool.

## Layer 4: Infrastructure scanning

If you're shipping Terraform or Kubernetes manifests, scan them.

```yaml
- name: Scan Terraform
  uses: aquasecurity/tfsec-action@v1.0.0
  with:
    soft_fail: true
```

Start with `soft_fail: true`. Set a date — two or three sprints out — to move it to hard fail after you've worked through the initial findings. This is the same "report first, block second" pattern. It works.

## Run all of this in parallel

The single biggest reason security in CI/CD is slow is sequential execution.

```yaml
jobs:
  security:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        check: [secrets, dependencies, sast]
    steps:
      - uses: actions/checkout@v4
      - name: Run ${{ matrix.check }}
        run: ./scripts/security/${{ matrix.check }}.sh
```

Secret scanning, dependency scanning, and SAST have no dependencies on each other. Run them in parallel. A 12-minute sequential security stage becomes a 4-minute parallel one. That's the difference between "this adds friction" and "this is invisible."

## What to do with findings you can't fix immediately

Not every finding is fixable now. Some require library upgrades that break compatibility. Some are in code you don't own. Some are accepted risks for your specific threat model.

These need a documented exception — not ignored, not silently suppressed.

A finding accepted as a known risk needs: who accepted it, why, when it'll be reviewed again, and what mitigations are in place. A YAML file in the repo reviewed quarterly is enough for most teams. The goal is auditability, not paperwork.

## The three things that kill security in pipelines

**Running everything on every commit.** SAST on a one-line doc change is overhead with no return. Scope checks to what changed.

**Hard-blocking on findings you haven't reviewed.** Turn new scanners on in report mode first. See what they catch. Decide what's signal. Then block on it.

**Making it someone else's problem.** When findings get routed to a separate security team, they accumulate. When the engineer who wrote the code sees the finding immediately, it gets fixed. Security in the pipeline only works when the people who wrote the code own the findings.

---

_I work with teams building production systems and developer tooling. If this topic resonates, you can find more of my work at https://huntermussel.com._
