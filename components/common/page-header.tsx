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
    <div className={cn("mb-8", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-3 text-sm text-foreground-secondary" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            {breadcrumbs.map((bc, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {idx > 0 && <ChevronRight className="h-4 w-4 opacity-60" />}
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold leading-tight text-foreground">{title}</h1>
            {typeof description === "string" ? null : description && (
              <InfoTooltip content={description}>
                <Info className="h-4 w-4 text-foreground-secondary" />
              </InfoTooltip>
            )}
          </div>
          {typeof description === "string" && (
            <p className="mt-2 text-foreground-secondary">{description}</p>
          )}
          {meta && <div className="mt-2 text-sm text-foreground-secondary">{meta}</div>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
