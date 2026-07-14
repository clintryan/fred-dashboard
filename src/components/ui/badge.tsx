import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
        variant === 'default' && "bg-[rgba(0,212,255,0.12)] text-[#00D4FF]",
        variant === 'secondary' && "bg-[#1A2238] text-[#64748B]",
        variant === 'outline' && "border border-[#1E2D45] text-[#64748B]",
        className
      )}
      {...props}
    />
  )
}

export { Badge }
