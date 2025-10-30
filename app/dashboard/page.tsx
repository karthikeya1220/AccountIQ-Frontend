"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { PageHeader, LastUpdated } from "@/components/common"
import { Button } from "@/components/ui/button"
import { ExpenseChart } from "@/components/dashboard/expense-chart"
import { TrendChart } from "@/components/dashboard/trend-chart"
import { KPICard } from "@/components/dashboard/kpi-card"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { TrendingUp, AlertCircle, CreditCard, FileText, Download } from 'lucide-react'
import { useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

export default function DashboardPage() {
  useEffect(() => {
    // Try to fetch KPIs to exercise backend; keep current UI as backend routes are placeholders
    apiClient.getDashboardKPIs().catch(() => void 0)
  }, [])
  const kpis = [
    { 
      label: 'Total Expenses', 
      value: '$24,500', 
      change: '+12%', 
      trend: 'up' as const, 
      icon: TrendingUp, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      label: 'Monthly Budget', 
      value: '$25,000', 
      usage: '98%', 
      icon: FileText, 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      label: 'Cards in Use', 
      value: '3', 
      status: 'Active', 
      icon: CreditCard, 
      color: 'from-emerald-500 to-teal-500' 
    },
    { 
      label: 'Pending Bills', 
      value: '8', 
      status: 'Attention', 
      icon: AlertCircle, 
      color: 'from-amber-500 to-orange-500' 
    },
  ];

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="px-6 py-8">
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here's your financial overview."
          breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Dashboard' }]}
          meta={<LastUpdated />}
          actions={
            <Button variant="secondary" className="gap-2">
              <Download className="h-4 w-4" />
              Export Summary
            </Button>
          }
        />

        {/* KPI Cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <TrendChart />
          <ExpenseChart />
        </div>

        {/* Recent Transactions */}
        <RecentTransactions />
      </main>
    </ProtectedRoute>
  )
}
