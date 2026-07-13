import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050812",
          900: "#080d1b",
          850: "#0d1324",
          800: "#111a2e",
          700: "#1a2740"
        },
        mint: {
          300: "#8ff4d1",
          400: "#5ee6bd",
          500: "#35caa1"
        }
      },
      boxShadow: {
        calm: "0 18px 60px rgba(0, 0, 0, 0.18)",
        insetSoft: "inset 0 1px 0 rgba(255,255,255,0.08)"
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      }
    }
  },
  plugins: []
}

export default config
