import type { Asset, DocumentType, KnowledgeItem, Project, Prompt, Workflow } from "@/types/models"

export type ProjectFormValues = {
  readonly title: string
  readonly summary: string
  readonly description: string
  readonly category: string
  readonly status: Project["status"]
  readonly progress: number
  readonly goal: string
  readonly audience: string
  readonly problem: string
  readonly currentState: string
  readonly features: readonly string[]
  readonly techStack: readonly string[]
  readonly constraints: readonly string[]
  readonly completionCriteria: readonly string[]
  readonly githubUrl: string
  readonly deploymentUrl: string
}

export type PromptFormValues = {
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
}

export type WorkflowFormValues = {
  readonly title: string
  readonly summary: string
  readonly category: string
  readonly projectIds: readonly string[]
}

export type KnowledgeFormValues = {
  readonly title: string
  readonly type: KnowledgeItem["type"]
  readonly summary: string
  readonly content: string
  readonly projectIds: readonly string[]
  readonly tags: readonly string[]
  readonly referenceUrl: string
}

export type AssetFormValues = {
  readonly title: string
  readonly type: Asset["type"]
  readonly url: string
  readonly previewUrl: string
  readonly description: string
  readonly projectIds: readonly string[]
  readonly tags: readonly string[]
}

export type DocumentFormValues = {
  readonly title: string
  readonly fileName: string
  readonly documentType: DocumentType
  readonly purpose: string
  readonly content: string
  readonly version: string
  readonly includeInAiContext: boolean
}

export type SubmitPayload =
  | { readonly kind: "project"; readonly values: ProjectFormValues; readonly id: string | undefined }
  | { readonly kind: "prompt"; readonly values: PromptFormValues; readonly id: string | undefined }
  | { readonly kind: "workflow"; readonly values: WorkflowFormValues; readonly id: string | undefined }
  | { readonly kind: "knowledge"; readonly values: KnowledgeFormValues; readonly id: string | undefined }
  | { readonly kind: "asset"; readonly values: AssetFormValues; readonly id: string | undefined }
  | {
      readonly kind: "document"
      readonly projectId: string
      readonly id: string | undefined
      readonly values: DocumentFormValues
    }
  | { readonly kind: "nextStep"; readonly projectId: string; readonly title: string }
  | {
      readonly kind: "aiTeam"
      readonly projectId: string
      readonly name: string
      readonly role: string
      readonly responsibilities: readonly string[]
    }
  | { readonly kind: "rule"; readonly projectId: string; readonly title: string; readonly description: string; readonly category: string }

export type EditorDefaults = {
  readonly project: Project | undefined
  readonly prompt: Prompt | undefined
  readonly workflow: Workflow | undefined
  readonly knowledge: KnowledgeItem | undefined
  readonly asset: Asset | undefined
  readonly document: Project["docs"][number] | undefined
}
