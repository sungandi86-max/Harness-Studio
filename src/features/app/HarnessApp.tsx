"use client"

import { useEffect, useMemo, useState } from "react"
import { assetRepository } from "@/lib/repositories/assetRepository"
import { knowledgeRepository } from "@/lib/repositories/knowledgeRepository"
import { projectRepository } from "@/lib/repositories/projectRepository"
import { projectDocumentRepository } from "@/lib/repositories/projectDocumentRepository"
import { promptRepository } from "@/lib/repositories/promptRepository"
import { settingsRepository } from "@/lib/repositories/settingsRepository"
import { workflowRepository } from "@/lib/repositories/workflowRepository"
import { loadWorkspace } from "@/lib/storage/workspaceStorage"
import type { WorkspaceData } from "@/types/models"
import { EditorModal } from "@/features/editor/EditorModal"
import type { SubmitPayload } from "@/features/editor/editorTypes"
import { LibraryView } from "@/features/library/LibraryView"
import { ProjectDetailView } from "@/features/projects/ProjectDetailView"
import { ProjectsView } from "@/features/projects/ProjectsView"
import { CommandPalette } from "@/features/search/CommandPalette"
import { SettingsView } from "@/features/settings/SettingsView"
import { HomeView } from "@/features/workspace/HomeView"
import { AppShell } from "./AppShell"
import { savePayload } from "./appActions"
import type { AppView, EditorMode } from "./types"

