# TrendScholar – Scientific Journal Publication Trend Tracking System

> Frontend application for tracking and visualizing publication trends in scientific journals, powered by Semantic Scholar, OpenAlex, and Crossref.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Git Workflow](#git-workflow)
- [Scripts](#scripts)
- [Deployment (Vercel)](#deployment-vercel)
- [Contributing](#contributing)

---

## Overview

TrendScholar is a web application that allows researchers, lecturers, and students to:

- Search scientific papers by keyword, author, or journal
- Visualize publication trend charts over time
- Discover trending research topics
- Bookmark papers and follow journals/topics for notifications
- Generate and export trend analysis reports (Researcher role)

**Role matrix:** Researcher · Lecturer/Student · Admin

---

## Tech Stack

| Layer       | Technology                                       |
|-------------|--------------------------------------------------|
| Framework   | React 18 + TypeScript (strict mode)              |
| Build tool  | Vite 5                                           |
| Styling     | Tailwind CSS v3 + custom design tokens           |
| Routing     | React Router v6                                  |
| HTTP client | Axios (with JWT interceptor)                     |
| Charts      | Recharts                                         |
| Icons       | Lucide React                                     |
| Deployment  | Vercel                                           |

---

## Project Structure

```
src/
├── assets/           # Static assets (images, icons)
├── components/
│   ├── home/         # Homepage-specific sections
│   ├── layout/       # Navbar, Footer, RootLayout
│   └── ui/           # Reusable UI components (Button, Card, Badge…)
├── hooks/            # Custom React hooks
├── pages/            # Route-level page components
├── services/         # API service layer (Axios instances)
├── styles/           # Global CSS (Tailwind base + custom layers)
├── types/            # TypeScript interfaces & enums
└── utils/            # Utility functions (cn, formatters…)
```

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x (or pnpm / yarn)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd scientific-journal-fe

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your local values

# 4. Start dev server
npm run dev
# App runs at http://localhost:3000
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
VITE_API_BASE_URL=http://localhost:8080    # Backend API URL
VITE_APP_NAME=TrendScholar
VITE_APP_ENV=development
```

> ⚠️ **Never commit `.env.local` or any file containing real API keys to version control.**

See [`.env.example`](.env.example) for the full list of available variables.

---

## Git Workflow

This repository uses a **two-branch strategy**:

| Branch  | Purpose                                                          |
|---------|------------------------------------------------------------------|
| `main`  | Production-ready code. Only merged from `dev` after review.     |
| `dev`   | Integration branch. Feature branches are merged here first.     |

### Feature branch naming

```
feature/<jira-id>-short-description
fix/<jira-id>-short-description
chore/description
```

### Workflow

```bash
# Start a feature
git checkout dev
git pull origin dev
git checkout -b feature/TS-42-trend-chart

# ... make changes, commit ...

# Push and open PR → target: dev
git push origin feature/TS-42-trend-chart
```

PRs to `dev` require at least **1 reviewer approval**. PRs from `dev` → `main` require team lead sign-off.

---

## Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Type-check + production build
npm run preview      # Preview production build locally
npm run lint         # ESLint check
npm run type-check   # TypeScript strict check (no emit)
```

---

## Deployment (Vercel)

The app is deployed to [Vercel](https://vercel.com) with automatic preview deployments on every PR.

### Manual deploy

```bash
npm run build        # Outputs to dist/
# Then push to main — Vercel auto-deploys
```

### Required Vercel environment variables

Set the following in **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable              | Environment         |
|-----------------------|---------------------|
| `VITE_API_BASE_URL`   | Production, Preview |
| `VITE_APP_ENV`        | Production          |

SPA routing is handled by [`vercel.json`](./vercel.json) — all routes rewrite to `index.html`.

---

## Contributing

1. Branch from `dev` (never from `main`)
2. Follow the naming convention above
3. Ensure `npm run lint` and `npm run type-check` pass before pushing
4. Open a PR targeting `dev` and request review

---

*TrendScholar is developed as a capstone project. Data is sourced from public academic APIs.*
