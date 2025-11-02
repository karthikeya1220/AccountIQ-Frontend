/**
 * Dashboard utility functions for formatting and calculations
 */

import { DashboardKPIs, BudgetStatus, CardSummary } from '@/hooks/useDashboard'

/**
 * Format currency value
 */
export function formatCurrencyValue(value: number, showSign = false): string {
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

/**
 * Get trend indicator
 */
export function getTrendIndicator(value: number): 'up' | 'down' | 'stable' {
  if (value > 5) return 'up'
  if (value < -5) return 'down'
  return 'stable'
}

/**
 * Get trend color
 */
export function getTrendColor(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return 'text-red-600 dark:text-red-400'
    case 'down':
      return 'text-emerald-600 dark:text-emerald-400'
    case 'stable':
      return 'text-gray-600 dark:text-gray-400'
  }
}

/**
 * Calculate budget health percentage
 */
export function calculateBudgetHealth(budgetStatus: BudgetStatus): number {
  if (budgetStatus.total === 0) return 100
  return Math.round((budgetStatus.onTrack / budgetStatus.total) * 100)
}

/**
 * Get card utilization color
 */
export function getCardUtilizationColor(utilization: number): string {
  if (utilization > 80) return 'text-red-600 dark:text-red-400'
  if (utilization > 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-emerald-600 dark:text-emerald-400'
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${Math.round(value * (10 ** decimals)) / (10 ** decimals)}%`
}

/**
 * Calculate month from string date
 */
export function parseMonthString(monthStr: string): { month: string; year: string } {
  const [year, month] = monthStr.split('-')
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return {
    month: monthNames[parseInt(month) - 1],
    year,
  }
}

/**
 * Check if data is stale
 */
export function isDataStale(timestamp: string, maxAgeMs: number = 10 * 60 * 1000): boolean {
  const age = Date.now() - new Date(timestamp).getTime()
  return age > maxAgeMs
}

/**
 * Format date range label
 */
export function formatDateRangeLabel(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const startMonth = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const endMonth = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return `${startMonth} - ${endMonth}`
}

/**
 * Get alert severity color
 */
export function getAlertSeverityColor(severity: 'low' | 'medium' | 'high'): string {
  switch (severity) {
    case 'high':
      return 'bg-red-50 dark:bg-red-950 border-l-red-500'
    case 'medium':
      return 'bg-amber-50 dark:bg-amber-950 border-l-amber-500'
    case 'low':
      return 'bg-blue-50 dark:bg-blue-950 border-l-blue-500'
  }
}

/**
 * Calculate average transaction
 */
export function calculateAverageTransaction(total: number, count: number): number {
  return count > 0 ? Math.round(total / count) : 0
}

/**
 * Get KPI change icon and color
 */
export function getKPIChangeStyle(change: number | undefined): { icon: string; color: string } {
  if (!change) return { icon: '→', color: 'text-gray-600 dark:text-gray-400' }

  if (change > 0) {
    return { icon: '↑', color: 'text-red-600 dark:text-red-400' } // Expense increase is bad
  }

  return { icon: '↓', color: 'text-emerald-600 dark:text-emerald-400' } // Expense decrease is good
}
