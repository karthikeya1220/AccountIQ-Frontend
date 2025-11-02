"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RecentTransaction } from "@/hooks/useDashboard"

interface RecentTransactionsProps {
  transactions: RecentTransaction[]
  loading?: boolean
}

// Helper function to format relative time without date-fns
function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    // Format as date if more than a week ago
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

export function RecentTransactions({ transactions, loading = false }: RecentTransactionsProps) {
  if (loading) {
    return (
      <Card className="p-3 sm:p-4 md:p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </Card>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="p-3 sm:p-4 md:p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No transactions found</p>
        </div>
      </Card>
    )
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'pending':
        return 'warning'
      case 'rejected':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatDate = (dateString: string) => {
    return formatRelativeTime(dateString)
  }

  return (
    <Card className="p-3 sm:p-4 md:p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Recent Transactions
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-3 sm:px-4 md:px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="text-left py-3 px-3 sm:px-4 md:px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="text-right py-3 px-3 sm:px-4 md:px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left py-3 px-3 sm:px-4 md:px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="text-center py-3 px-3 sm:px-4 md:px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr 
                key={item.id} 
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="py-4 px-3 sm:px-4 md:px-6 text-sm font-medium text-gray-900 dark:text-white">
                  {item.description}
                </td>
                <td className="py-4 px-3 sm:px-4 md:px-6 text-sm text-gray-600 dark:text-gray-400">
                  {item.category}
                </td>
                <td className="py-4 px-3 sm:px-4 md:px-6 text-sm font-bold text-gray-900 dark:text-white text-right">
                  <span className={item.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}>
                    {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="py-4 px-3 sm:px-4 md:px-6 text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(item.date)}
                </td>
                <td className="py-4 px-3 sm:px-4 md:px-6 text-center">
                  <Badge variant={getStatusBadgeVariant(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
