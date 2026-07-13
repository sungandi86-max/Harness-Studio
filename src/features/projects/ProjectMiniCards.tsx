import { ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/Card"

type CardItem = {
  readonly id: string
  readonly title: string
  readonly meta: string
  readonly text: string
  readonly url?: string
}

export function ProjectMiniCards({ items, bare = false }: { readonly items: readonly CardItem[]; readonly bare?: boolean }) {
  const content = (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl bg-white/[0.035] p-4">
          <p className="text-xs text-mint-300">{item.meta}</p>
          <p className="mt-1 font-semibold text-white">{item.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
          {item.url ? (
            <a href={item.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-mint-300">
              <ExternalLink className="h-4 w-4" />
              링크 열기
            </a>
          ) : null}
        </div>
      ))}
    </div>
  )
  return bare ? content : <Card className="p-4">{content}</Card>
}
