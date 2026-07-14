import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  variant?: 'accent' | 'warn' | 'danger' | 'up'
}

function Progress({ className, value = 0, variant = 'accent', ...props }: ProgressProps) {
  const fillColor = {
    accent: '#00D4FF',
    warn: '#F59E0B',
    danger: '#F43F5E',
    up: '#10B981',
  }[variant]

  return (
    <div
      className={cn("h-1 bg-[#263350] rounded-sm overflow-hidden", className)}
      {...props}
    >
      <div
        className="h-full rounded-sm transition-all duration-500"
        style={{ width: `${Math.min(100, value)}%`, background: fillColor }}
      />
    </div>
  )
}

export { Progress }
