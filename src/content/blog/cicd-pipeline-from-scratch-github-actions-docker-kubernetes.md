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

Most CI/CD tutorials show you the happy path. This one shows you the full pipeline — including the parts that break, the decisions that matter, and what to skip when you're starting from zero.

The stack: GitHub Actions for orchestration, Docker for packaging, Kubernetes for deployment.

<!-- truncate -->

## What we're building

A pipeline that:

1. Runs tests on every pull request
2. Builds a Docker image on merge to main
3. Pushes the image to a registry
4. Deploys to a Kubernetes cluster with zero downtime
5. Validates the deploy before marking it complete

That's the baseline. Everything else is optimization.

## Step 1: The repository structure

Before writing any pipeline code, make sure your repository has what the pipeline needs.

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

Two workflow files. `ci.yml` handles testing — runs on every PR. `deploy.yml` handles building and deploying — runs on merge to main.

## Step 2: The CI workflow

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

Keep CI fast. Under 5 minutes is the target. Over 10 minutes means developers stop waiting for it.

## Step 3: The Dockerfile

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

Two stages. The builder installs everything and compiles. The runtime image contains only what's needed to run. Smaller image, smaller attack surface.

Run as a non-root user. This is not optional in production.

## Step 4: The deploy workflow

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

The `rollout status` step is the validation gate. The workflow fails if the new pods don't become healthy within 5 minutes. This means a bad deploy doesn't silently succeed — it fails the pipeline and gives you a signal to investigate.

## Step 5: The Kubernetes deployment

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

`maxUnavailable: 0` ensures zero-downtime rolling updates. The readiness probe ensures Kubernetes doesn't route traffic to a pod that isn't ready to serve it.

## The secrets you need to configure

In your GitHub repository settings (Settings → Secrets):

- `KUBECONFIG`: Base64-encoded kubeconfig for your cluster (`cat ~/.kube/config | base64`)

The Docker registry authentication uses `GITHUB_TOKEN`, which GitHub provides automatically for GitHub Container Registry.

## What to add next

This baseline gets you to zero-downtime deploys with automated testing. From here, the highest-value additions are:

1. **Slack notifications** on deploy success/failure
2. **Environment-specific workflows** (staging deploy on PR merge, production deploy on tag)
3. **Secret scanning** in CI to catch leaked credentials before they ship
4. **Image vulnerability scanning** with Trivy before the push step

Build the baseline first. Add the rest once it's stable.

---

_I work with teams building production systems and developer tooling. If this topic resonates, you can find more of my work at https://huntermussel.com._
