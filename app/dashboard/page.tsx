"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { PageHeader, LastUpdated } from "@/components/common"
import { Button } from "@/components/ui/button"
import { KPICard } from "@/components/dashboard/kpi-card"
import { TrendChart } from "@/components/dashboard/trend-chart"
// import { ExpenseChart } from "@/components/dashboard/expense-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { AlertBanner } from "@/components/dashboard/alert-banner"
import { BudgetStatusCard } from "@/components/dashboard/budget-status-card"
import { CardSummaryCard } from "@/components/dashboard/card-summary-card"
import { PeriodSelector } from "@/components/dashboard/period-selector"
import { DashboardLoadingSkeleton } from "@/components/dashboard/dashboard-loading-skeleton"
import { TrendingUp, AlertCircle, CreditCard, FileText, Download, RefreshCw } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useState } from 'react'

export default function DashboardPage() {
  const [period, setPeriod] = useState<'current_month' | 'last_30_days' | 'custom_range'>('current_month')
  
  const { data, loading, error, refetch } = useDashboard({
    period,
    refreshInterval: 5 * 60 * 1000, // 5 minutes
  })

  const handlePeriodChange = async (newPeriod: 'current_month' | 'last_30_days' | 'custom_range') => {
    setPeriod(newPeriod)
  }

  // Format KPI cards
  const kpis = data
    ? [
        {
          label: 'Total Expenses',
          value: `$${data.kpis.totalExpenses.toLocaleString()}`,
          change: '+12%',
          trend: 'up' as const,
          icon: TrendingUp,
          color: 'from-blue-500 to-cyan-500',
        },
        {
          label: 'Available Balance',
          value: `$${data.kpis.availableBalance.toLocaleString()}`,
          change: '+8%',
          trend: 'up' as const,
          icon: CreditCard,
          color: 'from-emerald-500 to-teal-500',
        },
        {
          label: 'Budget Used',
          value: `${data.kpis.budgetUtilization}%`,
          usage: `${data.kpis.budgetUtilization}%`,
          icon: FileText,
          color: 'from-purple-500 to-pink-500',
        },
        {
          label: 'Pending Items',
          value: `${data.kpis.pendingBills + data.alerts.budgetAlerts.length}`,
          status: data.alerts.pendingApprovals > 0 ? 'Attention' : 'Normal',
          icon: AlertCircle,
          color: 'from-amber-500 to-orange-500',
        },
      ]
    : []

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen bg-background px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header with refresh button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <PageHeader
              title="Dashboard"
              description="Welcome back! Here's your financial overview."
              breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Dashboard' }]}
              meta={<LastUpdated />}
            />
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => refetch()}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="secondary" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Period selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <PeriodSelector
              currentPeriod={period}
              onPeriodChange={handlePeriodChange}
              loading={loading}
            />
            {data && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.period.label}: {data.period.startDate} to {data.period.endDate}
              </p>
            )}
          </div>

          {/* Error state */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">
                {error.message || 'Failed to load dashboard data. Please try again.'}
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && !data ? (
            <DashboardLoadingSkeleton />
          ) : data ? (
            <>
              {/* Alerts */}
              {data.alerts && (
                <AlertBanner alerts={data.alerts} />
              )}

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
                {kpis.map((kpi, idx) => (
                  <KPICard
                    key={idx}
                    title={kpi.label}
                    value={kpi.value}
                    change={kpi.change}
                    usage={kpi.usage}
                    status={kpi.status}
                    trend={kpi.trend}
                    icon={kpi.icon}
                    color={kpi.color}
                  />
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-8">
                <TrendChart data={data.monthlyTrend} loading={loading} />
                {/* <ExpenseChart data={data.expensesByCategory} loading={loading} /> */}
              </div>

              {/* Bottom cards - Budget Status and Card Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-8">
                <BudgetStatusCard budgetStatus={data.budgetStatus} />
                <CardSummaryCard cardSummary={data.cards} />
              </div>

              {/* Recent Transactions */}
              <RecentTransactions transactions={data.recentTransactions} loading={loading} />

              {/* Data freshness indicator */}
              {data.metadata && (
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center py-4">
                  <p>
                    Data {data.metadata.dataFreshness} • Last updated:{' '}
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>
    </ProtectedRoute>
  )
}
