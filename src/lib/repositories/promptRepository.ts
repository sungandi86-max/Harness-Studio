import { activityRepository } from "@/lib/repositories/activityRepository"
import { loadWorkspace, saveWorkspace } from "@/lib/storage/workspaceStorage"
import { makeId, nowIso } from "@/lib/utils/date"
import type { Prompt } from "@/types/models"

export type PromptInput = {
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

function createPrompt(input: PromptInput): Prompt {
  const timestamp = nowIso()
  return {
    ...input,
    id: makeId("prompt"),
    version: "1.0.0",
    useCount: 0,
    isFavorite: false,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

export const promptRepository = {
  list(): readonly Prompt[] {
    return loadWorkspace().prompts
  },
  create(input: PromptInput): Prompt {
    const workspace = loadWorkspace()
    const prompt = createPrompt(input)
    saveWorkspace({ ...workspace, prompts: [prompt, ...workspace.prompts] })
    activityRepository.add({
      type: "created",
      title: "프롬프트 생성",
      description: `${prompt.title} 프롬프트를 만들었습니다.`,
      entityKind: "prompt",
      entityId: prompt.id
    })
    return prompt
  },
  update(id: string, input: PromptInput): Prompt | null {
    const workspace = loadWorkspace()
    const current = workspace.prompts.find((prompt) => prompt.id === id)
    if (current === undefined) {
      return null
    }
    const updated: Prompt = { ...current, ...input, updatedAt: nowIso() }
    saveWorkspace({
      ...workspace,
      prompts: workspace.prompts.map((prompt) => (prompt.id === id ? updated : prompt))
    })
    return updated
  },
  delete(id: string): void {
    const workspace = loadWorkspace()
    saveWorkspace({ ...workspace, prompts: workspace.prompts.filter((prompt) => prompt.id !== id) })
  },
  duplicate(id: string): Prompt | null {
    const workspace = loadWorkspace()
    const current = workspace.prompts.find((prompt) => prompt.id === id)
    if (current === undefined) {
      return null
    }
    const timestamp = nowIso()
    const duplicated: Prompt = {
      ...current,
      id: makeId("prompt"),
      title: `${current.title} 복제본`,
      useCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    saveWorkspace({ ...workspace, prompts: [duplicated, ...workspace.prompts] })
    return duplicated
  },
  toggleFavorite(id: string): void {
    const workspace = loadWorkspace()
    saveWorkspace({
      ...workspace,
      prompts: workspace.prompts.map((prompt) =>
        prompt.id === id ? { ...prompt, isFavorite: !prompt.isFavorite, updatedAt: nowIso() } : prompt
      )
    })
  },
  markUsed(id: string): void {
    const workspace = loadWorkspace()
    saveWorkspace({
      ...workspace,
      prompts: workspace.prompts.map((prompt) =>
        prompt.id === id ? { ...prompt, useCount: prompt.useCount + 1, updatedAt: nowIso() } : prompt
      )
    })
    activityRepository.add({
      type: "prompt_used",
      title: "프롬프트 사용",
      description: "프롬프트 사용 횟수를 기록했습니다.",
      entityKind: "prompt",
      entityId: id
    })
  }
}
