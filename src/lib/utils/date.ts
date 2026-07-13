export function nowIso(): string {
  return new Date().toISOString()
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value))
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric"
  }).format(new Date(value))
}

export function makeId(prefix: string): string {
  const randomPart = Math.random().toString(36).slice(2, 9)
  return `${prefix}-${Date.now().toString(36)}-${randomPart}`
}
