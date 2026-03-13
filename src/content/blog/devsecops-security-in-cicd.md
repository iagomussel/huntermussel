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

But the pushback against security in pipelines is real. Engineers have seen security processes that added 20 minutes to every build, blocked deploys over low-severity findings, and required three approval signatures for a CSS change. That's not security — it's theater with a badge.

The goal is security that finds real problems without destroying delivery velocity.

<!-- truncate -->

## The DevSecOps principle: fail fast on what matters

Security checks should run early, run automatically, and only block on findings that represent real risk.

Everything else — low-severity informational findings, accepted risks, known false positives — goes into a report that gets reviewed on a cadence, not a hard gate that stops shipping.

The teams that hate security in CI/CD have pipelines full of noise. Every deploy blocked by a finding that's been "known and accepted" for six months. Every build slower because of a scanner that runs sequentially instead of in parallel.

Fix the noise. The signal is worth protecting.

## Layer 1: Secret scanning (non-negotiable)

A leaked API key, database credential, or private key in a public repository is an incident. This is the highest-severity risk with the lowest complexity to catch.

Run secret scanning on every commit. It's fast, it's accurate, and it should hard-block on any finding.

```yaml
- name: Secret scanning
  uses: trufflesecurity/trufflehog@main
  with:
    path: ./
    base: ${{ github.event.repository.default_branch }}
    head: HEAD
    extra_args: --only-verified
```

`--only-verified` filters to secrets that have been confirmed active. This eliminates the majority of false positives.

No secrets in code. If a secret is found: rotate it immediately, then fix the commit. Order matters — rotate first.

## Layer 2: Dependency scanning

Your application is mostly other people's code. If a library you depend on has a known vulnerability, you're exposed.

```yaml
- name: Dependency audit
  run: npm audit --audit-level=high
```

Run this in every PR. Block on high and critical severity findings. Report moderate and low for review.

For containers, add image scanning before push:

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

The key decision: what severity level warrants a hard block versus a report? My default: CRITICAL always blocks. HIGH blocks with an exception process. MEDIUM and LOW go to a scheduled review.

## Layer 3: Static Application Security Testing (SAST)

SAST tools analyze your code for security patterns: SQL injection, XSS, insecure deserialization, hardcoded credentials, unsafe cryptography.

GitHub's CodeQL is free for open-source and reasonably priced for private repositories:

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

SAST has a false positive problem. Tune the ruleset to your language and framework. Don't block on informational findings — they'll bury real issues.

## Layer 4: Infrastructure security scanning

If you're shipping IaC (Terraform, CloudFormation, Kubernetes manifests), scan them too.

```yaml
- name: Scan Terraform
  uses: aquasecurity/tfsec-action@v1.0.0
  with:
    soft_fail: true
```

`soft_fail: true` during initial rollout lets you see findings without breaking existing pipelines. Set a date to move it to hard fail after the backlog is addressed.

## Running it fast: parallelization

The biggest performance mistake in security pipelines is running checks sequentially.

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

Secret scanning, dependency scanning, and SAST have no dependencies on each other. Run them in parallel. A 12-minute sequential security stage becomes a 4-minute parallel one.

## The exception process

Not every finding is fixable immediately. Some require library upgrades that break compatibility. Some are in code you don't own. Some are accepted risks for your threat model.

These need a documented exception process — not ignored, not silently suppressed.

A finding accepted as a known risk should have:
- Who accepted it
- Why
- When it will be reviewed again
- What mitigations are in place

A YAML file in the repository, reviewed quarterly, is sufficient for most teams. The goal is auditability — not bureaucracy.

## What not to do

**Don't run everything on every commit.** SAST on a one-line docs change is overhead with no return. Scope security checks to what changed.

**Don't hard-block on findings you haven't reviewed.** Turn on new scanners in report mode first. Review the findings. Decide what's real. Then enable hard blocking on the signal you trust.

**Don't treat security as a separate team's problem.** When security findings are routed to a different team to resolve, they accumulate. When the engineer who wrote the code gets the finding immediately, it gets fixed.

Security in the pipeline is only as good as the culture around it.

---

_I work with teams building production systems and developer tooling. If this topic resonates, you can find more of my work at https://huntermussel.com._
