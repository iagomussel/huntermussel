---
title: "How to build a CI/CD pipeline from scratch with GitHub Actions, Docker, and Kubernetes"
date: "2026-03-13"
authors:
  - iago-mussel
description: "A practical, step-by-step guide to building a production-grade CI/CD pipeline using GitHub Actions, Docker, and Kubernetes — from zero to working deploy."
tags:
  - CI/CD
  - GitHub Actions
  - Docker
  - Kubernetes
  - DevOps
keywords:
  - cicd pipeline github actions
  - github actions docker kubernetes
  - build cicd from scratch
  - kubernetes deployment pipeline
  - github actions tutorial
subtitle: "From first commit to automated production deploy."
status: "draft"
---

Most CI/CD tutorials show you a happy path that works in isolation and breaks the moment you touch anything real.

This one shows you the full pipeline — including the decisions that matter, the parts that are easy to get wrong, and what to skip when you're starting from zero.

Stack: GitHub Actions for orchestration, Docker for packaging, Kubernetes for deployment. Here's exactly what I'd build.

<!-- truncate -->

## What you're building

A pipeline that:

1. Runs tests on every pull request
2. Builds a Docker image on merge to main
3. Pushes the image to a registry
4. Deploys to Kubernetes with zero downtime
5. Validates the deploy before declaring success

That's the baseline. Everything else is optimization you can add later.

## Start with the repository structure

Before writing any workflow YAML, make sure your repo has what the pipeline actually needs.

```
project/
├── src/
├── tests/
├── Dockerfile
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
└── .github/
    └── workflows/
        ├── ci.yml
        └── deploy.yml
```

Two workflow files. `ci.yml` handles testing — fires on every PR. `deploy.yml` handles building and deploying — fires on merge to main. Keeping them separate means a failing test doesn't prevent you from understanding deploy behavior, and you can iterate on each independently.

## The CI workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linter
        run: npm run lint
```

Keep CI fast. Under 5 minutes is the target. Over 10 minutes and developers start skipping it or merging before it finishes — which defeats the whole point.

If your tests are slow, that's a test architecture problem. Don't accept slow CI as normal.

## The Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER appuser
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

Two stages. The builder installs and compiles. The runtime image only contains what's needed to run the app. Smaller image, smaller attack surface.

The non-root user at the end is not optional in production. Running containers as root is a security risk that's trivial to avoid.

## The deploy workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}

    steps:
      - uses: actions/checkout@v4

      - name: Log in to registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=sha-

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Configure kubectl
        uses: azure/setup-kubectl@v3

      - name: Set kubeconfig
        run: echo "${{ secrets.KUBECONFIG }}" | base64 -d > /tmp/kubeconfig

      - name: Update image tag
        run: |
          sed -i "s|IMAGE_TAG|${{ needs.build-and-push.outputs.image-tag }}|g" k8s/deployment.yaml

      - name: Apply deployment
        run: kubectl apply -f k8s/ --kubeconfig /tmp/kubeconfig

      - name: Wait for rollout
        run: kubectl rollout status deployment/app --timeout=5m --kubeconfig /tmp/kubeconfig
```

That last `rollout status` step is the important one. The workflow fails if the new pods don't become healthy within 5 minutes. A bad deploy fails the pipeline — it doesn't silently succeed and leave you wondering what happened.

## The Kubernetes deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: app
        image: IMAGE_TAG
        ports:
        - containerPort: 3000
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
```

`maxUnavailable: 0` is what gives you zero-downtime rolling updates. Old pods stay up until the new ones are ready.

The readiness probe is equally important. Without it, Kubernetes routes traffic to pods before they're actually ready to handle requests. That causes errors during deploys that look like bugs but are really just timing issues.

## Secrets setup

Two things to configure in GitHub repository settings → Secrets:

- `KUBECONFIG`: Base64 your kubeconfig with `cat ~/.kube/config | base64`

Docker registry auth uses `GITHUB_TOKEN`, which GitHub provides automatically for GitHub Container Registry. No additional setup needed.

## What to add next

This baseline gets you from PR to zero-downtime production deploy with validation. Once it's stable, the highest-value additions are:

- **Slack/Discord notifications** on deploy success or failure — know immediately without watching the Actions tab
- **Environment-specific workflows** — staging on PR merge, production on tag push
- **Secret scanning** in CI — catch leaked credentials before they ship
- **Image vulnerability scanning** with Trivy before the push step

Build the baseline. Run it for two weeks. Then add the rest.

---

_I work with teams building production systems and developer tooling. If this topic resonates, you can find more of my work at https://huntermussel.com._
