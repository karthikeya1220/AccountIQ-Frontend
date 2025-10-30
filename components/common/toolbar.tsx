"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ToolbarProps {
  children?: ReactNode
  className?: string
  right?: ReactNode
}

export function Toolbar({ children, className, right }: ToolbarProps) {
  return (
    <div className={cn("mb-6 rounded-lg border border-border bg-card p-4 shadow-sm", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">{children}</div>
        {right && <div className="flex items-center gap-2">{right}</div>}
      </div>
    </div>
  )
}
