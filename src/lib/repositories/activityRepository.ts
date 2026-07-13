import { loadWorkspace, saveWorkspace } from "@/lib/storage/workspaceStorage"
import { makeId, nowIso } from "@/lib/utils/date"
import type { Activity, ActivityType, EntityKind } from "@/types/models"

type ActivityInput = {
  readonly type: ActivityType
  readonly title: string
  readonly description: string
  readonly entityKind: EntityKind
  readonly entityId: string
  readonly projectId?: string
}

export const activityRepository = {
  list(): readonly Activity[] {
    return loadWorkspace().activities
  },
  add(input: ActivityInput): Activity {
    const workspace = loadWorkspace()
    const timestamp = nowIso()
    const activity: Activity = {
      ...input,
      id: makeId("activity"),
      createdAt: timestamp,
      updatedAt: timestamp
    }
    saveWorkspace({ ...workspace, activities: [activity, ...workspace.activities].slice(0, 80) })
    return activity
  }
}
