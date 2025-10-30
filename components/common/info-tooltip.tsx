"use client"

import { ReactNode, useState } from "react"
import { cn } from "@/lib/utils"

interface InfoTooltipProps {
  content: ReactNode
  children: ReactNode
  className?: string
}

export function InfoTooltip({ content, children, className }: InfoTooltipProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn("relative inline-block", className)}
         onMouseEnter={() => setOpen(true)}
         onMouseLeave={() => setOpen(false)}>
      <span className="inline-flex cursor-help items-center">
        {children}
      </span>
      {open && (
        <div className="absolute z-20 mt-2 w-64 rounded-md border border-border bg-popover p-3 text-sm text-popover-foreground shadow-lg">
          {content}
        </div>
      )}
    </div>
  )
}
