"use client"

import { Copy, Download, FileText, Pencil, Plus, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, SectionTitle } from "@/components/ui/Card"
import { formatShortDate } from "@/lib/utils/date"
import type { EditorMode } from "@/features/app/types"
import type { Project, ProjectDocument } from "@/types/models"

export function DocsPanel({
  project,
  onEdit,
  onDelete,
  onFeedback
}: {
  readonly project: Project
  readonly onEdit: (mode: EditorMode) => void
  readonly onDelete: (projectId: string, documentId: string) => void
  readonly onFeedback: (message: string) => void
}) {
  const [selectedIds, setSelectedIds] = useState<readonly string[]>(
    project.docs.filter((document) => document.includeInAiContext).map((document) => document.id)
  )
  const selectedDocs = useMemo(
    () => project.docs.filter((document) => selectedIds.includes(document.id)),
    [project.docs, selectedIds]
  )
  const aiContext = useMemo(() => composeAiContext(project, selectedDocs), [project, selectedDocs])

  function toggleSelected(id: string): void {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  async function copyText(text: string, message: string): Promise<void> {
    await navigator.clipboard.writeText(text)
    onFeedback(message)
  }

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <Card className="p-4">
        <SectionTitle
          title="Docs"
          subtitle="프로젝트 문서를 Markdown으로 저장하고 AI 작업 컨텍스트에 포함할 문서를 선택합니다."
          action={<Button variant="primary" onClick={() => onEdit({ kind: "document", projectId: project.id })}><Plus className="h-4 w-4" />문서 추가</Button>}
        />
        <div className="grid gap-3">
          {project.docs.length === 0 ? (
            <p className="rounded-xl bg-white/[0.035] p-4 text-sm text-slate-400">아직 등록된 문서가 없습니다.</p>
          ) : (
            project.docs.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                isSelected={selectedIds.includes(document.id)}
                onSelect={() => toggleSelected(document.id)}
                onEdit={() => onEdit({ kind: "document", projectId: project.id, id: document.id })}
                onDelete={() => onDelete(project.id, document.id)}
                onCopy={() => void copyText(document.content, "문서 내용을 복사했습니다.")}
                onDownload={() => downloadMarkdown(document.fileName, document.content)}
              />
            ))
          )}
        </div>
      </Card>

      <Card className="p-4">
        <SectionTitle
          title="AI 작업 시작 컨텍스트"
          subtitle="선택된 문서와 현재 Next Step을 하나로 합칩니다."
          action={<Button onClick={() => void copyText(aiContext, "AI 작업 시작 컨텍스트를 복사했습니다.")}><Copy className="h-4 w-4" />전체 복사</Button>}
        />
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedDocs.map((document) => (
            <span key={document.id} className="rounded-full border border-mint-300/20 px-2 py-1 text-xs text-mint-300">
              {document.fileName}
            </span>
          ))}
        </div>
        <pre className="max-h-[520px] min-w-0 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-xs leading-6 text-slate-300">
          {aiContext}
        </pre>
      </Card>
    </div>
  )
}

function DocumentCard({
  document,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onCopy,
  onDownload
}: {
  readonly document: ProjectDocument
  readonly isSelected: boolean
  readonly onSelect: () => void
  readonly onEdit: () => void
  readonly onDelete: () => void
  readonly onCopy: () => void
  readonly onDownload: () => void
}) {
  return (
    <div className="rounded-xl bg-white/[0.035] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 text-xs text-slate-300">
              <FileText className="h-3.5 w-3.5" />
              {document.fileName}
            </span>
            <span className="rounded-full bg-white/[0.06] px-2 py-1 text-xs text-slate-400">v{document.version}</span>
          </div>
          <p className="font-semibold text-white">{document.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">{document.purpose}</p>
          <p className="mt-2 text-xs text-slate-500">
            {document.documentType} · {formatShortDate(document.updatedAt)}
          </p>
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300">
          <input type="checkbox" checked={isSelected} onChange={onSelect} className="h-4 w-4 accent-mint-300" />
          AI 컨텍스트
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onCopy}><Copy className="h-4 w-4" />복사</Button>
        <Button onClick={onDownload}><Download className="h-4 w-4" />다운로드</Button>
        <Button onClick={onEdit}><Pencil className="h-4 w-4" />수정</Button>
        <Button variant="danger" onClick={onDelete}><Trash2 className="h-4 w-4" />삭제</Button>
      </div>
    </div>
  )
}

function composeAiContext(project: Project, documents: readonly ProjectDocument[]): string {
  const nextSteps = project.nextSteps.filter((step) => !step.isDone)
  const nextStepText =
    nextSteps.length === 0
      ? "- 등록된 현재 Next Step이 없습니다."
      : nextSteps.map((step) => `- [${step.priority}] ${step.title}${step.dueDate ? ` (due: ${step.dueDate})` : ""}${step.note ? `\n  - ${step.note}` : ""}`).join("\n")

  const documentText =
    documents.length === 0
      ? "선택된 문서가 없습니다."
      : documents.map((document) => `---\n## ${document.fileName} · ${document.title}\n목적: ${document.purpose}\n버전: ${document.version}\n\n${document.content}`).join("\n\n")

  return `# AI 작업 시작 컨텍스트\n\n프로젝트명: ${project.title}\n\n## 현재 Next Step\n${nextStepText}\n\n## 선택된 프로젝트 문서\n${documentText}`
}

function downloadMarkdown(fileName: string, content: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}
