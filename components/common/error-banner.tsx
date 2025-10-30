"use client"

interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary px-3 py-1 text-xs">Retry</button>
      )}
    </div>
  )
}
