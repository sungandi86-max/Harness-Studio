import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"

export function Field({ label, children, error }: { readonly label: string; readonly children: ReactNode; readonly error?: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-200">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-200">{error}</span> : null}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="min-h-10 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-white placeholder:text-slate-500"
      {...props}
    />
  )
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="min-h-24 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-sm leading-6 text-white placeholder:text-slate-500"
      {...props}
    />
  )
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className="min-h-10 rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-white" {...props} />
  )
}
