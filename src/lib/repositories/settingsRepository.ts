import {
  clearWorkspace,
  loadWorkspace,
  replaceWorkspaceFromJson,
  resetWorkspace,
  saveWorkspace
} from "@/lib/storage/workspaceStorage"
import { nowIso } from "@/lib/utils/date"
import type { WorkspaceData } from "@/types/models"

export const settingsRepository = {
  exportJson(): string {
    const data = loadWorkspace()
    const updated = saveWorkspace({
      ...data,
      settings: { ...data.settings, lastExportAt: nowIso(), updatedAt: nowIso() }
    })
    return JSON.stringify(updated, null, 2)
  },
  importJson(text: string): WorkspaceData | null {
    return replaceWorkspaceFromJson(text)
  },
  resetSamples(): WorkspaceData {
    return resetWorkspace()
  },
  clearAll(): WorkspaceData {
    return clearWorkspace()
  }
}
