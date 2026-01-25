# dopl

A portfolio site with a conversational AI digital twin, powered by Claude and a Google Docs knowledge base.

**Stack:** React, TypeScript, Express, Tailwind CSS, Docker

**Infra:** GCP VM, GitHub Actions CI/CD, GHCR, nginx

## Setup

```bash
npm run install:all
npm run dev
```

Requires `backend/.env` and `frontend/.env` — see `.env.example` in each directory.

## Deploy

Push to `main` triggers the GitHub Actions pipeline: lint → build Docker images → deploy to GCP.
