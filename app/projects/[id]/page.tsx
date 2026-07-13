import { HarnessApp } from "@/features/app/HarnessApp"

export default function ProjectHarnessPage({
  params,
  searchParams
}: {
  readonly params: { readonly id: string }
  readonly searchParams: { readonly tab?: string }
}) {
  return <HarnessApp initialView="project" initialProjectId={params.id} initialProjectTab={searchParams.tab} />
}
