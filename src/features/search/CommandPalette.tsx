"use client"

import { Search, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { includesText, assetSearchText, knowledgeSearchText, projectSearchText, promptSearchText, workflowSearchText } from "@/lib/utils/text"
import type { AppView } from "@/features/app/types"
import type { Asset, KnowledgeItem, Project, Prompt, Workflow } from "@/types/models"

type SearchResult = {
  readonly id: string
  readonly title: string
  readonly subtitle: string
  readonly group: string
  readonly view: AppView
}

export function CommandPalette({
  isOpen,
  projects,
  prompts,
  workflows,
  knowledge,
  assets,
  onClose,
  onSelect
}: {
  readonly isOpen: boolean
  readonly projects: readonly Project[]
  readonly prompts: readonly Prompt[]
  readonly workflows: readonly Workflow[]
  readonly knowledge: readonly KnowledgeItem[]
  readonly assets: readonly Asset[]
  readonly onClose: () => void
  readonly onSelect: (result: SearchResult) => void
}) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      window.setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [isOpen])

  const results = useMemo(() => {
    if (query.trim().length === 0) {
      return [
        ...projects.slice(0, 4).map((project) => resultFromProject(project)),
        ...prompts.slice(0, 3).map((prompt) => resultFromPrompt(prompt)),
        ...workflows.slice(0, 3).map((workflow) => resultFromWorkflow(workflow))
      ]
    }
    return [
      ...projects.filter((project) => includesText(projectSearchText(project), query)).map((project) => resultFromProject(project)),
      ...prompts.filter((prompt) => includesText(promptSearchText(prompt), query)).map((prompt) => resultFromPrompt(prompt)),
      ...workflows.filter((workflow) => includesText(workflowSearchText(workflow), query)).map((workflow) => resultFromWorkflow(workflow)),
      ...knowledge.filter((item) => includesText(knowledgeSearchText(item), query)).map((item) => resultFromKnowledge(item)),
      ...assets.filter((asset) => includesText(assetSearchText(asset), query)).map((asset) => resultFromAsset(asset))
    ].slice(0, 24)
  }, [assets, knowledge, projects, prompts, query, workflows])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" onKeyDown={(event) => event.key === "Escape" ? onClose() : undefined}>
      <div className="mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-navy-850 shadow-calm">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="프로젝트, 프롬프트, 워크플로, 지식, 자료 검색"
            className="min-h-10 flex-1 bg-transparent text-base text-white outline-none placeholder:text-slate-500"
          />
          <button type="button" onClick={onClose} aria-label="검색 닫기" className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[60dvh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-slate-400">검색 결과가 없습니다.</p>
          ) : (
            results.map((result) => (
              <button
                type="button"
                key={`${result.group}-${result.id}`}
                onClick={() => onSelect(result)}
                className="grid w-full gap-1 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.06]"
              >
                <span className="text-sm font-semibold text-white">{result.title}</span>
                <span className="text-xs text-slate-400">{result.group} · {result.subtitle}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function resultFromProject(project: Project): SearchResult {
  return { id: project.id, title: project.title, subtitle: project.summary, group: "프로젝트", view: "project" }
}

function resultFromPrompt(prompt: Prompt): SearchResult {
  return { id: prompt.id, title: prompt.title, subtitle: prompt.category, group: "프롬프트", view: "prompts" }
}

function resultFromWorkflow(workflow: Workflow): SearchResult {
  return { id: workflow.id, title: workflow.title, subtitle: workflow.category, group: "워크플로", view: "workflows" }
}

function resultFromKnowledge(item: KnowledgeItem): SearchResult {
  return { id: item.id, title: item.title, subtitle: item.type, group: "지식", view: "knowledge" }
}

function resultFromAsset(asset: Asset): SearchResult {
  return { id: asset.id, title: asset.title, subtitle: asset.type, group: "자료", view: "assets" }
}
