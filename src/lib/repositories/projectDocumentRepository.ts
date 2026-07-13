import { activityRepository } from "@/lib/repositories/activityRepository"
import { loadWorkspace, saveWorkspace } from "@/lib/storage/workspaceStorage"
import { makeId, nowIso } from "@/lib/utils/date"
import type { DocumentType, ProjectDocument } from "@/types/models"

export type ProjectDocumentInput = {
  readonly title: string
  readonly fileName: string
  readonly documentType: DocumentType
  readonly purpose: string
  readonly content: string
  readonly version: string
  readonly includeInAiContext: boolean
}

export const projectDocumentRepository = {
  add(projectId: string, input: ProjectDocumentInput): void {
    const workspace = loadWorkspace()
    const timestamp = nowIso()
    const document: ProjectDocument = {
      ...input,
      id: makeId("doc"),
      createdAt: timestamp,
      updatedAt: timestamp
    }
    saveWorkspace({
      ...workspace,
      projects: workspace.projects.map((project) =>
        project.id === projectId ? { ...project, docs: [document, ...project.docs], updatedAt: timestamp } : project
      )
    })
    activityRepository.add({
      type: "created",
      title: "문서 생성",
      description: `${input.fileName} 문서를 만들었습니다.`,
      entityKind: "document",
      entityId: document.id,
      projectId
    })
  },
  update(projectId: string, documentId: string, input: ProjectDocumentInput): void {
    const workspace = loadWorkspace()
    const timestamp = nowIso()
    saveWorkspace({
      ...workspace,
      projects: workspace.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              docs: project.docs.map((document) =>
                document.id === documentId ? { ...document, ...input, updatedAt: timestamp } : document
              ),
              updatedAt: timestamp
            }
          : project
      )
    })
    activityRepository.add({
      type: "updated",
      title: "문서 수정",
      description: `${input.fileName} 문서를 수정했습니다.`,
      entityKind: "document",
      entityId: documentId,
      projectId
    })
  },
  delete(projectId: string, documentId: string): void {
    const workspace = loadWorkspace()
    saveWorkspace({
      ...workspace,
      projects: workspace.projects.map((project) =>
        project.id === projectId
          ? { ...project, docs: project.docs.filter((document) => document.id !== documentId), updatedAt: nowIso() }
          : project
      )
    })
  }
}
