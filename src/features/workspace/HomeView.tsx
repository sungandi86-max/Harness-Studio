"use client"

import { CheckCircle2, Copy, FolderOpen, Plus, Star, WandSparkles } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, SectionTitle } from "@/components/ui/Card"
import { formatShortDate } from "@/lib/utils/date"
import type { AppView, EditorMode } from "@/features/app/types"
import type { Activity, Project, Prompt, Workflow } from "@/types/models"

export function HomeView({
  projects,
  prompts,
  workflows,
  activities,
  onNavigate,
  onOpenProject,
  onEdit,
  onCopyPrompt,
  onCompleteStep
}: {
  readonly projects: readonly Project[]
  readonly prompts: readonly Prompt[]
  readonly workflows: readonly Workflow[]
  readonly activities: readonly Activity[]
  readonly onNavigate: (view: AppView) => void
  readonly onOpenProject: (id: string) => void
  readonly onEdit: (mode: EditorMode) => void
  readonly onCopyPrompt: (prompt: Prompt) => void
  readonly onCompleteStep: (projectId: string, stepId: string) => void
}) {
  const activeProjects = projects.filter((project) => project.status === "active").slice(0, 3)
  const projectsWithSteps = projects.filter((project) => project.nextSteps.some((step) => !step.isDone)).slice(0, 4)
  const recentProjects = [...projects].sort((first, second) => second.updatedAt.localeCompare(first.updatedAt)).slice(0, 4)
  const favoritePrompts = prompts.filter((prompt) => prompt.isFavorite).slice(0, 4)
  const recentWorkflows = [...workflows].sort((first, second) => (second.lastUsedAt ?? second.updatedAt).localeCompare(first.lastUsedAt ?? first.updatedAt)).slice(0, 3)
  const thisWeekUseCount = prompts.reduce((total, prompt) => total + prompt.useCount, 0)

  return (
    <div className="grid gap-6">
      <section className="mobile-safe-intro grid min-w-0 max-w-full gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-insetSoft lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <p className="mb-2 text-sm font-medium text-mint-300">Build once. Reuse forever.</p>
          <h1 className="max-w-full text-[22px] font-semibold leading-tight text-white sm:text-3xl">
            <span className="block">안녕하세요, 쑤캥.</span>
            <span className="block">오늘은 어떤 작업을</span>
            <span className="block">이어갈까요?</span>
          </h1>
          <p className="mt-3 max-w-full break-all text-sm leading-6 text-slate-300 sm:break-words">
            대화가 아니라 일하는 방식을 남기는 개인 AI 작업실입니다. 프로젝트와 작업 자산을 이어서 사용할 수 있어요.
          </p>
          <div className="mt-5 flex max-w-full flex-wrap gap-2">
            <Button variant="primary" onClick={() => onEdit({ kind: "project" })}><Plus className="h-4 w-4" />새 프로젝트</Button>
            <Button onClick={() => onEdit({ kind: "prompt" })}>새 프롬프트</Button>
            <Button onClick={() => onEdit({ kind: "workflow" })}>새 워크플로</Button>
            <Button onClick={() => onEdit({ kind: "knowledge" })}>새 지식 기록</Button>
          </div>
        </div>
        <div className="min-w-0 max-w-full rounded-2xl border border-mint-300/15 bg-mint-300/10 p-4">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mint-300/15">
            <WandSparkles className="h-6 w-6 text-mint-300" aria-hidden="true" />
          </div>
          <h2 className="font-semibold text-white">쑤캥 안내 영역</h2>
          <p className="mt-2 break-all text-sm leading-6 text-slate-300 sm:break-words">
            캐릭터 이미지는 나중에 `public` 폴더 이미지로 교체하기 쉽게 작은 안내 카드로 분리해두었습니다.
          </p>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="프로젝트 수" value={projects.length.toString()} />
        <Stat label="프롬프트 수" value={prompts.length.toString()} />
        <Stat label="워크플로 수" value={workflows.length.toString()} />
        <Stat label="이번 주 사용 횟수" value={thisWeekUseCount.toString()} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="p-4">
          <SectionTitle title="오늘 이어서 작업할 프로젝트" subtitle="active 상태와 최근 수정 기준으로 보여줍니다." />
          <div className="grid gap-3 md:grid-cols-3">
            {activeProjects.map((project) => (
              <button key={project.id} type="button" onClick={() => onOpenProject(project.id)} className="rounded-xl border border-white/10 bg-white/[0.035] p-4 text-left transition hover:bg-white/[0.075]">
                <span className="mb-3 inline-flex rounded-full border border-mint-300/20 px-2 py-1 text-xs text-mint-300">{project.category}</span>
                <h3 className="font-semibold text-white">{project.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{project.summary}</p>
                <div className="mt-4 h-1.5 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-mint-300" style={{ width: `${project.progress}%` }} />
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <SectionTitle title="다음 작업" subtitle="홈에서 바로 완료 처리할 수 있습니다." />
          <div className="grid gap-2">
            {projectsWithSteps.map((project) => {
              const step = project.nextSteps.find((item) => !item.isDone)
              if (step === undefined) {
                return null
              }
              return (
                <div key={step.id} className="flex items-start gap-3 rounded-xl bg-white/[0.035] p-3">
                  <button type="button" onClick={() => onCompleteStep(project.id, step.id)} aria-label="다음 작업 완료" className="mt-1 text-mint-300">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="text-xs text-slate-500">{project.title}{step.dueDate ? ` · ${formatShortDate(step.dueDate)}` : ""}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <MiniList title="최근 수정한 프로젝트" items={recentProjects.map((project) => ({ id: project.id, title: project.title, meta: formatShortDate(project.updatedAt), action: () => onOpenProject(project.id), icon: FolderOpen }))} />
        <MiniList title="즐겨찾는 프롬프트" items={favoritePrompts.map((prompt) => ({ id: prompt.id, title: prompt.title, meta: `${prompt.recommendedAi} · ${prompt.useCount}회`, action: () => onCopyPrompt(prompt), icon: Copy }))} />
        <MiniList title="최근 사용한 워크플로" items={recentWorkflows.map((workflow) => ({ id: workflow.id, title: workflow.title, meta: `${workflow.steps.length}단계`, action: () => onNavigate("workflows"), icon: Star }))} />
      </div>

      <Card className="p-4">
        <SectionTitle title="최근 활동" />
        <div className="grid gap-2">
          {activities.slice(0, 6).map((activity) => (
            <div key={activity.id} className="rounded-xl bg-white/[0.035] px-3 py-2">
              <p className="text-sm font-medium text-white">{activity.title}</p>
              <p className="text-xs leading-5 text-slate-400">{activity.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function Stat({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </Card>
  )
}

type MiniItem = {
  readonly id: string
  readonly title: string
  readonly meta: string
  readonly action: () => void
  readonly icon: typeof FolderOpen
}

function MiniList({ title, items }: { readonly title: string; readonly items: readonly MiniItem[] }) {
  return (
    <Card className="p-4">
      <SectionTitle title={title} />
      <div className="grid gap-2">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button key={item.id} type="button" onClick={item.action} className="flex items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-white/[0.06]">
              <Icon className="h-4 w-4 text-mint-300" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-white">{item.title}</span>
                <span className="text-xs text-slate-500">{item.meta}</span>
              </span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
