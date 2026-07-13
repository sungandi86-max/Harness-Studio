"use client"

import { X } from "lucide-react"
import type { FormEvent } from "react"
import { Button } from "@/components/ui/Button"
import { Field, TextInput } from "@/components/ui/Field"
import type { EditorMode } from "@/features/app/types"
import type { Asset, KnowledgeItem, Project, Prompt, Workflow } from "@/types/models"
import { AiFields, AssetFields, KnowledgeFields, ProjectFields, PromptFields, RuleFields, WorkflowFields } from "./EditorFields"
import { payloadFromForm } from "./editorPayload"
import type { EditorDefaults, SubmitPayload } from "./editorTypes"

export function EditorModal({
  mode,
  projects,
  prompts,
  workflows,
  knowledge,
  assets,
  onClose,
  onSubmit
}: {
  readonly mode: EditorMode | null
  readonly projects: readonly Project[]
  readonly prompts: readonly Prompt[]
  readonly workflows: readonly Workflow[]
  readonly knowledge: readonly KnowledgeItem[]
  readonly assets: readonly Asset[]
  readonly onClose: () => void
  readonly onSubmit: (payload: SubmitPayload) => boolean
}) {
  if (mode === null) {
    return null
  }
  const activeMode = mode
  const title = titleForMode(activeMode)
  const defaults = findDefaults(activeMode, projects, prompts, workflows, knowledge, assets)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const payload = payloadFromForm(activeMode, new FormData(event.currentTarget))
    const ok = onSubmit(payload)
    if (ok) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 p-3 backdrop-blur-sm" role="dialog" aria-modal="true">
      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-h-[86dvh] max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-navy-850 p-5 shadow-calm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} aria-label="닫기" className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <div className="grid gap-4">
          {activeMode.kind === "project" ? <ProjectFields project={defaults.project} /> : null}
          {activeMode.kind === "prompt" ? <PromptFields prompt={defaults.prompt} /> : null}
          {activeMode.kind === "workflow" ? <WorkflowFields workflow={defaults.workflow} /> : null}
          {activeMode.kind === "knowledge" ? <KnowledgeFields item={defaults.knowledge} /> : null}
          {activeMode.kind === "asset" ? <AssetFields asset={defaults.asset} /> : null}
          {activeMode.kind === "nextStep" ? <Field label="다음 작업 제목"><TextInput name="title" required placeholder="예: 모바일 레이아웃 점검" /></Field> : null}
          {activeMode.kind === "aiTeam" ? <AiFields /> : null}
          {activeMode.kind === "rule" ? <RuleFields /> : null}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" onClick={onClose}>취소</Button>
          <Button type="submit" variant="primary">저장</Button>
        </div>
      </form>
    </div>
  )
}

function titleForMode(mode: EditorMode): string {
  switch (mode.kind) {
    case "project": return mode.id ? "프로젝트 수정" : "새 프로젝트"
    case "prompt": return mode.id ? "프롬프트 수정" : "새 프롬프트"
    case "workflow": return mode.id ? "워크플로 수정" : "새 워크플로"
    case "knowledge": return mode.id ? "지식 수정" : "새 지식 기록"
    case "asset": return mode.id ? "자료 수정" : "새 자료"
    case "nextStep": return "다음 작업 추가"
    case "aiTeam": return "AI 역할 추가"
    case "rule": return "작업 규칙 추가"
  }
}

function findDefaults(mode: EditorMode, projects: readonly Project[], prompts: readonly Prompt[], workflows: readonly Workflow[], knowledge: readonly KnowledgeItem[], assets: readonly Asset[]): EditorDefaults {
  return {
    project: mode.kind === "project" && mode.id ? projects.find((item) => item.id === mode.id) : undefined,
    prompt: mode.kind === "prompt" && mode.id ? prompts.find((item) => item.id === mode.id) : undefined,
    workflow: mode.kind === "workflow" && mode.id ? workflows.find((item) => item.id === mode.id) : undefined,
    knowledge: mode.kind === "knowledge" && mode.id ? knowledge.find((item) => item.id === mode.id) : undefined,
    asset: mode.kind === "asset" && mode.id ? assets.find((item) => item.id === mode.id) : undefined
  }
}
