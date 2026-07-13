"use client"

import { CheckCircle2, Copy, ExternalLink, Heart, Link as LinkIcon, Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, SectionTitle } from "@/components/ui/Card"
import { formatShortDate } from "@/lib/utils/date"
import type { EditorMode } from "@/features/app/types"
import type { Activity, Asset, KnowledgeItem, Project, Prompt, Workflow } from "@/types/models"
import { DocsPanel } from "./DocsPanel"
import { ProjectMiniCards } from "./ProjectMiniCards"

type DetailTab = "overview" | "next" | "team" | "workflow" | "prompts" | "knowledge" | "assets" | "docs" | "rules" | "activity"

const tabs: readonly { readonly id: DetailTab; readonly label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "next", label: "Next Steps" },
  { id: "team", label: "AI Team" },
  { id: "workflow", label: "Workflow" },
  { id: "prompts", label: "Prompts" },
  { id: "knowledge", label: "Knowledge" },
  { id: "assets", label: "Assets" },
  { id: "docs", label: "Docs" },
  { id: "rules", label: "Rules" },
  { id: "activity", label: "Activity" }
]

export function ProjectDetailView({
  project,
  prompts,
  workflows,
  knowledge,
  assets,
  activities,
  onEdit,
  onBack,
  onToggleFavorite,
  onCopyPrompt,
  onToggleStep,
  onToggleWorkflowStep,
  onDeleteStep,
  onDeleteDocument,
  onFeedback,
  initialTab
}: {
  readonly project: Project
  readonly prompts: readonly Prompt[]
  readonly workflows: readonly Workflow[]
  readonly knowledge: readonly KnowledgeItem[]
  readonly assets: readonly Asset[]
  readonly activities: readonly Activity[]
  readonly onEdit: (mode: EditorMode) => void
  readonly onBack: () => void
  readonly onToggleFavorite: (id: string) => void
  readonly onCopyPrompt: (prompt: Prompt) => void
  readonly onToggleStep: (projectId: string, stepId: string) => void
  readonly onToggleWorkflowStep: (workflowId: string, stepId: string) => void
  readonly onDeleteStep: (projectId: string, stepId: string) => void
  readonly onDeleteDocument: (projectId: string, documentId: string) => void
  readonly onFeedback: (message: string) => void
  readonly initialTab?: string | undefined
}) {
  const [tab, setTab] = useState<DetailTab>(readDetailTab(initialTab))
  const linkedPrompts = prompts.filter((prompt) => project.promptIds.includes(prompt.id) || prompt.projectIds.includes(project.id))
  const linkedWorkflows = workflows.filter((workflow) => project.workflowIds.includes(workflow.id) || workflow.projectIds.includes(project.id))
  const linkedKnowledge = knowledge.filter((item) => project.knowledgeIds.includes(item.id) || item.projectIds.includes(project.id))
  const linkedAssets = assets.filter((asset) => project.assetIds.includes(asset.id) || asset.projectIds.includes(project.id))
  const projectActivities = activities.filter((activity) => activity.projectId === project.id || activity.entityId === project.id)

  return (
    <div className="grid w-full max-w-[calc(100vw-2rem)] min-w-0 gap-5 overflow-x-hidden sm:max-w-full">
      <button type="button" onClick={onBack} className="w-fit rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-white/[0.06] hover:text-white">
        프로젝트 목록으로
      </button>
      <Card className="max-w-full overflow-hidden p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-mint-300/20 px-2 py-1 text-xs text-mint-300">{project.status}</span>
              <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-300">{project.category}</span>
            </div>
            <h1 className="text-3xl font-semibold leading-tight text-white">{project.title}</h1>
            <p className="mt-3 max-w-[300px] break-words text-sm leading-6 text-slate-300 sm:max-w-none">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => onToggleFavorite(project.id)}><Heart className="h-4 w-4" fill={project.isFavorite ? "currentColor" : "none"} />즐겨찾기</Button>
            <Button onClick={() => onEdit({ kind: "project", id: project.id })}><Pencil className="h-4 w-4" />수정</Button>
            {project.links.github ? <a href={project.links.github} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-3 text-sm text-slate-100 hover:bg-white/[0.085]"><LinkIcon className="h-4 w-4" />GitHub</a> : null}
            {project.links.deployment ? <a href={project.links.deployment} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-3 text-sm text-slate-100 hover:bg-white/[0.085]"><ExternalLink className="h-4 w-4" />배포</a> : null}
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-1 flex justify-between text-xs text-slate-400"><span>진행률</span><span>{project.progress}%</span></div>
          <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-mint-300" style={{ width: `${project.progress}%` }} /></div>
        </div>
      </Card>

      <div className="max-w-full min-w-0 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.035] p-1">
        <div className="flex min-w-max gap-1">
          {tabs.map((item) => (
            <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`rounded-lg px-3 py-2 text-sm transition ${tab === item.id ? "bg-white/[0.09] text-mint-300" : "text-slate-400 hover:bg-white/[0.05] hover:text-white"}`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" ? <Overview project={project} /> : null}
      {tab === "next" ? <NextSteps project={project} onAdd={() => onEdit({ kind: "nextStep", projectId: project.id })} onToggle={onToggleStep} onDelete={onDeleteStep} /> : null}
      {tab === "team" ? <AiTeam project={project} onAdd={() => onEdit({ kind: "aiTeam", projectId: project.id })} /> : null}
      {tab === "workflow" ? <WorkflowPanel workflows={linkedWorkflows} onToggleStep={onToggleWorkflowStep} /> : null}
      {tab === "prompts" ? <PromptPanel prompts={linkedPrompts} onCopy={onCopyPrompt} /> : null}
      {tab === "knowledge" ? <KnowledgePanel knowledge={linkedKnowledge} /> : null}
      {tab === "assets" ? <AssetPanel assets={linkedAssets} /> : null}
      {tab === "docs" ? <DocsPanel project={project} onEdit={onEdit} onDelete={onDeleteDocument} onFeedback={onFeedback} /> : null}
      {tab === "rules" ? <RulesPanel project={project} onAdd={() => onEdit({ kind: "rule", projectId: project.id })} /> : null}
      {tab === "activity" ? <ActivityPanel activities={projectActivities} /> : null}
    </div>
  )
}

function readDetailTab(value: string | undefined): DetailTab {
  switch (value) {
    case "overview":
    case "next":
    case "team":
    case "workflow":
    case "prompts":
    case "knowledge":
    case "assets":
    case "docs":
    case "rules":
    case "activity":
      return value
    default:
      return "overview"
  }
}

function Overview({ project }: { readonly project: Project }) {
  const groups = [
    ["목표", project.goal],
    ["대상 사용자", project.audience],
    ["해결하려는 문제", project.problem],
    ["현재 상태", project.currentState]
  ] as const
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      {groups.map(([label, value]) => <InfoBlock key={label} label={label} value={value} />)}
      <ListBlock title="핵심 기능" items={project.features} />
      <ListBlock title="기술 스택" items={project.techStack} />
      <ListBlock title="제약조건" items={project.constraints} />
      <ListBlock title="완료 조건" items={project.completionCriteria} />
    </div>
  )
}

function NextSteps({ project, onAdd, onToggle, onDelete }: { readonly project: Project; readonly onAdd: () => void; readonly onToggle: (projectId: string, stepId: string) => void; readonly onDelete: (projectId: string, stepId: string) => void }) {
  return (
    <Card className="p-4">
      <SectionTitle title="다음 작업" action={<Button variant="primary" onClick={onAdd}><Plus className="h-4 w-4" />추가</Button>} />
      <div className="grid gap-3">
        {project.nextSteps.map((step) => (
          <div key={step.id} className="flex items-start gap-3 rounded-xl bg-white/[0.035] p-3">
            <button type="button" onClick={() => onToggle(project.id, step.id)} aria-label="완료 상태 변경" className={step.isDone ? "text-mint-300" : "text-slate-500"}><CheckCircle2 className="h-5 w-5" /></button>
            <div className="min-w-0 flex-1">
              <p className={`font-semibold ${step.isDone ? "text-slate-500 line-through" : "text-white"}`}>{step.title}</p>
              <p className="text-xs text-slate-500">{step.priority}{step.dueDate ? ` · ${formatShortDate(step.dueDate)}` : ""}</p>
              {step.note ? <p className="mt-1 text-sm leading-6 text-slate-400">{step.note}</p> : null}
            </div>
            <button type="button" onClick={() => onDelete(project.id, step.id)} aria-label="다음 작업 삭제" className="rounded-lg p-2 text-slate-500 hover:bg-rose-400/10 hover:text-rose-200"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </Card>
  )
}

function AiTeam({ project, onAdd }: { readonly project: Project; readonly onAdd: () => void }) {
  return (
    <Card className="p-4">
      <SectionTitle title="AI Team" action={<Button variant="primary" onClick={onAdd}><Plus className="h-4 w-4" />역할 추가</Button>} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {project.aiTeam.map((member) => (
          <div key={member.id} className="rounded-xl bg-white/[0.035] p-4">
            <p className="font-semibold text-white">{member.name}</p>
            <p className="text-sm text-mint-300">{member.role}</p>
            <ul className="mt-3 grid gap-1 text-sm text-slate-400">
              {member.responsibilities.map((item) => <li key={item}>· {item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  )
}

function WorkflowPanel({ workflows, onToggleStep }: { readonly workflows: readonly Workflow[]; readonly onToggleStep: (workflowId: string, stepId: string) => void }) {
  return (
    <div className="grid gap-4">
      {workflows.map((workflow) => {
        const doneCount = workflow.steps.filter((step) => step.isDone).length
        return (
          <Card key={workflow.id} className="p-4">
            <SectionTitle title={workflow.title} subtitle={`${workflow.category} · ${doneCount}/${workflow.steps.length} 완료`} />
            <div className="grid gap-2">
              {workflow.steps.map((step) => (
                <button key={step.id} type="button" onClick={() => onToggleStep(workflow.id, step.id)} className="flex items-start gap-3 rounded-xl bg-white/[0.035] p-3 text-left hover:bg-white/[0.065]">
                  <CheckCircle2 className={`mt-0.5 h-5 w-5 ${step.isDone ? "text-mint-300" : "text-slate-500"}`} />
                  <span><span className="block font-semibold text-white">{step.title}</span><span className="text-sm leading-6 text-slate-400">{step.description}</span></span>
                </button>
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function PromptPanel({ prompts, onCopy }: { readonly prompts: readonly Prompt[]; readonly onCopy: (prompt: Prompt) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {prompts.map((prompt) => (
        <Card key={prompt.id} className="p-4">
          <p className="font-semibold text-white">{prompt.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{prompt.summary}</p>
          <Button className="mt-4" onClick={() => onCopy(prompt)}><Copy className="h-4 w-4" />전체 내용 복사</Button>
        </Card>
      ))}
    </div>
  )
}

function KnowledgePanel({ knowledge }: { readonly knowledge: readonly KnowledgeItem[] }) {
  return <ProjectMiniCards items={knowledge.map((item) => ({ id: item.id, title: item.title, meta: item.type, text: item.summary }))} />
}

function AssetPanel({ assets }: { readonly assets: readonly Asset[] }) {
  return <ProjectMiniCards items={assets.map((asset) => ({ id: asset.id, title: asset.title, meta: asset.type, text: asset.description, url: asset.url }))} />
}

function RulesPanel({ project, onAdd }: { readonly project: Project; readonly onAdd: () => void }) {
  return (
    <Card className="p-4">
      <SectionTitle title="작업 규칙" action={<Button variant="primary" onClick={onAdd}><Plus className="h-4 w-4" />규칙 추가</Button>} />
      <ProjectMiniCards items={project.rules.map((rule) => ({ id: rule.id, title: rule.title, meta: rule.category, text: rule.description }))} bare />
    </Card>
  )
}

function ActivityPanel({ activities }: { readonly activities: readonly Activity[] }) {
  return <ProjectMiniCards items={activities.map((activity) => ({ id: activity.id, title: activity.title, meta: formatShortDate(activity.createdAt), text: activity.description }))} />
}

function InfoBlock({ label, value }: { readonly label: string; readonly value: string }) {
  return <Card className="p-4"><p className="text-xs font-semibold text-mint-300">{label}</p><p className="mt-2 text-sm leading-6 text-slate-300">{value}</p></Card>
}

function ListBlock({ title, items }: { readonly title: string; readonly items: readonly string[] }) {
  return <Card className="p-4"><p className="text-xs font-semibold text-mint-300">{title}</p><div className="mt-3 flex flex-wrap gap-2">{items.map((item) => <span key={item} className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-300">{item}</span>)}</div></Card>
}
