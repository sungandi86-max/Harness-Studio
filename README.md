# Harness Studio

**Your AI Workspace**  
**Build once. Reuse forever.**

Harness Studio is a local-first personal AI workspace. It is not just a prompt saver. It connects the way a user works with AI across projects: projects, prompts, workflows, AI team roles, knowledge, assets, rules, next steps, and activity.

## Product Philosophy

AI remembers conversations. Harness remembers how you work.

The core goal is to turn repeated project context and working habits into reusable assets. A project can keep its own prompts, workflow templates, decision records, rules, next actions, and supporting links.

## Main Features

- Workspace Home with next projects, next steps, favorite prompts, recent workflows, activity, and stats
- Project list with search, filters, sorting, favorites, progress, links, and CRUD
- Project Harness detail with Overview, Next Steps, AI Team, Workflow, Prompts, Knowledge, Assets, Rules, and Activity
- Prompt Library with copy, favorite, edit, delete, duplicate, and use count
- Workflow Library with reusable steps and execution mode
- Knowledge Library for notes, decisions, lessons, errors, tips, references, and snippets
- Assets Library for URL-based image, document, PDF, link, brand, character, reference, and code assets
- Command-palette style integrated search with `Ctrl/Cmd + K`
- localStorage persistence through repository modules
- JSON export, JSON import, sample reset, and full delete
- Responsive layout with desktop sidebar and mobile bottom navigation

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Lucide React
- localStorage
- Repository Pattern

## Install And Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Commands

```bash
npm run lint
npm run build
```

## Project Structure

```text
app/                         Next.js App Router pages
src/components/ui/           Shared UI primitives
src/features/app/            App shell and top-level state orchestration
src/features/workspace/      Workspace Home
src/features/projects/       Project list and Project Harness detail
src/features/library/        Prompt, Workflow, Knowledge, Asset, Favorites views
src/features/search/         Command Palette
src/features/settings/       Import/export/reset settings
src/features/editor/         Unified create/edit modal
src/lib/repositories/        Domain repositories
src/lib/storage/             localStorage adapter and import validation
src/lib/utils/               Date and text helpers
src/data/seed/               Sample Sookang workspace data
src/types/                   TypeScript domain models
```

## Current MVP Scope

Included: local workspace, sample data, CRUD, favorites, integrated search, workflow execution, prompt copy/use count, JSON import/export, responsive UI, documentation.

Excluded for now: login, Supabase, cloud sync, actual file upload, AI API calls, shared community templates.

## Data Storage

All workspace data is stored under one localStorage key:

```text
harness-studio.workspace.v1
```

UI components do not call localStorage directly. They call repository modules, which read and write the full workspace object.

## Screenshot Placeholder

Add production screenshots here after deployment:

- Workspace Home
- Project Harness detail
- Prompt Library
- Settings export/import

## Deployment

The app can be deployed as a standard Next.js project. For Vercel:

```bash
npm run build
```

Then connect the repository in Vercel and deploy. No environment variables are required for the current local MVP.

## Future Plan

See [ROADMAP.md](./ROADMAP.md).
