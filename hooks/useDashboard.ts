"use client"

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface DashboardKPIs {
  totalExpenses: number
  totalIncome: number
  availableBalance: number
  budgetUtilization: number
  cardsInUse: number
  pendingBills: number
  cardBalances: number
  cashOnHand: number
  totalPayroll: number
  activeEmployees: number
}

export interface MonthlyTrendPoint {
  month: string
  expenses: number
  budget: number
  income: number
}

export interface ExpenseByCategoryPoint {
  category: string
  amount: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

export interface RecentTransaction {
  id: string
  description: string
  amount: number
  date: string
  status: 'approved' | 'pending' | 'rejected'
  category: string
  type: 'expense' | 'income'
  createdBy: string
}

export interface BudgetAlert {
  id: string
  category: string
  current: number
  limit: number
  percentage: number
  severity: 'low' | 'medium' | 'high'
  message: string
}

export interface DashboardAlerts {
  budgetAlerts: BudgetAlert[]
  pendingApprovals: number
  overdueBills: number
  lowCashBalance: boolean
}

export interface CardSummary {
  totalCards: number
  activeCards: number
  totalLimit: number
  totalUsed: number
  available: number
}

export interface BudgetStatus {
  onTrack: number
  warning: number
  exceeded: number
  total: number
}

export interface DashboardData {
  timestamp: string
  period: {
    startDate: string
    endDate: string
    label: string
  }
  kpis: DashboardKPIs
  monthlyTrend: MonthlyTrendPoint[]
  expensesByCategory: ExpenseByCategoryPoint[]
  recentTransactions: RecentTransaction[]
  alerts: DashboardAlerts
  cards: CardSummary
  budgetStatus: BudgetStatus
  metadata: {
    dataFreshness: 'real-time' | 'cached' | 'stale'
    cacheUntil: string
    cacheDuration: number
    permissions: {
      canEdit: boolean
      canExport: boolean
      canDelete: boolean
    }
    userRole: string
  }
}

export interface UseDashboardOptions {
  period?: 'current_month' | 'last_30_days' | 'custom_range'
  startDate?: string
  endDate?: string
  refreshInterval?: number // milliseconds, 0 = no auto-refresh
  enabled?: boolean // toggle fetching
}

export interface UseDashboardReturn {
  data: DashboardData | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  updatePeriod: (period: 'current_month' | 'last_30_days' | 'custom_range') => Promise<void>
}

/**
 * Hook to fetch and manage dashboard summary data
 * Handles loading, error states, and auto-refresh
 */
export function useDashboard(options: UseDashboardOptions = {}): UseDashboardReturn {
  const {
    period = 'current_month',
    startDate,
    endDate,
    refreshInterval = 5 * 60 * 1000, // 5 minutes default
    enabled = true,
  } = options

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [currentPeriod, setCurrentPeriod] = useState(period)

  /**
   * Fetch dashboard summary data
   */
  const fetchDashboard = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.getDashboardSummary({
        period: currentPeriod as 'current_month' | 'last_30_days' | 'custom_range',
        startDate,
        endDate,
      })

      console.log('[useDashboard] API Response:', response)

      if (response.success && response.data) {
        console.log('[useDashboard] Setting data:', response.data)
        console.log('[useDashboard] expensesByCategory:', response.data.expensesByCategory)
        setData(response.data)
      } else {
        throw new Error('Failed to fetch dashboard data')
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred')
      setError(error)
      console.error('Dashboard fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPeriod, startDate, endDate, enabled])

  /**
   * Refetch data manually
   */
  const refetch = useCallback(async () => {
    await fetchDashboard()
  }, [fetchDashboard])

  /**
   * Update period and refetch
   */
  const updatePeriod = useCallback(async (newPeriod: 'current_month' | 'last_30_days' | 'custom_range') => {
    setCurrentPeriod(newPeriod)
    setLoading(true)
  }, [])

  /**
   * Initial fetch and auto-refresh setup
   */
  useEffect(() => {
    fetchDashboard()

    // Setup auto-refresh interval
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchDashboard()
      }, refreshInterval)

      return () => clearInterval(interval)
    }
  }, [fetchDashboard, refreshInterval])

  /**
   * Re-fetch when period changes
   */
  useEffect(() => {
    if (currentPeriod !== period) {
      fetchDashboard()
    }
  }, [currentPeriod, period, fetchDashboard])

  return {
    data,
    loading,
    error,
    refetch,
    updatePeriod,
  }
}
