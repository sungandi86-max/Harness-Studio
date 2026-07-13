import { assetRepository } from "@/lib/repositories/assetRepository"
import { knowledgeRepository } from "@/lib/repositories/knowledgeRepository"
import { projectRepository } from "@/lib/repositories/projectRepository"
import { promptRepository } from "@/lib/repositories/promptRepository"
import { workflowRepository } from "@/lib/repositories/workflowRepository"
import type { SubmitPayload } from "@/features/editor/editorTypes"

export function savePayload(payload: SubmitPayload): boolean {
  if (!validatePayload(payload)) {
    return false
  }
  switch (payload.kind) {
    case "project":
      if (payload.id === undefined) projectRepository.create(payload.values)
      else projectRepository.update(payload.id, payload.values)
      return true
    case "prompt":
      if (payload.id === undefined) promptRepository.create(payload.values)
      else promptRepository.update(payload.id, payload.values)
      return true
    case "workflow":
      if (payload.id === undefined) workflowRepository.create(payload.values)
      else workflowRepository.update(payload.id, payload.values)
      return true
    case "knowledge":
      if (payload.id === undefined) knowledgeRepository.create(payload.values)
      else knowledgeRepository.update(payload.id, payload.values)
      return true
    case "asset":
      if (payload.id === undefined) assetRepository.create(payload.values)
      else assetRepository.update(payload.id, payload.values)
      return true
    case "nextStep":
      projectRepository.addNextStep(payload.projectId, payload.title)
      return true
    case "aiTeam":
      projectRepository.addAiMember(payload.projectId, payload.name, payload.role, payload.responsibilities)
      return true
    case "rule":
      projectRepository.addRule(payload.projectId, payload.title, payload.description, payload.category)
      return true
  }
}

export function validatePayload(payload: SubmitPayload): boolean {
  switch (payload.kind) {
    case "project":
    case "prompt":
    case "workflow":
    case "knowledge":
    case "asset":
      return payload.values.title.trim().length > 0 && urlFieldsAreValid(payload)
    case "nextStep":
      return payload.title.trim().length > 0
    case "aiTeam":
      return payload.name.trim().length > 0 && payload.role.trim().length > 0
    case "rule":
      return payload.title.trim().length > 0 && payload.description.trim().length > 0
  }
}

function urlFieldsAreValid(payload: SubmitPayload): boolean {
  if (payload.kind === "asset") {
    return isValidUrl(payload.values.url) && optionalUrlIsValid(payload.values.previewUrl)
  }
  if (payload.kind === "knowledge") {
    return optionalUrlIsValid(payload.values.referenceUrl)
  }
  if (payload.kind === "project") {
    return optionalUrlIsValid(payload.values.githubUrl) && optionalUrlIsValid(payload.values.deploymentUrl)
  }
  return true
}

function optionalUrlIsValid(value: string): boolean {
  return value.trim().length === 0 || isValidUrl(value)
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch (error) {
    if (error instanceof TypeError) {
      return false
    }
    throw error
  }
}
