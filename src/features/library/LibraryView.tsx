"use client"

import { Copy, Heart, Pencil, Plus, Search, Trash2, Workflow as WorkflowIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, SectionTitle } from "@/components/ui/Card"
import { SelectInput, TextInput } from "@/components/ui/Field"
import { formatShortDate } from "@/lib/utils/date"
import { assetSearchText, includesText, knowledgeSearchText, promptSearchText, workflowSearchText } from "@/lib/utils/text"
import type { EditorMode } from "@/features/app/types"
import type { Asset, KnowledgeItem, Prompt, Workflow } from "@/types/models"

type LibraryKind = "prompts" | "workflows" | "knowledge" | "assets" | "favorites"
type LibraryItem = Prompt | Workflow | KnowledgeItem | Asset

export function LibraryView({
  kind,
  prompts,
  workflows,
  knowledge,
  assets,
  onEdit,
  onDelete,
  onToggleFavorite,
  onCopyPrompt,
  onToggleWorkflowStep,
  onDuplicate
}: {
  readonly kind: LibraryKind
  readonly prompts: readonly Prompt[]
  readonly workflows: readonly Workflow[]
  readonly knowledge: readonly KnowledgeItem[]
  readonly assets: readonly Asset[]
  readonly onEdit: (mode: EditorMode) => void
  readonly onDelete: (kind: LibraryKind, id: string) => void
  readonly onToggleFavorite: (kind: LibraryKind, id: string) => void
  readonly onCopyPrompt: (prompt: Prompt) => void
  readonly onToggleWorkflowStep: (workflowId: string, stepId: string) => void
  readonly onDuplicate: (kind: "prompts" | "workflows", id: string) => void
}) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [favoritesOnly, setFavoritesOnly] = useState(kind === "favorites")
  const source = useMemo(() => getItems(kind, prompts, workflows, knowledge, assets), [assets, kind, knowledge, prompts, workflows])
  const categories = useMemo(() => ["all", ...new Set(source.map((item) => getCategory(item)))], [source])
  const items = useMemo(() => {
    return source.filter((item) => {
      const matchesQuery = query.trim().length === 0 || includesText(searchText(item), query)
      const matchesCategory = category === "all" || getCategory(item) === category
      const matchesFavorite = !favoritesOnly || item.isFavorite
      return matchesQuery && matchesCategory && matchesFavorite
    })
  }, [category, favoritesOnly, query, source])

  return (
    <div className="grid gap-5">
      <SectionTitle
        title={titleForKind(kind)}
        subtitle={subtitleForKind(kind)}
        action={kind !== "favorites" ? <Button variant="primary" onClick={() => onEdit({ kind: editorKind(kind) })}><Plus className="h-4 w-4" />새로 만들기</Button> : undefined}
      />
      <Card className="grid gap-3 p-4 md:grid-cols-[1fr_180px_auto]">
        <label className="flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3">
          <Search className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="검색" className="min-h-0 flex-1 border-0 bg-transparent px-0" />
        </label>
        <SelectInput value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item} value={item}>{item === "all" ? "전체 분류" : item}</option>)}
        </SelectInput>
        <Button variant={favoritesOnly ? "primary" : "secondary"} onClick={() => setFavoritesOnly((value) => !value)}>
          <Heart className="h-4 w-4" />즐겨찾기
        </Button>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <LibraryCard
            key={item.id}
            item={item}
            onEdit={() => onEdit(editorModeForItem(item))}
            onDelete={() => onDelete(kind, item.id)}
            onToggleFavorite={() => onToggleFavorite(kindForItem(item), item.id)}
            onCopyPrompt={onCopyPrompt}
            onToggleWorkflowStep={onToggleWorkflowStep}
            onDuplicate={onDuplicate}
          />
        ))}
      </div>
    </div>
  )
}

