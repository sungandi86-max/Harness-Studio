"use client"

import { Download, RotateCcw, Trash2, Upload } from "lucide-react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, SectionTitle } from "@/components/ui/Card"
import type { WorkspaceData } from "@/types/models"

export function SettingsView({
  data,
  onExport,
  onImport,
  onReset,
  onClear
}: {
  readonly data: WorkspaceData
  readonly onExport: () => void
  readonly onImport: (text: string) => boolean
  readonly onReset: () => void
  readonly onClear: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState("")

  async function handleImport(file: File | undefined): Promise<void> {
    if (file === undefined) {
      return
    }
    const text = await file.text()
    const ok = onImport(text)
    setMessage(ok ? "JSON 데이터를 가져왔습니다." : "잘못된 JSON 구조입니다.")
  }

  function confirmClear(): void {
    const ok = window.confirm("전체 데이터를 삭제할까요? 이 작업은 되돌릴 수 없습니다.")
    if (ok) {
      onClear()
      setMessage("전체 데이터를 삭제했습니다.")
    }
  }

  return (
    <div className="grid gap-5">
      <SectionTitle title="설정" subtitle="로컬 데이터 백업, 가져오기, 초기화를 관리합니다." />
      {message ? <div className="rounded-xl border border-mint-300/20 bg-mint-300/10 p-3 text-sm text-mint-100">{message}</div> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="데이터 관리" subtitle="localStorage에 저장된 전체 Workspace를 JSON으로 옮길 수 있습니다." />
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={onExport}><Download className="h-4 w-4" />전체 데이터 JSON 내보내기</Button>
            <Button onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" />JSON 파일 가져오기</Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                void handleImport(event.target.files?.[0])
                event.currentTarget.value = ""
              }}
            />
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle title="초기화" subtitle="샘플 데이터로 되돌리거나 전체 데이터를 비울 수 있습니다." />
          <div className="flex flex-wrap gap-2">
            <Button onClick={onReset}><RotateCcw className="h-4 w-4" />샘플 데이터 초기화</Button>
            <Button variant="danger" onClick={confirmClear}><Trash2 className="h-4 w-4" />전체 데이터 삭제</Button>
          </div>
        </Card>
      </div>
      <Card className="p-5">
        <SectionTitle title="현재 저장 구조" />
        <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
          <p>프로젝트 {data.projects.length}개</p>
          <p>프롬프트 {data.prompts.length}개</p>
          <p>워크플로 {data.workflows.length}개</p>
          <p>지식 {data.knowledge.length}개</p>
          <p>자료 {data.assets.length}개</p>
          <p>활동 {data.activities.length}개</p>
          <p>사용자 {data.settings.userName}</p>
          <p>버전 {data.settings.storageVersion}</p>
        </div>
      </Card>
    </div>
  )
}
