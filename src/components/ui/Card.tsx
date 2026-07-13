import type { ReactNode } from "react"

export function Card({ children, className = "" }: { readonly children: ReactNode; readonly className?: string }) {
  return (
    <section className={`rounded-xl border border-white/10 bg-white/[0.045] shadow-insetSoft ${className}`}>
      {children}
    </section>
  )
}

export function SectionTitle({
  title,
  subtitle,
  action
}: {
  readonly title: string
  readonly subtitle?: string
  readonly action?: ReactNode
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm leading-6 text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}
