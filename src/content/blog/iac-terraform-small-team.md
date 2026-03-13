---
title: "IaC with Terraform: what to automate first when your team is small"
date: "2026-03-13"
authors:
  - iago-mussel
description: "Infrastructure as Code doesn't have to mean automating everything at once. Here's the sequencing that actually works for small engineering teams."
tags:
  - Terraform
  - IaC
  - Infrastructure
  - DevOps
  - Startup
keywords:
  - terraform small team
  - infrastructure as code getting started
  - terraform beginner guide
  - iac startup
  - terraform what to automate first
subtitle: "Start with the thing that costs you the most when it breaks."
status: "draft"
---

Everyone agrees you should do Infrastructure as Code. Almost nobody does it well.

Not because Terraform is hard. Because teams try to automate everything at once, hit a complexity wall somewhere around week three, and quietly abandon the effort. Six months later they're back to clicking through the AWS console, except now they also have a half-finished Terraform repo that nobody wants to touch.

The sequencing is the hard part. Start with the wrong thing and you'll spend three weeks writing modules for infrastructure you change twice a year.

<!-- truncate -->

## Start where the pain is highest

Small teams don't have time to do IaC perfectly. So don't try.

Ask a simpler question: what would hurt most to rebuild from memory right now? That's where you start.

The infrastructure worth automating first is the kind that:
- Takes hours to reconstruct when something goes wrong
- Drifts silently (someone tweaks a security group "just this once" and nobody documents it)
- Needs to be recreated for staging, QA, disaster recovery

Not the most architecturally elegant part of your stack. The part that wakes you up at night.

## Week 1–2: Networking

The most painful thing to rebuild manually is your VPC. Subnets, routing tables, security groups, internet gateways. If you've ever had to piece this back together after a misconfiguration incident, you know exactly what I mean.

Start here. It changes rarely, but when the network layer breaks, everything breaks with it.

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "production"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
}
```

Don't write the modules yourself yet. Use the community modules. The goal right now is coverage, not elegance.

## Week 3–4: Databases and stateful services

After networking, the highest-risk manual configuration is your databases. RDS instances, ElastiCache clusters, S3 buckets with lifecycle policies.

These are the things you really don't want to recreate from memory at 2am. Getting them into Terraform means:

- Every configuration decision is documented in code, not someone's head
- Spinning up a staging environment takes minutes, not a day of clicking
- Disaster recovery is a `terraform apply` instead of a 6-hour reconstruction

One hard rule: Terraform manages infrastructure, not data. Don't put your backups or data migration logic here. That's a separate concern.

## Week 5–6: Application layer and secrets

Load balancers, auto-scaling groups, ECS or EKS clusters, IAM roles. This is where your application actually lives.

This layer drifts the most. An engineer adds an inbound rule to a security group "to test something quickly" and it stays there for two years. An IAM role gets an inline policy added through the console during an incident and nobody writes it down. Over time, the real infrastructure diverges from what anyone thinks it is.

Getting this into Terraform and establishing that changes happen through code — not through the console — closes that drift problem.

For secrets: connect to AWS Secrets Manager or HashiCorp Vault. Provision the containers through IaC. Populate the actual values through a separate audited process. Never put secret values in Terraform state.

## What to skip for now

**Kubernetes configuration.** Helm charts and Kustomize overlays are a separate problem from infrastructure provisioning. Mixing them early adds complexity that drowns small teams. Get the infra right first.

**Reusable module abstractions.** Modules make sense at scale. Right now, copy-pasting resource definitions is fine. Premature abstraction before you understand the patterns creates maintenance burden, not efficiency.

**CI/CD pipeline infrastructure.** If your deploy process changes every month, automating its infrastructure locks in instability. Stabilize the process first, then codify it.

## One thing that's actually non-negotiable: remote state

Terraform keeps a map of everything it manages in a state file. Lose it and Terraform loses its context. Corrupt it and you have a serious recovery problem.

From day one, this goes in S3 with DynamoDB locking. Not locally. Not in a teammate's home directory.

```hcl
terraform {
  backend "s3" {
    bucket         = "your-company-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}
```

This is not a nice-to-have. Local state gets lost, conflicts, and overwrites. Remote state is the minimum viable option for anything running in production.

## Six weeks later

If you follow this sequence, at the end of six weeks a small team has:

- Core networking documented and reproducible
- Databases recoverable in under an hour
- Application infrastructure auditable and drift-resistant
- A foundation to add everything else incrementally

The goal isn't to finish IaC. It's to build the habit. Infrastructure reviewed in PRs, deployed through pipelines, documented in code. Once that habit exists, the rest follows.

---

_I work with teams building production systems and developer tooling. If this topic resonates, you can find more of my work at https://huntermussel.com._
