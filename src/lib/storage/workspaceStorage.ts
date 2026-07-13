import { seedWorkspaceData } from "@/data/seed/workspaceSeed"
import type { WorkspaceData } from "@/types/models"
import { parseWorkspaceJson } from "./validation"

export const WORKSPACE_STORAGE_KEY = "harness-studio.workspace.v1"

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

export function loadWorkspace(): WorkspaceData {
  if (!canUseStorage()) {
    return seedWorkspaceData
  }

  const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY)
  if (raw === null) {
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(seedWorkspaceData))
    return seedWorkspaceData
  }

  return parseWorkspaceJson(raw) ?? seedWorkspaceData
}

export function saveWorkspace(data: WorkspaceData): WorkspaceData {
  if (canUseStorage()) {
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(data))
  }
  return data
}

export function replaceWorkspaceFromJson(text: string): WorkspaceData | null {
  const parsed = parseWorkspaceJson(text)
  if (parsed === null) {
    return null
  }
  return saveWorkspace(parsed)
}

export function resetWorkspace(): WorkspaceData {
  return saveWorkspace(seedWorkspaceData)
}

export function clearWorkspace(): WorkspaceData {
  return saveWorkspace({
    ...seedWorkspaceData,
    projects: [],
    prompts: [],
    workflows: [],
    knowledge: [],
    assets: [],
    activities: []
  })
}
