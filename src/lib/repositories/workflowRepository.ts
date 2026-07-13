import { activityRepository } from "@/lib/repositories/activityRepository"
import { loadWorkspace, saveWorkspace } from "@/lib/storage/workspaceStorage"
import { makeId, nowIso } from "@/lib/utils/date"
import type { Workflow, WorkflowStep } from "@/types/models"

export type WorkflowInput = {
  readonly title: string
  readonly summary: string
  readonly category: string
  readonly projectIds: readonly string[]
}

function defaultStep(): WorkflowStep {
  const timestamp = nowIso()
  return {
    id: makeId("workflow-step"),
    title: "첫 단계",
    description: "이 워크플로에서 가장 먼저 할 일을 적어주세요.",
    recommendedTool: "ChatGPT",
    checklist: ["목표 확인"],
    isDone: false,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

export const workflowRepository = {
  list(): readonly Workflow[] {
    return loadWorkspace().workflows
  },
  create(input: WorkflowInput): Workflow {
    const workspace = loadWorkspace()
    const timestamp = nowIso()
    const workflow: Workflow = {
      ...input,
      id: makeId("workflow"),
      steps: [defaultStep()],
      isFavorite: false,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    saveWorkspace({ ...workspace, workflows: [workflow, ...workspace.workflows] })
    return workflow
  },
  update(id: string, input: WorkflowInput): Workflow | null {
    const workspace = loadWorkspace()
    const current = workspace.workflows.find((workflow) => workflow.id === id)
    if (current === undefined) {
      return null
    }
    const updated: Workflow = { ...current, ...input, updatedAt: nowIso() }
    saveWorkspace({
      ...workspace,
      workflows: workspace.workflows.map((workflow) => (workflow.id === id ? updated : workflow))
    })
    return updated
  },
  delete(id: string): void {
    const workspace = loadWorkspace()
    saveWorkspace({ ...workspace, workflows: workspace.workflows.filter((workflow) => workflow.id !== id) })
  },
  duplicate(id: string): Workflow | null {
    const workspace = loadWorkspace()
    const current = workspace.workflows.find((workflow) => workflow.id === id)
    if (current === undefined) {
      return null
    }
    const timestamp = nowIso()
    const duplicated: Workflow = {
      ...current,
      id: makeId("workflow"),
      title: `${current.title} 복제본`,
      steps: current.steps.map((step) => ({
        ...step,
        id: makeId("workflow-step"),
        isDone: false,
        createdAt: timestamp,
        updatedAt: timestamp
      })),
      createdAt: timestamp,
      updatedAt: timestamp
    }
    saveWorkspace({ ...workspace, workflows: [duplicated, ...workspace.workflows] })
    return duplicated
  },
  toggleFavorite(id: string): void {
    const workspace = loadWorkspace()
    saveWorkspace({
      ...workspace,
      workflows: workspace.workflows.map((workflow) =>
        workflow.id === id ? { ...workflow, isFavorite: !workflow.isFavorite, updatedAt: nowIso() } : workflow
      )
    })
  },
  toggleStep(workflowId: string, stepId: string): void {
    const workspace = loadWorkspace()
    const timestamp = nowIso()
    saveWorkspace({
      ...workspace,
      workflows: workspace.workflows.map((workflow) =>
        workflow.id === workflowId
          ? {
              ...workflow,
              steps: workflow.steps.map((step) =>
                step.id === stepId ? { ...step, isDone: !step.isDone, updatedAt: timestamp } : step
              ),
              lastUsedAt: timestamp,
              updatedAt: timestamp
            }
          : workflow
      )
    })
    activityRepository.add({
      type: "workflow_advanced",
      title: "워크플로 진행",
      description: "워크플로 단계 상태를 변경했습니다.",
      entityKind: "workflow",
      entityId: workflowId
    })
  }
}
