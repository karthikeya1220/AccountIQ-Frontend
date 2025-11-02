"use client"

import { CreditCard } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CardSummary } from '@/hooks/useDashboard'

interface CardSummaryCardProps {
  cardSummary: CardSummary
}

export function CardSummaryCard({ cardSummary }: CardSummaryCardProps) {
  const availablePercentage =
    cardSummary.totalLimit > 0
      ? (cardSummary.available / cardSummary.totalLimit) * 100
      : 0

  const usedPercentage =
    cardSummary.totalLimit > 0 ? (cardSummary.totalUsed / cardSummary.totalLimit) * 100 : 0

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Cards Overview
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {cardSummary.activeCards} active out of {cardSummary.totalCards} card{cardSummary.totalCards !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 h-12 w-12 rounded-lg flex items-center justify-center text-white shadow-lg">
          <CreditCard className="h-6 w-6" />
        </div>
      </div>

      {/* Limit and usage */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Limit
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              ${cardSummary.totalLimit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Usage progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Used Amount
            </p>
            <p className="text-sm font-bold text-red-600 dark:text-red-400">
              ${cardSummary.totalUsed.toLocaleString()} ({usedPercentage.toFixed(0)}%)
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${usedPercentage}%` }}
            />
          </div>
        </div>

        {/* Available progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Available
            </p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              ${cardSummary.available.toLocaleString()} ({availablePercentage.toFixed(0)}%)
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${availablePercentage}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
