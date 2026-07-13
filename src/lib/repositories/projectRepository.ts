import { activityRepository } from "@/lib/repositories/activityRepository"
import { loadWorkspace, saveWorkspace } from "@/lib/storage/workspaceStorage"
import { makeId, nowIso } from "@/lib/utils/date"
import type { AITeamMember, NextStep, Project, ProjectRule, ProjectStatus } from "@/types/models"

export type ProjectInput = {
  readonly title: string
  readonly summary: string
  readonly description: string
  readonly category: string
  readonly status: ProjectStatus
  readonly progress: number
  readonly goal: string
  readonly audience: string
  readonly problem: string
  readonly currentState: string
  readonly features: readonly string[]
  readonly techStack: readonly string[]
  readonly constraints: readonly string[]
  readonly completionCriteria: readonly string[]
  readonly githubUrl: string
  readonly deploymentUrl: string
}

function emptyProject(input: ProjectInput): Project {
  const timestamp = nowIso()
  return {
    id: makeId("project"),
    title: input.title,
    summary: input.summary,
    description: input.description,
    category: input.category,
    status: input.status,
    progress: input.progress,
    goal: input.goal,
    audience: input.audience,
    problem: input.problem,
    currentState: input.currentState,
    features: input.features,
    techStack: input.techStack,
    constraints: input.constraints,
    completionCriteria: input.completionCriteria,
    nextSteps: [],
    aiTeam: [],
    workflowIds: [],
    promptIds: [],
    knowledgeIds: [],
    assetIds: [],
    rules: [],
    links: {
      github: input.githubUrl.length > 0 ? input.githubUrl : undefined,
      deployment: input.deploymentUrl.length > 0 ? input.deploymentUrl : undefined
    },
    isFavorite: false,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

export const projectRepository = {
  list(): readonly Project[] {
    return loadWorkspace().projects
  },
  create(input: ProjectInput): Project {
    const workspace = loadWorkspace()
    const project = emptyProject(input)
    saveWorkspace({ ...workspace, projects: [project, ...workspace.projects] })
    activityRepository.add({
      type: "created",
      title: "프로젝트 생성",
      description: `${project.title} 프로젝트를 만들었습니다.`,
      entityKind: "project",
      entityId: project.id,
      projectId: project.id
    })
    return project
  },
  update(id: string, input: ProjectInput): Project | null {
    const workspace = loadWorkspace()
    const current = workspace.projects.find((project) => project.id === id)
    if (current === undefined) {
      return null
    }
    const updated: Project = {
      ...current,
      ...input,
      links: {
        ...current.links,
        github: input.githubUrl.length > 0 ? input.githubUrl : undefined,
        deployment: input.deploymentUrl.length > 0 ? input.deploymentUrl : undefined
      },
      updatedAt: nowIso()
    }
    saveWorkspace({
      ...workspace,
      projects: workspace.projects.map((project) => (project.id === id ? updated : project))
    })
    activityRepository.add({
      type: "updated",
      title: "프로젝트 수정",
      description: `${updated.title} 프로젝트 정보를 수정했습니다.`,
      entityKind: "project",
      entityId: updated.id,
      projectId: updated.id
    })
    return updated
  },
  delete(id: string): void {
    const workspace = loadWorkspace()
    const target = workspace.projects.find((project) => project.id === id)
    saveWorkspace({ ...workspace, projects: workspace.projects.filter((project) => project.id !== id) })
    if (target !== undefined) {
      activityRepository.add({
        type: "deleted",
        title: "프로젝트 삭제",
        description: `${target.title} 프로젝트를 삭제했습니다.`,
        entityKind: "project",
        entityId: id
      })
    }
  },
  toggleFavorite(id: string): void {
    const workspace = loadWorkspace()
    saveWorkspace({
      ...workspace,
      projects: workspace.projects.map((project) =>
        project.id === id ? { ...project, isFavorite: !project.isFavorite, updatedAt: nowIso() } : project
      )
    })
  },
  addNextStep(projectId: string, title: string): void {
    const workspace = loadWorkspace()
    const timestamp = nowIso()
    const step: NextStep = {
      id: makeId("step"),
      title,
      priority: "medium",
      isDone: false,
      note: "",
      createdAt: timestamp,
      updatedAt: timestamp
    }
    saveWorkspace({
      ...workspace,
      projects: workspace.projects.map((project) =>
        project.id === projectId
          ? { ...project, nextSteps: [...project.nextSteps, step], updatedAt: timestamp }
          : project
      )
    })
  },
  toggleNextStep(projectId: string, stepId: string): void {
    const workspace = loadWorkspace()
    const timestamp = nowIso()
    saveWorkspace({
      ...workspace,
      projects: workspace.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              nextSteps: project.nextSteps.map((step) =>
                step.id === stepId ? { ...step, isDone: !step.isDone, updatedAt: timestamp } : step
              ),
              updatedAt: timestamp
            }
          : project
      )
    })
    activityRepository.add({
      type: "next_step_completed",
      title: "다음 작업 상태 변경",
      description: "프로젝트의 다음 작업 체크 상태를 변경했습니다.",
      entityKind: "project",
      entityId: projectId,
      projectId
    })
  },
  deleteNextStep(projectId: string, stepId: string): void {
    const workspace = loadWorkspace()
    saveWorkspace({
      ...workspace,
      projects: workspace.projects.map((project) =>
        project.id === projectId
          ? { ...project, nextSteps: project.nextSteps.filter((step) => step.id !== stepId), updatedAt: nowIso() }
          : project
      )
    })
  },
  addAiMember(projectId: string, name: string, role: string, responsibilities: readonly string[]): void {
    const workspace = loadWorkspace()
    const timestamp = nowIso()
    const member: AITeamMember = {
      id: makeId("ai"),
      name,
      role,
      responsibilities,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    saveWorkspace({
      ...workspace,
      projects: workspace.projects.map((project) =>
        project.id === projectId ? { ...project, aiTeam: [...project.aiTeam, member], updatedAt: timestamp } : project
      )
    })
  },
  addRule(projectId: string, title: string, description: string, category: string): void {
    const workspace = loadWorkspace()
    const timestamp = nowIso()
    const rule: ProjectRule = {
      id: makeId("rule"),
      title,
      description,
      category,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    saveWorkspace({
      ...workspace,
      projects: workspace.projects.map((project) =>
        project.id === projectId ? { ...project, rules: [...project.rules, rule], updatedAt: timestamp } : project
      )
    })
  }
}
