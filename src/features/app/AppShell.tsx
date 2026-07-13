"use client"

import {
  Archive,
  BookOpen,
  Box,
  FolderKanban,
  Heart,
  Home,
  Library,
  Menu,
  Plus,
  Search,
  Settings,
  Sparkles,
  Workflow
} from "lucide-react"
import type { ReactNode } from "react"
import type { AppView } from "./types"

type NavItem = {
  readonly view: AppView
  readonly label: string
  readonly icon: typeof Home
}

const navItems: readonly NavItem[] = [
  { view: "home", label: "홈", icon: Home },
  { view: "projects", label: "프로젝트", icon: FolderKanban },
  { view: "prompts", label: "프롬프트", icon: Library },
  { view: "workflows", label: "워크플로", icon: Workflow },
  { view: "knowledge", label: "지식", icon: BookOpen },
  { view: "assets", label: "자료", icon: Box },
  { view: "favorites", label: "즐겨찾기", icon: Heart },
  { view: "settings", label: "설정", icon: Settings }
]

export function AppShell({
  activeView,
  children,
  saveLabel,
  onNavigate,
  onSearch,
  onQuickCreate,
  onExport
}: {
  readonly activeView: AppView
  readonly children: ReactNode
  readonly saveLabel: string
  readonly onNavigate: (view: AppView) => void
  readonly onSearch: () => void
  readonly onQuickCreate: () => void
  readonly onExport: () => void
}) {
  return (
    <div className="min-h-[100dvh] overflow-x-hidden lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] border-r border-white/10 bg-navy-900/95 p-5 lg:flex lg:flex-col">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-mint-300/20 bg-mint-300/10">
            <Sparkles className="h-5 w-5 text-mint-300" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-semibold text-white">Harness Studio</p>
            <p className="text-xs text-slate-400">Your AI Workspace</p>
          </div>
        </div>

        <nav className="grid gap-1" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <NavButton key={item.view} item={item} active={activeView === item.view} onNavigate={onNavigate} />
          ))}
        </nav>

        <div className="mt-auto grid gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>저장 상태</span>
            <span className="text-mint-300">{saveLabel}</span>
          </div>
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-200 transition hover:bg-white/[0.06]"
          >
            <Archive className="h-4 w-4" aria-hidden="true" />
            데이터 내보내기
          </button>
          <button
            type="button"
            onClick={() => onNavigate("settings")}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-200 transition hover:bg-white/[0.06]"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            설정
          </button>
          <p className="text-xs text-slate-500">사용자 이름: 쑤캥</p>
        </div>
      </aside>

      <div className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-navy-950/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 lg:hidden">
              <Menu className="h-5 w-5 text-slate-300" aria-hidden="true" />
              <span className="font-semibold text-white">Harness</span>
            </div>
            <button
              type="button"
              onClick={onSearch}
              className="flex min-h-10 flex-1 items-center justify-between rounded-xl border border-white/10 bg-white/[0.045] px-3 text-left text-sm text-slate-400 transition hover:bg-white/[0.075]"
            >
              <span className="inline-flex items-center gap-2">
                <Search className="h-4 w-4" aria-hidden="true" />
                전체 검색
              </span>
              <kbd className="hidden rounded border border-white/10 px-2 py-1 text-[11px] text-slate-500 sm:inline">Ctrl K</kbd>
            </button>
            <button
              type="button"
              onClick={onQuickCreate}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-mint-300 px-3 text-sm font-semibold text-navy-950 transition hover:bg-mint-400"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">빠른 생성</span>
            </button>
          </div>
        </header>
        <main className="w-full overflow-x-hidden pb-28 pt-6">
          <div className="mx-auto box-border w-full max-w-full px-4 sm:px-6 lg:max-w-[1440px] lg:px-8">{children}</div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-white/10 bg-navy-900/95 px-2 py-2 backdrop-blur-xl lg:hidden" aria-label="모바일 메뉴">
        {navItems.slice(0, 5).map((item) => (
          <MobileNavButton key={item.view} item={item} active={activeView === item.view} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  )
}

function NavButton({
  item,
  active,
  onNavigate
}: {
  readonly item: NavItem
  readonly active: boolean
  readonly onNavigate: (view: AppView) => void
}) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.view)}
      className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition ${
        active ? "bg-white/[0.075] text-mint-300" : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {item.label}
    </button>
  )
}

function MobileNavButton({
  item,
  active,
  onNavigate
}: {
  readonly item: NavItem
  readonly active: boolean
  readonly onNavigate: (view: AppView) => void
}) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.view)}
      className={`grid min-h-12 place-items-center rounded-lg text-[11px] ${
        active ? "bg-white/[0.075] text-mint-300" : "text-slate-400"
      }`}
    >
      <Icon className="mb-1 h-4 w-4" aria-hidden="true" />
      {item.label}
    </button>
  )
}
