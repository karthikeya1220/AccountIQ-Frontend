"use client"

import clsx from "clsx"

interface LoadingSkeletonProps {
  lines?: number
  className?: string
}

export function LoadingSkeleton({ lines = 3, className }: LoadingSkeletonProps) {
  return (
    <div className={clsx("animate-pulse space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 w-full rounded bg-muted" />
      ))}
    </div>
  )
}
