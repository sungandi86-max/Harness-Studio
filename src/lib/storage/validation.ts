import type { WorkspaceData } from "@/types/models"

type JsonObject = { readonly [key: string]: unknown }

function isRecord(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function hasString(value: JsonObject, key: string): boolean {
  return typeof value[key] === "string"
}

function hasArray(value: JsonObject, key: string): boolean {
  return Array.isArray(value[key])
}

export function isWorkspaceData(value: unknown): value is WorkspaceData {
  if (!isRecord(value)) {
    return false
  }

  if (
    !hasArray(value, "projects") ||
    !hasArray(value, "prompts") ||
    !hasArray(value, "workflows") ||
    !hasArray(value, "knowledge") ||
    !hasArray(value, "assets") ||
    !hasArray(value, "activities")
  ) {
    return false
  }

  const settings = value["settings"]
  return isRecord(settings) && hasString(settings, "id") && hasString(settings, "userName")
}

export function parseWorkspaceJson(text: string): WorkspaceData | null {
  try {
    const parsed: unknown = JSON.parse(text)
    return isWorkspaceData(parsed) ? parsed : null
  } catch (error) {
    if (error instanceof SyntaxError) {
      return null
    }
    throw error
  }
}
