export type EntityKind = "project" | "prompt" | "workflow" | "knowledge" | "asset" | "document"

export type ProjectStatus = "idea" | "active" | "paused" | "completed" | "archived"
export type Priority = "low" | "medium" | "high"
export type DocumentType = "README" | "PROJECT" | "ARCHITECTURE" | "CODEX" | "NEXT" | "SECURITY" | "DATA_MODEL" | "ROADMAP" | "CUSTOM"
export type KnowledgeType = "note" | "decision" | "lesson" | "error" | "tip" | "reference" | "snippet"
export type AssetType = "image" | "document" | "pdf" | "link" | "brand" | "character" | "reference" | "code"
export type ActivityType =
  | "created"
  | "updated"
  | "prompt_used"
  | "next_step_completed"
  | "workflow_advanced"
  | "deleted"

export type BaseEntity = {
  readonly id: string
  readonly createdAt: string
  readonly updatedAt: string
}

export type ProjectLinks = {
  readonly homepage?: string | undefined
  readonly github?: string | undefined
  readonly deployment?: string | undefined
  readonly reference?: string | undefined
}

export type NextStep = BaseEntity & {
  readonly title: string
  readonly priority: Priority
  readonly isDone: boolean
  readonly dueDate?: string | undefined
  readonly note: string
}

export type AITeamMember = BaseEntity & {
  readonly name: string
  readonly role: string
  readonly responsibilities: readonly string[]
}

export type ProjectRule = BaseEntity & {
  readonly title: string
  readonly description: string
  readonly category: string
}

export type ProjectDocument = BaseEntity & {
  readonly title: string
  readonly fileName: string
  readonly documentType: DocumentType
  readonly purpose: string
  readonly content: string
  readonly version: string
  readonly includeInAiContext: boolean
}

export type Project = BaseEntity & {
  readonly title: string
  readonly summary: string
  readonly description: string
  readonly category: string
  readonly status: ProjectStatus
  readonly progress: number
  readonly goal: string
  readonly audience: string
  readonly problem: string
  readonly currentState: string
  readonly features: readonly string[]
  readonly techStack: readonly string[]
  readonly constraints: readonly string[]
  readonly completionCriteria: readonly string[]
  readonly nextSteps: readonly NextStep[]
  readonly aiTeam: readonly AITeamMember[]
  readonly workflowIds: readonly string[]
  readonly promptIds: readonly string[]
  readonly knowledgeIds: readonly string[]
  readonly assetIds: readonly string[]
  readonly rules: readonly ProjectRule[]
  readonly docs: readonly ProjectDocument[]
  readonly links: ProjectLinks
  readonly isFavorite: boolean
}

export type Prompt = BaseEntity & {
  readonly title: string
  readonly summary: string
  readonly purpose: string
  readonly body: string
  readonly inputs: string
  readonly outputFormat: string
  readonly cautions: string
  readonly category: string
  readonly recommendedAi: string
  readonly projectIds: readonly string[]
  readonly tags: readonly string[]
  readonly version: string
  readonly useCount: number
  readonly isFavorite: boolean
}

export type WorkflowStep = BaseEntity & {
  readonly title: string
  readonly description: string
  readonly recommendedTool: string
  readonly promptId?: string | undefined
  readonly checklist: readonly string[]
  readonly isDone: boolean
}

export type Workflow = BaseEntity & {
  readonly title: string
  readonly summary: string
  readonly category: string
  readonly projectIds: readonly string[]
  readonly steps: readonly WorkflowStep[]
  readonly lastUsedAt?: string | undefined
  readonly isFavorite: boolean
}

export type KnowledgeItem = BaseEntity & {
  readonly title: string
  readonly type: KnowledgeType
  readonly summary: string
  readonly content: string
  readonly projectIds: readonly string[]
  readonly promptIds: readonly string[]
  readonly workflowIds: readonly string[]
  readonly tags: readonly string[]
  readonly referenceUrl?: string | undefined
  readonly isFavorite: boolean
}

export type Asset = BaseEntity & {
  readonly title: string
  readonly type: AssetType
  readonly url: string
  readonly previewUrl: string
  readonly description: string
  readonly projectIds: readonly string[]
  readonly tags: readonly string[]
  readonly isFavorite: boolean
}

export type Activity = BaseEntity & {
  readonly type: ActivityType
  readonly title: string
  readonly description: string
  readonly entityKind: EntityKind
  readonly entityId: string
  readonly projectId?: string | undefined
}

export type AppSettings = BaseEntity & {
  readonly userName: string
  readonly storageVersion: number
  readonly lastExportAt?: string | undefined
}

export type WorkspaceData = {
  readonly projects: readonly Project[]
  readonly prompts: readonly Prompt[]
  readonly workflows: readonly Workflow[]
  readonly knowledge: readonly KnowledgeItem[]
  readonly assets: readonly Asset[]
  readonly activities: readonly Activity[]
  readonly settings: AppSettings
}

export type EditableKind = EntityKind | "nextStep" | "aiTeam" | "rule"
