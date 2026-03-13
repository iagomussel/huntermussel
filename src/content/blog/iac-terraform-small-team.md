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

Infrastructure as Code is one of those practices everyone agrees you should do and few teams actually do well.

Not because Terraform is hard. Because most teams try to automate everything at once, hit complexity walls, and abandon the effort halfway through.

The sequencing matters. Start with the wrong thing and you'll spend three weeks on Terraform modules that manage something you change twice a year.

<!-- truncate -->

## The principle: automate what breaks or changes

Small teams have limited time. The return on IaC investment is highest where:

- The infrastructure breaks and manual recovery is painful
- The configuration drifts and nobody knows the current state
- The same setup needs to be recreated (staging, new environment, disaster recovery)

That's where you start. Not with the most "correct" architecture. With the highest cost of not having it automated.

## Week 1-2: Networking and compute baseline

The most painful thing to rebuild manually is your networking layer. VPC, subnets, security groups, routing tables. If you've ever had to reconstruct this from memory after a misconfiguration, you know.

Start here. Get your foundational network infrastructure into Terraform. It changes rarely, but when it breaks, everything breaks with it.

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

Don't write the modules yourself yet. Use the community modules. The goal is coverage, not elegance.

## Week 3-4: Databases and stateful services

After networking, the highest-risk manual configuration is your databases. RDS instances, ElastiCache clusters, storage buckets with lifecycle policies.

These are the things that are hardest to recreate correctly from memory — and hardest to recover from if you get wrong. Getting them into Terraform means:

- You have a documented record of every configuration decision
- New environments (staging, QA) can be spun up in minutes, not days
- Disaster recovery becomes a `terraform apply` instead of a 6-hour rebuild

One rule: never use Terraform to manage database *data*. Only the infrastructure. Data lives in backups, not in state files.

## Week 5-6: Application infrastructure and secrets

Load balancers, auto-scaling groups, ECS or EKS clusters, IAM roles. This is where your application actually runs.

This layer is also the one most likely to drift. Engineers make manual tweaks to security groups "just this once." An IAM role gets an inline policy added through the console and nobody documents it. Over time, the actual infrastructure diverges from what anyone believes it to be.

Getting this into Terraform — and enforcing that changes only happen through code — closes that drift problem.

For secrets, connect Terraform to AWS Secrets Manager or HashiCorp Vault. Provision the secret containers through IaC. Populate actual values through a separate, audited process.

## What to skip for now

**Do not start with Kubernetes configuration.** Helm charts, Kustomize overlays, and cluster configuration are a separate problem from infrastructure provisioning. Mixing them adds complexity that drowns small teams.

**Do not abstract everything into reusable modules on day one.** Modules are the right answer at scale. At the start, duplicating resource definitions is fine. Premature abstraction creates maintenance burden before you understand the patterns.

**Do not automate CI/CD pipeline infrastructure until the pipeline itself is stable.** If your deploy process changes every month, automating its infrastructure locks in instability. Stabilize the process, then codify it.

## The state file is your most important artifact

Terraform tracks the world it manages in a state file. If you lose it, Terraform loses its map. If it gets corrupted, you have a significant recovery problem.

From day one: remote state in S3 with DynamoDB locking.

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

This is not optional. Local state files get lost, overwritten, and conflict. Remote state is the only production-appropriate option.

## The payoff

At the end of 6 weeks following this sequence, a small team has:

- Core networking documented and reproducible
- Databases recoverable in under an hour
- Application infrastructure auditable and drift-free
- A foundation to add the rest incrementally

The goal isn't to finish IaC. It's to build the habit. Infrastructure managed as code, reviewed as code, deployed as code. The rest follows.

---

_I work with teams building production systems and developer tooling. If this topic resonates, you can find more of my work at https://huntermussel.com._
