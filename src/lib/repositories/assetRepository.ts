import { loadWorkspace, saveWorkspace } from "@/lib/storage/workspaceStorage"
import { makeId, nowIso } from "@/lib/utils/date"
import type { Asset, AssetType } from "@/types/models"

export type AssetInput = {
  readonly title: string
  readonly type: AssetType
  readonly url: string
  readonly previewUrl: string
  readonly description: string
  readonly projectIds: readonly string[]
  readonly tags: readonly string[]
}

export const assetRepository = {
  list(): readonly Asset[] {
    return loadWorkspace().assets
  },
  create(input: AssetInput): Asset {
    const workspace = loadWorkspace()
    const timestamp = nowIso()
    const asset: Asset = {
      ...input,
      id: makeId("asset"),
      isFavorite: false,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    saveWorkspace({ ...workspace, assets: [asset, ...workspace.assets] })
    return asset
  },
  update(id: string, input: AssetInput): Asset | null {
    const workspace = loadWorkspace()
    const current = workspace.assets.find((asset) => asset.id === id)
    if (current === undefined) {
      return null
    }
    const updated: Asset = { ...current, ...input, updatedAt: nowIso() }
    saveWorkspace({
      ...workspace,
      assets: workspace.assets.map((asset) => (asset.id === id ? updated : asset))
    })
    return updated
  },
  delete(id: string): void {
    const workspace = loadWorkspace()
    saveWorkspace({ ...workspace, assets: workspace.assets.filter((asset) => asset.id !== id) })
  },
  toggleFavorite(id: string): void {
    const workspace = loadWorkspace()
    saveWorkspace({
      ...workspace,
      assets: workspace.assets.map((asset) =>
        asset.id === id ? { ...asset, isFavorite: !asset.isFavorite, updatedAt: nowIso() } : asset
      )
    })
  }
}
