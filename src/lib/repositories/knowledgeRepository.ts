import { loadWorkspace, saveWorkspace } from "@/lib/storage/workspaceStorage"
import { makeId, nowIso } from "@/lib/utils/date"
import type { KnowledgeItem, KnowledgeType } from "@/types/models"

export type KnowledgeInput = {
  readonly title: string
  readonly type: KnowledgeType
  readonly summary: string
  readonly content: string
  readonly projectIds: readonly string[]
  readonly tags: readonly string[]
  readonly referenceUrl: string
}

export const knowledgeRepository = {
  list(): readonly KnowledgeItem[] {
    return loadWorkspace().knowledge
  },
  create(input: KnowledgeInput): KnowledgeItem {
    const workspace = loadWorkspace()
    const timestamp = nowIso()
    const item: KnowledgeItem = {
      ...input,
      id: makeId("knowledge"),
      promptIds: [],
      workflowIds: [],
      referenceUrl: input.referenceUrl.length > 0 ? input.referenceUrl : undefined,
      isFavorite: false,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    saveWorkspace({ ...workspace, knowledge: [item, ...workspace.knowledge] })
    return item
  },
  update(id: string, input: KnowledgeInput): KnowledgeItem | null {
    const workspace = loadWorkspace()
    const current = workspace.knowledge.find((item) => item.id === id)
    if (current === undefined) {
      return null
    }
    const updated: KnowledgeItem = {
      ...current,
      ...input,
      referenceUrl: input.referenceUrl.length > 0 ? input.referenceUrl : undefined,
      updatedAt: nowIso()
    }
    saveWorkspace({
      ...workspace,
      knowledge: workspace.knowledge.map((item) => (item.id === id ? updated : item))
    })
    return updated
  },
  delete(id: string): void {
    const workspace = loadWorkspace()
    saveWorkspace({ ...workspace, knowledge: workspace.knowledge.filter((item) => item.id !== id) })
  },
  toggleFavorite(id: string): void {
    const workspace = loadWorkspace()
    saveWorkspace({
      ...workspace,
      knowledge: workspace.knowledge.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite, updatedAt: nowIso() } : item
      )
    })
  }
}