export function HarnessApp({
  initialView,
  initialProjectId = "project-harness-studio",
  initialProjectTab
}: {
  readonly initialView: AppView
  readonly initialProjectId?: string | undefined
  readonly initialProjectTab?: string | undefined
}) {
  const [data, setData] = useState<WorkspaceData>(() => loadWorkspace())
  const [view, setView] = useState<AppView>(initialView)
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId)
  const [editorMode, setEditorMode] = useState<EditorMode | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [toast, setToast] = useState("저장됨")

  useEffect(() => setData(loadWorkspace()), [])
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setIsSearchOpen(true)
      }
      if (event.key === "Escape") {
        setIsSearchOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const selectedProject = useMemo(
    () => data.projects.find((project) => project.id === selectedProjectId) ?? data.projects[0],
    [data.projects, selectedProjectId]
  )

  function refresh(message = "저장됨"): void {
    setData(loadWorkspace())
    setToast(message)
    window.setTimeout(() => setToast("저장됨"), 1600)
  }

  function openProject(id: string): void {
    setSelectedProjectId(id)
    setView("project")
  }

  function exportJson(): void {
    const json = settingsRepository.exportJson()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `harness-studio-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    refresh("내보냄")
  }

  function importJson(text: string): boolean {
    const imported = settingsRepository.importJson(text)
    if (imported === null) {
      return false
    }
    setData(imported)
    setToast("가져옴")
    return true
  }

  function copyPrompt(promptId: string): void {
    const prompt = data.prompts.find((item) => item.id === promptId)
    if (prompt === undefined) {
      return
    }
    void navigator.clipboard.writeText(prompt.body)
    promptRepository.markUsed(prompt.id)
    refresh("프롬프트 복사됨")
  }

  function submitEditor(payload: SubmitPayload): boolean {
    const ok = savePayload(payload)
    if (!ok) {
      setToast("필수값 또는 URL을 확인해주세요")
      return false
    }
    refresh("저장됨")
    return true
  }

  function deleteProject(id: string): void {
    if (window.confirm("프로젝트를 삭제할까요?")) {
      projectRepository.delete(id)
      refresh("삭제됨")
      setView("projects")
    }
  }

  function deleteLibrary(kind: "prompts" | "workflows" | "knowledge" | "assets" | "favorites", id: string): void {
    if (!window.confirm("항목을 삭제할까요?")) {
      return
    }
    if (kind === "prompts") promptRepository.delete(id)
    if (kind === "workflows") workflowRepository.delete(id)
    if (kind === "knowledge") knowledgeRepository.delete(id)
    if (kind === "assets" || kind === "favorites") assetRepository.delete(id)
    refresh("삭제됨")
  }

  function toggleFavorite(kind: "prompts" | "workflows" | "knowledge" | "assets" | "favorites", id: string): void {
    if (kind === "prompts") promptRepository.toggleFavorite(id)
    if (kind === "workflows") workflowRepository.toggleFavorite(id)
    if (kind === "knowledge") knowledgeRepository.toggleFavorite(id)
    if (kind === "assets" || kind === "favorites") assetRepository.toggleFavorite(id)
    refresh()
  }

  function duplicate(kind: "prompts" | "workflows", id: string): void {
    if (kind === "prompts") promptRepository.duplicate(id)
    if (kind === "workflows") workflowRepository.duplicate(id)
    refresh("복제됨")
  }

  const body = selectedProject && view === "project" ? (
    <ProjectDetailView
      project={selectedProject}
      prompts={data.prompts}
      workflows={data.workflows}
      knowledge={data.knowledge}
      assets={data.assets}
      activities={data.activities}
      onEdit={setEditorMode}
      onBack={() => setView("projects")}
      onToggleFavorite={(id) => {
        projectRepository.toggleFavorite(id)
        refresh()
      }}
      onCopyPrompt={(prompt) => copyPrompt(prompt.id)}
      onToggleStep={(projectId, stepId) => {
        projectRepository.toggleNextStep(projectId, stepId)
        refresh("작업 변경됨")
      }}
      onToggleWorkflowStep={(workflowId, stepId) => {
        workflowRepository.toggleStep(workflowId, stepId)
        refresh("워크플로 진행됨")
      }}
      onDeleteStep={(projectId, stepId) => {
        projectRepository.deleteNextStep(projectId, stepId)
        refresh("삭제됨")
      }}
      onDeleteDocument={(projectId, documentId) => {
        if (window.confirm("문서를 삭제할까요?")) {
          projectDocumentRepository.delete(projectId, documentId)
          refresh("문서 삭제됨")
        }
      }}
      onFeedback={(message) => setToast(message)}
      initialTab={initialProjectTab}
    />
  ) : (
    renderView(view)
  )

  function renderView(activeView: AppView) {
    switch (activeView) {
      case "home":
        return <HomeView projects={data.projects} prompts={data.prompts} workflows={data.workflows} activities={data.activities} onNavigate={setView} onOpenProject={openProject} onEdit={setEditorMode} onCopyPrompt={(prompt) => copyPrompt(prompt.id)} onCompleteStep={(projectId, stepId) => { projectRepository.toggleNextStep(projectId, stepId); refresh("작업 완료") }} />
      case "projects":
        return <ProjectsView projects={data.projects} onOpenProject={openProject} onEdit={setEditorMode} onDelete={deleteProject} onToggleFavorite={(id) => { projectRepository.toggleFavorite(id); refresh() }} />
      case "prompts":
        return <LibraryView kind="prompts" prompts={data.prompts} workflows={data.workflows} knowledge={data.knowledge} assets={data.assets} onEdit={setEditorMode} onDelete={deleteLibrary} onToggleFavorite={toggleFavorite} onCopyPrompt={(prompt) => copyPrompt(prompt.id)} onToggleWorkflowStep={(workflowId, stepId) => { workflowRepository.toggleStep(workflowId, stepId); refresh("워크플로 진행됨") }} onDuplicate={duplicate} />
      case "workflows":
        return <LibraryView kind="workflows" prompts={data.prompts} workflows={data.workflows} knowledge={data.knowledge} assets={data.assets} onEdit={setEditorMode} onDelete={deleteLibrary} onToggleFavorite={toggleFavorite} onCopyPrompt={(prompt) => copyPrompt(prompt.id)} onToggleWorkflowStep={(workflowId, stepId) => { workflowRepository.toggleStep(workflowId, stepId); refresh("워크플로 진행됨") }} onDuplicate={duplicate} />
      case "knowledge":
        return <LibraryView kind="knowledge" prompts={data.prompts} workflows={data.workflows} knowledge={data.knowledge} assets={data.assets} onEdit={setEditorMode} onDelete={deleteLibrary} onToggleFavorite={toggleFavorite} onCopyPrompt={(prompt) => copyPrompt(prompt.id)} onToggleWorkflowStep={(workflowId, stepId) => { workflowRepository.toggleStep(workflowId, stepId); refresh("워크플로 진행됨") }} onDuplicate={duplicate} />
      case "assets":
        return <LibraryView kind="assets" prompts={data.prompts} workflows={data.workflows} knowledge={data.knowledge} assets={data.assets} onEdit={setEditorMode} onDelete={deleteLibrary} onToggleFavorite={toggleFavorite} onCopyPrompt={(prompt) => copyPrompt(prompt.id)} onToggleWorkflowStep={(workflowId, stepId) => { workflowRepository.toggleStep(workflowId, stepId); refresh("워크플로 진행됨") }} onDuplicate={duplicate} />
      case "favorites":
        return <LibraryView kind="favorites" prompts={data.prompts} workflows={data.workflows} knowledge={data.knowledge} assets={data.assets} onEdit={setEditorMode} onDelete={deleteLibrary} onToggleFavorite={toggleFavorite} onCopyPrompt={(prompt) => copyPrompt(prompt.id)} onToggleWorkflowStep={(workflowId, stepId) => { workflowRepository.toggleStep(workflowId, stepId); refresh("워크플로 진행됨") }} onDuplicate={duplicate} />
      case "settings":
        return <SettingsView data={data} onExport={exportJson} onImport={importJson} onReset={() => { setData(settingsRepository.resetSamples()); setToast("샘플 초기화") }} onClear={() => { setData(settingsRepository.clearAll()); setToast("전체 삭제") }} />
      case "project":
        return null
    }
  }

  return (
    <AppShell activeView={view} saveLabel={toast} onNavigate={setView} onSearch={() => setIsSearchOpen(true)} onQuickCreate={() => setEditorMode({ kind: "project" })} onExport={exportJson}>
      {body}
      <CommandPalette
        isOpen={isSearchOpen}
        projects={data.projects}
        prompts={data.prompts}
        workflows={data.workflows}
        knowledge={data.knowledge}
        assets={data.assets}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(result) => {
          setIsSearchOpen(false)
          if (result.view === "project") openProject(result.id)
          else setView(result.view)
        }}
      />
      <EditorModal mode={editorMode} projects={data.projects} prompts={data.prompts} workflows={data.workflows} knowledge={data.knowledge} assets={data.assets} onClose={() => setEditorMode(null)} onSubmit={submitEditor} />
    </AppShell>
  )
}
