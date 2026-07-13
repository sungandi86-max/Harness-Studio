import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Harness Studio",
  description: "Your AI Workspace. Build once. Reuse forever."
}

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
