import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: ButtonVariant
  readonly children: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-mint-300 text-navy-950 hover:bg-mint-400",
  secondary: "border border-white/10 bg-white/[0.055] text-slate-100 hover:bg-white/[0.085]",
  ghost: "text-slate-300 hover:bg-white/[0.06] hover:text-white",
  danger: "border border-rose-300/20 bg-rose-400/10 text-rose-100 hover:bg-rose-400/15"
}

export function Button({ variant = "secondary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition duration-150 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
