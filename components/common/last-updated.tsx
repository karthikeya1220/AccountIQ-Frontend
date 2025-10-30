"use client"

import { useMemo } from "react"

function toRelativeTime(date: Date) {
  const diff = Date.now() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return `just now`
}

export function LastUpdated({ iso }: { iso?: string }) {
  const label = useMemo(() => {
    const d = iso ? new Date(iso) : new Date()
    return toRelativeTime(d)
  }, [iso])

  return (
    <span className="text-xs text-foreground-secondary">Last updated {label}</span>
  )
}
