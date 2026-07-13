import { seedWorkspaceData } from "@/data/seed/workspaceSeed"
import type { Project, WorkspaceData } from "@/types/models"
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

  const parsed = parseWorkspaceJson(raw)
  if (parsed === null) {
    return seedWorkspaceData
  }
  return normalizeWorkspace(parsed)
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

function normalizeWorkspace(data: WorkspaceData): WorkspaceData {
  return {
    ...data,
    projects: data.projects.map((project) => normalizeProject(project))
  }
}

function normalizeProject(project: Project): Project {
  return {
    ...project,
    docs: project.docs ?? []
  }
}
