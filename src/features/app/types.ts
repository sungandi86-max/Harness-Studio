export type AppView = "home" | "projects" | "project" | "prompts" | "workflows" | "knowledge" | "assets" | "favorites" | "settings"

export type EditorMode =
  | { readonly kind: "project"; readonly id?: string }
  | { readonly kind: "prompt"; readonly id?: string }
  | { readonly kind: "workflow"; readonly id?: string }
  | { readonly kind: "knowledge"; readonly id?: string }
  | { readonly kind: "asset"; readonly id?: string }
  | { readonly kind: "nextStep"; readonly projectId: string }
  | { readonly kind: "aiTeam"; readonly projectId: string }
  | { readonly kind: "rule"; readonly projectId: string }
