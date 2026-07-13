# Data Model

## Common Fields

Every stored entity has:

- `id`
- `createdAt`
- `updatedAt`

## WorkspaceData

```ts
type WorkspaceData = {
  projects: Project[]
  prompts: Prompt[]
  workflows: Workflow[]
  knowledge: KnowledgeItem[]
  assets: Asset[]
  activities: Activity[]
  settings: AppSettings
}
```

## Key Types

- `Project`: project context, status, progress, links, next steps, AI team, rules, and connected entity IDs.
- `Prompt`: reusable prompt with purpose, body, input guidance, output format, recommended AI, tags, version, use count, and favorites.
- `Workflow`: reusable ordered work template with `WorkflowStep[]`.
- `KnowledgeItem`: notes, decisions, lessons, errors, tips, references, and snippets.
- `Asset`: URL-based asset records for images, documents, PDFs, links, brand assets, characters, references, and code.
- `Activity`: simple event log for create, update, prompt use, next step completion, workflow progress, and deletion.
- `AppSettings`: user name, storage version, and export metadata.

## localStorage Key

```text
harness-studio.workspace.v1
```

## Repositories

- `projectRepository`
- `promptRepository`
- `workflowRepository`
- `knowledgeRepository`
- `assetRepository`
- `activityRepository`
- `settingsRepository`

All storage access is contained in `src/lib/storage/workspaceStorage.ts`.

## Future Supabase Mapping

The current object arrays can map to tables:

- `projects`
- `prompts`
- `workflows`
- `workflow_steps`
- `knowledge_items`
- `assets`
- `activities`
- `project_links`
- `project_rules`
- `project_next_steps`
- `project_ai_team_members`

Join tables can replace the current ID arrays when cloud sync is introduced.
