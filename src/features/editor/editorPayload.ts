import { splitList } from "@/lib/utils/text"
import type { EditorMode } from "@/features/app/types"
import type { Asset, KnowledgeItem, Project } from "@/types/models"
import type {
  AssetFormValues,
  DocumentFormValues,
  KnowledgeFormValues,
  ProjectFormValues,
  PromptFormValues,
  SubmitPayload,
  WorkflowFormValues
} from "./editorTypes"

export function payloadFromForm(mode: EditorMode, formData: FormData): SubmitPayload {
  switch (mode.kind) {
    case "project":
      return { kind: "project", id: mode.id, values: projectValues(formData) }
    case "prompt":
      return { kind: "prompt", id: mode.id, values: promptValues(formData) }
    case "workflow":
      return { kind: "workflow", id: mode.id, values: workflowValues(formData) }
    case "knowledge":
      return { kind: "knowledge", id: mode.id, values: knowledgeValues(formData) }
    case "asset":
      return { kind: "asset", id: mode.id, values: assetValues(formData) }
    case "document":
      return {
        kind: "document",
        projectId: mode.projectId,
        id: mode.id,
        values: documentValues(formData)
      }
    case "nextStep":
      return { kind: "nextStep", projectId: mode.projectId, title: textValue(formData, "title") }
    case "aiTeam":
      return {
        kind: "aiTeam",
        projectId: mode.projectId,
        name: textValue(formData, "name"),
        role: textValue(formData, "role"),
        responsibilities: splitList(textValue(formData, "responsibilities"))
      }
    case "rule":
      return {
        kind: "rule",
        projectId: mode.projectId,
        title: textValue(formData, "title"),
        category: textValue(formData, "category"),
        description: textValue(formData, "description")
      }
  }
}

function textValue(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function projectValues(formData: FormData): ProjectFormValues {
  return {
    title: textValue(formData, "title"),
    summary: textValue(formData, "summary"),
    description: textValue(formData, "description"),
    category: textValue(formData, "category"),
    status: readProjectStatus(textValue(formData, "status")),
    progress: Math.min(100, Math.max(0, Number(textValue(formData, "progress")))),
    goal: textValue(formData, "goal"),
    audience: textValue(formData, "audience"),
    problem: textValue(formData, "problem"),
    currentState: textValue(formData, "currentState"),
    features: splitList(textValue(formData, "features")),
    techStack: splitList(textValue(formData, "techStack")),
    constraints: splitList(textValue(formData, "constraints")),
    completionCriteria: splitList(textValue(formData, "completionCriteria")),
    githubUrl: textValue(formData, "githubUrl"),
    deploymentUrl: textValue(formData, "deploymentUrl")
  }
}

function promptValues(formData: FormData): PromptFormValues {
  return {
    title: textValue(formData, "title"),
    summary: textValue(formData, "summary"),
    purpose: textValue(formData, "purpose"),
    body: textValue(formData, "body"),
    inputs: textValue(formData, "inputs"),
    outputFormat: textValue(formData, "outputFormat"),
    cautions: textValue(formData, "cautions"),
    category: textValue(formData, "category"),
    recommendedAi: textValue(formData, "recommendedAi"),
    projectIds: splitList(textValue(formData, "projectIds")),
    tags: splitList(textValue(formData, "tags"))
  }
}

function workflowValues(formData: FormData): WorkflowFormValues {
  return {
    title: textValue(formData, "title"),
    summary: textValue(formData, "summary"),
    category: textValue(formData, "category"),
    projectIds: splitList(textValue(formData, "projectIds"))
  }
}

function knowledgeValues(formData: FormData): KnowledgeFormValues {
  return {
    title: textValue(formData, "title"),
    type: readKnowledgeType(textValue(formData, "type")),
    summary: textValue(formData, "summary"),
    content: textValue(formData, "content"),
    projectIds: splitList(textValue(formData, "projectIds")),
    tags: splitList(textValue(formData, "tags")),
    referenceUrl: textValue(formData, "referenceUrl")
  }
}

function assetValues(formData: FormData): AssetFormValues {
  return {
    title: textValue(formData, "title"),
    type: readAssetType(textValue(formData, "type")),
    url: textValue(formData, "url"),
    previewUrl: textValue(formData, "previewUrl"),
    description: textValue(formData, "description"),
    projectIds: splitList(textValue(formData, "projectIds")),
    tags: splitList(textValue(formData, "tags"))
  }
}

function documentValues(formData: FormData): DocumentFormValues {
  return {
    title: textValue(formData, "title"),
    fileName: textValue(formData, "fileName"),
    documentType: readDocumentType(textValue(formData, "documentType")),
    purpose: textValue(formData, "purpose"),
    content: textValue(formData, "content"),
    version: textValue(formData, "version") || "1.0.0",
    includeInAiContext: formData.get("includeInAiContext") === "on"
  }
}

function readProjectStatus(value: string): Project["status"] {
  switch (value) {
    case "idea":
    case "active":
    case "paused":
    case "completed":
    case "archived":
      return value
    default:
      return "active"
  }
}

function readKnowledgeType(value: string): KnowledgeItem["type"] {
  switch (value) {
    case "decision":
    case "lesson":
    case "error":
    case "tip":
    case "reference":
    case "snippet":
    case "note":
      return value
    default:
      return "note"
  }
}

function readAssetType(value: string): Asset["type"] {
  switch (value) {
    case "image":
    case "document":
    case "pdf":
    case "brand":
    case "character":
    case "reference":
    case "code":
    case "link":
      return value
    default:
      return "link"
  }
}

function readDocumentType(value: string): DocumentFormValues["documentType"] {
  switch (value) {
    case "README":
    case "PROJECT":
    case "ARCHITECTURE":
    case "CODEX":
    case "NEXT":
    case "SECURITY":
    case "DATA_MODEL":
    case "ROADMAP":
    case "CUSTOM":
      return value
    default:
      return "CUSTOM"
  }
}
