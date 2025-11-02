"use client"

import { Card } from '@/components/ui/card'

export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-96 animate-pulse" />
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse" />
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom cards skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Transactions skeleton */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
