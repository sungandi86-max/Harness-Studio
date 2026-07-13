"use client"

import { ExternalLink, GitBranch, Heart, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, SectionTitle } from "@/components/ui/Card"
import { SelectInput, TextInput } from "@/components/ui/Field"
import { formatShortDate } from "@/lib/utils/date"
import { includesText, projectSearchText } from "@/lib/utils/text"
import type { EditorMode } from "@/features/app/types"
import type { Project, ProjectStatus } from "@/types/models"

type SortMode = "recent" | "name"

export function ProjectsView({
  projects,
  onOpenProject,
  onEdit,
  onDelete,
  onToggleFavorite
}: {
  readonly projects: readonly Project[]
  readonly onOpenProject: (id: string) => void
  readonly onEdit: (mode: EditorMode) => void
  readonly onDelete: (id: string) => void
  readonly onToggleFavorite: (id: string) => void
}) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<ProjectStatus | "all">("all")
  const [category, setCategory] = useState("all")
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [sort, setSort] = useState<SortMode>("recent")

  const categories = useMemo(() => ["all", ...new Set(projects.map((project) => project.category))], [projects])
  const filtered = useMemo(() => {
    const result = projects.filter((project) => {
      const matchesQuery = query.trim().length === 0 || includesText(projectSearchText(project), query)
      const matchesStatus = status === "all" || project.status === status
      const matchesCategory = category === "all" || project.category === category
      const matchesFavorite = !favoritesOnly || project.isFavorite
      return matchesQuery && matchesStatus && matchesCategory && matchesFavorite
    })
    return [...result].sort((first, second) =>
      sort === "name" ? first.title.localeCompare(second.title, "ko-KR") : second.updatedAt.localeCompare(first.updatedAt)
    )
  }, [category, favoritesOnly, projects, query, sort, status])

  return (
    <div className="grid gap-5">
      <SectionTitle
        title="프로젝트"
        subtitle="작업 방식, 자료, 프롬프트, 다음 단계를 프로젝트별 Harness로 관리합니다."
        action={<Button variant="primary" onClick={() => onEdit({ kind: "project" })}><Plus className="h-4 w-4" />새 프로젝트</Button>}
      />

      <Card className="grid gap-3 p-4 lg:grid-cols-[1fr_180px_180px_160px_auto]">
        <label className="flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3">
          <Search className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="프로젝트 검색" className="min-h-0 flex-1 border-0 bg-transparent px-0" />
        </label>
        <SelectInput value={status} onChange={(event) => setStatus(readStatus(event.target.value))}>
          <option value="all">전체 상태</option>
          <option value="idea">idea</option>
          <option value="active">active</option>
          <option value="paused">paused</option>
          <option value="completed">completed</option>
          <option value="archived">archived</option>
        </SelectInput>
        <SelectInput value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item} value={item}>{item === "all" ? "전체 카테고리" : item}</option>)}
        </SelectInput>
        <SelectInput value={sort} onChange={(event) => setSort(event.target.value === "name" ? "name" : "recent")}>
          <option value="recent">최신순</option>
          <option value="name">이름순</option>
        </SelectInput>
        <Button variant={favoritesOnly ? "primary" : "secondary"} onClick={() => setFavoritesOnly((value) => !value)}>
          <SlidersHorizontal className="h-4 w-4" />즐겨찾기
        </Button>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={() => onOpenProject(project.id)}
            onEdit={() => onEdit({ kind: "project", id: project.id })}
            onDelete={() => onDelete(project.id)}
            onToggleFavorite={() => onToggleFavorite(project.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  onOpen,
  onEdit,
  onDelete,
  onToggleFavorite
}: {
  readonly project: Project
  readonly onOpen: () => void
  readonly onEdit: () => void
  readonly onDelete: () => void
  readonly onToggleFavorite: () => void
}) {
  const nextStep = project.nextSteps.find((step) => !step.isDone)
  return (
    <Card className="flex min-h-[320px] flex-col p-4 transition hover:bg-white/[0.065]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <button type="button" onClick={onOpen} className="min-w-0 text-left">
          <p className="truncate text-lg font-semibold text-white">{project.title}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-400">{project.summary}</p>
        </button>
        <button type="button" onClick={onToggleFavorite} aria-label="프로젝트 즐겨찾기" className={project.isFavorite ? "text-mint-300" : "text-slate-500"}>
          <Heart className="h-5 w-5" fill={project.isFavorite ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-white/10 px-2 py-1 text-slate-300">{project.category}</span>
        <span className="rounded-full bg-white/[0.06] px-2 py-1 text-slate-300">{project.status}</span>
      </div>

      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-slate-400">
          <span>진행률</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10">
          <div className="h-full rounded-full bg-mint-300" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <div className="grid gap-2 text-sm text-slate-300">
        <p><span className="text-slate-500">다음 작업 </span>{nextStep?.title ?? "등록된 다음 작업 없음"}</p>
        <p><span className="text-slate-500">연결 </span>프롬프트 {project.promptIds.length}개 · 워크플로 {project.workflowIds.length}개</p>
        <p><span className="text-slate-500">수정 </span>{formatShortDate(project.updatedAt)}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        {project.links.github ? <a href={project.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-mint-300 hover:bg-white/[0.06]"><GitBranch className="h-3.5 w-3.5" />GitHub</a> : null}
        {project.links.deployment ? <a href={project.links.deployment} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-mint-300 hover:bg-white/[0.06]"><ExternalLink className="h-3.5 w-3.5" />배포</a> : null}
        <button type="button" onClick={onEdit} aria-label="프로젝트 수정" className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white"><Pencil className="h-4 w-4" /></button>
        <button type="button" onClick={onDelete} aria-label="프로젝트 삭제" className="rounded-lg p-2 text-slate-400 hover:bg-rose-400/10 hover:text-rose-200"><Trash2 className="h-4 w-4" /></button>
      </div>
    </Card>
  )
}

function readStatus(value: string): ProjectStatus | "all" {
  switch (value) {
    case "idea":
    case "active":
    case "paused":
    case "completed":
    case "archived":
      return value
    default:
      return "all"
  }
}