function LibraryCard({
  item,
  onEdit,
  onDelete,
  onToggleFavorite,
  onCopyPrompt,
  onToggleWorkflowStep,
  onDuplicate
}: {
  readonly item: LibraryItem
  readonly onEdit: () => void
  readonly onDelete: () => void
  readonly onToggleFavorite: () => void
  readonly onCopyPrompt: (prompt: Prompt) => void
  readonly onToggleWorkflowStep: (workflowId: string, stepId: string) => void
  readonly onDuplicate: (kind: "prompts" | "workflows", id: string) => void
}) {
  return (
    <Card className="flex min-h-[260px] flex-col p-4 transition hover:bg-white/[0.065]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-white">{item.title}</p>
          <p className="mt-1 text-xs text-mint-300">{getCategory(item)}</p>
        </div>
        <button type="button" onClick={onToggleFavorite} aria-label="즐겨찾기" className={item.isFavorite ? "text-mint-300" : "text-slate-500"}>
          <Heart className="h-5 w-5" fill={item.isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="line-clamp-3 text-sm leading-6 text-slate-400">{summaryOf(item)}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
        {tagsOf(item).slice(0, 4).map((tag) => <span key={tag} className="rounded-full border border-white/10 px-2 py-1">{tag}</span>)}
      </div>
      {isWorkflow(item) ? <WorkflowRunner workflow={item} onToggleStep={onToggleWorkflowStep} /> : null}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        {isPrompt(item) ? <Button onClick={() => onCopyPrompt(item)}><Copy className="h-4 w-4" />복사</Button> : null}
        {isPrompt(item) ? <Button onClick={() => onDuplicate("prompts", item.id)}>복제</Button> : null}
        {isWorkflow(item) ? <Button onClick={() => onDuplicate("workflows", item.id)}>복제</Button> : null}
        {isAsset(item) ? <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-lg border border-white/10 px-3 text-sm text-mint-300">링크 열기</a> : null}
        <span className="ml-auto text-xs text-slate-500">{formatShortDate(item.updatedAt)}</span>
        <button type="button" onClick={onEdit} aria-label="수정" className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white"><Pencil className="h-4 w-4" /></button>
        <button type="button" onClick={onDelete} aria-label="삭제" className="rounded-lg p-2 text-slate-400 hover:bg-rose-400/10 hover:text-rose-200"><Trash2 className="h-4 w-4" /></button>
      </div>
    </Card>
  )
}

function WorkflowRunner({ workflow, onToggleStep }: { readonly workflow: Workflow; readonly onToggleStep: (workflowId: string, stepId: string) => void }) {
  const doneCount = workflow.steps.filter((step) => step.isDone).length
  return (
    <div className="mt-4 rounded-xl bg-white/[0.035] p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <span className="inline-flex items-center gap-1"><WorkflowIcon className="h-3.5 w-3.5" />실행 모드</span>
        <span>{doneCount}/{workflow.steps.length}</span>
      </div>
      <div className="grid gap-1">
        {workflow.steps.map((step) => (
          <button key={step.id} type="button" onClick={() => onToggleStep(workflow.id, step.id)} className={`rounded-lg px-2 py-1 text-left text-xs ${step.isDone ? "text-mint-300" : "text-slate-400 hover:bg-white/[0.06]"}`}>
            {step.isDone ? "완료" : "진행"} · {step.title}
          </button>
        ))}
      </div>
    </div>
  )
}

function getItems(kind: LibraryKind, prompts: readonly Prompt[], workflows: readonly Workflow[], knowledge: readonly KnowledgeItem[], assets: readonly Asset[]): readonly LibraryItem[] {
  switch (kind) {
    case "prompts":
      return prompts
    case "workflows":
      return workflows
    case "knowledge":
      return knowledge
    case "assets":
      return assets
    case "favorites":
      return [...prompts, ...workflows, ...knowledge, ...assets].filter((item) => item.isFavorite)
  }
}

function titleForKind(kind: LibraryKind): string {
  switch (kind) {
    case "prompts": return "Prompt Library"
    case "workflows": return "Workflow Library"
    case "knowledge": return "Knowledge Library"
    case "assets": return "Assets"
    case "favorites": return "즐겨찾기"
  }
}

function subtitleForKind(kind: LibraryKind): string {
  switch (kind) {
    case "prompts": return "자주 쓰는 지시와 출력 기준을 프로젝트와 연결합니다."
    case "workflows": return "순서가 있는 작업 템플릿을 실행하고 재사용합니다."
    case "knowledge": return "결정, 배운 점, 오류 해결 기록, 참고 메모를 남깁니다."
    case "assets": return "파일 업로드 없이 URL 기반 자료를 프로젝트와 연결합니다."
    case "favorites": return "즐겨찾는 프롬프트, 워크플로, 지식, 자료를 한 곳에서 봅니다."
  }
}

function editorKind(kind: LibraryKind): "prompt" | "workflow" | "knowledge" | "asset" {
  switch (kind) {
    case "prompts": return "prompt"
    case "workflows": return "workflow"
    case "knowledge": return "knowledge"
    case "assets":
    case "favorites":
      return "asset"
  }
}

function kindForItem(item: LibraryItem): LibraryKind {
  if (isPrompt(item)) return "prompts"
  if (isWorkflow(item)) return "workflows"
  if (isKnowledge(item)) return "knowledge"
  return "assets"
}

function editorModeForItem(item: LibraryItem): EditorMode {
  if (isPrompt(item)) return { kind: "prompt", id: item.id }
  if (isWorkflow(item)) return { kind: "workflow", id: item.id }
  if (isKnowledge(item)) return { kind: "knowledge", id: item.id }
  return { kind: "asset", id: item.id }
}

function searchText(item: LibraryItem): string {
  if (isPrompt(item)) return promptSearchText(item)
  if (isWorkflow(item)) return workflowSearchText(item)
  if (isKnowledge(item)) return knowledgeSearchText(item)
  return assetSearchText(item)
}

function getCategory(item: LibraryItem): string {
  if (isAsset(item)) return item.type
  if (isKnowledge(item)) return item.type
  return item.category
}

function summaryOf(item: LibraryItem): string {
  if (isAsset(item)) return item.description
  return item.summary
}

function tagsOf(item: LibraryItem): readonly string[] {
  if (isPrompt(item) || isKnowledge(item) || isAsset(item)) return item.tags
  return item.projectIds
}

function isPrompt(item: LibraryItem): item is Prompt {
  return "recommendedAi" in item
}

function isWorkflow(item: LibraryItem): item is Workflow {
  return "steps" in item
}

function isKnowledge(item: LibraryItem): item is KnowledgeItem {
  return "content" in item
}

function isAsset(item: LibraryItem): item is Asset {
  return "url" in item
}
