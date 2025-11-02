"use client"

import { Card } from '@/components/ui/card'
import { BudgetStatus } from '@/hooks/useDashboard'

interface BudgetStatusCardProps {
  budgetStatus: BudgetStatus
}

export function BudgetStatusCard({ budgetStatus }: BudgetStatusCardProps) {
  const budgetPercentages = {
    onTrack: budgetStatus.total > 0 ? (budgetStatus.onTrack / budgetStatus.total) * 100 : 0,
    warning: budgetStatus.total > 0 ? (budgetStatus.warning / budgetStatus.total) * 100 : 0,
    exceeded: budgetStatus.total > 0 ? (budgetStatus.exceeded / budgetStatus.total) * 100 : 0,
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
        Budget Status
      </h2>

      {/* Status breakdown */}
      <div className="space-y-4">
        {/* On Track */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              On Track
            </p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {budgetStatus.onTrack}/{budgetStatus.total}
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${budgetPercentages.onTrack}%` }}
            />
          </div>
        </div>

        {/* Warning */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              At Risk
            </p>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
              {budgetStatus.warning}/{budgetStatus.total}
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${budgetPercentages.warning}%` }}
            />
          </div>
        </div>

        {/* Exceeded */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Exceeded
            </p>
            <p className="text-sm font-bold text-red-600 dark:text-red-400">
              {budgetStatus.exceeded}/{budgetStatus.total}
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${budgetPercentages.exceeded}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {budgetStatus.total} total budgets being tracked
        </p>
      </div>
    </Card>
  )
}
