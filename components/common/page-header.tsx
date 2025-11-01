"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { ChevronRight, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { InfoTooltip } from "./info-tooltip"

export type BreadcrumbItem = {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string | ReactNode
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  meta?: ReactNode
  className?: string
}

export function PageHeader({ title, description, breadcrumbs, actions, meta, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 sm:mb-8", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-2 sm:mb-3 text-xs sm:text-sm text-foreground-secondary overflow-x-auto" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            {breadcrumbs.map((bc, idx) => (
              <li key={idx} className="flex items-center gap-1 sm:gap-2">
                {idx > 0 && <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4 opacity-60 flex-shrink-0" />}
                {bc.href ? (
                  <Link href={bc.href} className="hover:underline hover:text-foreground">
                    {bc.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{bc.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-foreground truncate">{title}</h1>
            {typeof description === "string" ? null : description && (
              <InfoTooltip content={description}>
                <Info className="h-4 w-4 text-foreground-secondary flex-shrink-0" />
              </InfoTooltip>
            )}
          </div>
          {typeof description === "string" && (
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-foreground-secondary">{description}</p>
          )}
          {meta && <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-foreground-secondary">{meta}</div>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  )
}
