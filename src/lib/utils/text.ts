import type { Asset, KnowledgeItem, Project, Prompt, Workflow } from "@/types/models"

export function splitList(value: string): readonly string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

export function includesText(source: string, query: string): boolean {
  return source.toLocaleLowerCase("ko-KR").includes(query.toLocaleLowerCase("ko-KR"))
}

export function projectSearchText(project: Project): string {
  return [
    project.title,
    project.summary,
    project.description,
    project.category,
    project.status,
    project.goal,
    project.aiTeam.map((member) => `${member.name} ${member.role}`).join(" "),
    project.features.join(" "),
    project.techStack.join(" ")
  ].join(" ")
}

export function promptSearchText(prompt: Prompt): string {
  return [
    prompt.title,
    prompt.summary,
    prompt.purpose,
    prompt.body,
    prompt.category,
    prompt.recommendedAi,
    prompt.tags.join(" ")
  ].join(" ")
}

export function workflowSearchText(workflow: Workflow): string {
  return [
    workflow.title,
    workflow.summary,
    workflow.category,
    workflow.steps.map((step) => `${step.title} ${step.description} ${step.recommendedTool}`).join(" ")
  ].join(" ")
}

export function knowledgeSearchText(item: KnowledgeItem): string {
  return [item.title, item.summary, item.content, item.type, item.tags.join(" ")].join(" ")
}

export function assetSearchText(asset: Asset): string {
  return [asset.title, asset.description, asset.type, asset.url, asset.tags.join(" ")].join(" ")
}
