"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { ExpenseChart } from "@/components/dashboard/expense-chart"
import { TrendChart } from "@/components/dashboard/trend-chart"
import { KPICard } from "@/components/dashboard/kpi-card"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { TrendingUp, AlertCircle, CreditCard, FileText } from 'lucide-react'

export default function DashboardPage() {
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back! Here's your financial overview.
          </p>
        </div>

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
