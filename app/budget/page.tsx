"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { PageHeader, ErrorBanner, LoadingSkeleton, LastUpdated } from "@/components/common"
import { BudgetList } from "@/components/budget/budget-list"
import { BudgetForm } from "@/components/budget/budget-form"
import { RemindersList } from "@/components/budget/reminders-list"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { formatCurrency } from "@/lib/currency-formatter"

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadBudgets = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await apiClient.getBudgets()
      const data = response?.data || response || []
      if (Array.isArray(data)) {
        setBudgets(
          data.map((b: any) => ({
            id: b.id,
            category: b.category_name || b.category || 'General',
            limit: Number(b.budget_limit ?? b.amount ?? b.limit ?? 0),
            spent: Number(b.spent ?? 0),
            period: b.period || 'monthly',
            status: calculateStatus(Number(b.spent ?? 0), Number(b.budget_limit ?? b.amount ?? b.limit ?? 0)),
          }))
        )
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load budgets")
      setBudgets([])
    } finally {
      setLoading(false)
    }
  }

  const calculateStatus = (spent: number, limit: number) => {
    if (limit === 0) return 'ok'
    const percentage = (spent / limit) * 100
    if (percentage >= 90) return 'critical'
    if (percentage >= 75) return 'warning'
    return 'ok'
  }

  useEffect(() => {
    loadBudgets()
  }, [])

  const [reminders, setReminders] = useState([
    {
      id: "1",
      title: "Office Supplies Budget Alert",
      message: "You've used 95% of your office supplies budget",
      type: "critical",
      date: "2025-10-29",
      read: false,
    },
    {
      id: "2",
      title: "Software Budget Warning",
      message: "You've used 76% of your software budget",
      type: "warning",
      date: "2025-10-28",
      read: false,
    },
    {
      id: "3",
      title: "Monthly Budget Review",
      message: "Your monthly budget review is due",
      type: "info",
      date: "2025-10-27",
      read: true,
    },
  ])

  const handleAddBudget = async (newBudget: any) => {
    // Optimistically add to list
    setBudgets([...budgets, { ...newBudget, id: newBudget.id || Date.now().toString(), status: "ok" }])
    // Form already handles the API call, reload to get fresh data
    loadBudgets()
  }

  const handleBudgetUpdated = (updatedBudget: any) => {
    // Update the budget in the list
    setBudgets(
      budgets.map((b) =>
        b.id === updatedBudget.id
          ? {
              ...b,
              category: updatedBudget.category_name || updatedBudget.category,
              limit: updatedBudget.budget_limit || updatedBudget.limit || updatedBudget.amount,
              period: updatedBudget.period,
              status: calculateStatus(b.spent, updatedBudget.budget_limit || updatedBudget.limit || updatedBudget.amount),
            }
          : b
      )
    )
  }

  const handleMarkReminderRead = (reminderId: string) => {
    setReminders(reminders.map((r) => (r.id === reminderId ? { ...r, read: true } : r)))
  }

  const handleDeleteReminder = (reminderId: string) => {
    setReminders(reminders.filter((r) => r.id !== reminderId))
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const unreadReminders = reminders.filter((r) => !r.read).length

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen bg-background px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader
          title="Budget Management"
          description="Set limits and track spending against budgets"
          breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Budget' }]}
          meta={<LastUpdated />}
        />

        {error && <ErrorBanner message={error} />}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8">
          <div className="card p-3 sm:p-4 md:p-6">
            <p className="text-sm text-foreground-secondary">Total Budget</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(totalBudget)}</p>
            <p className="mt-1 text-xs text-foreground-secondary">{budgets.length} categories</p>
          </div>
          <div className="card p-3 sm:p-4 md:p-6">
            <p className="text-sm text-foreground-secondary">Total Spent</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</p>
            <p className="mt-1 text-xs text-foreground-secondary">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
            </p>
          </div>
          <div className="card p-3 sm:p-4 md:p-6">
            <p className="text-sm text-foreground-secondary">Alerts</p>
            <p className="mt-2 text-2xl font-bold text-warning">{unreadReminders}</p>
            <p className="mt-1 text-xs text-foreground-secondary">unread reminders</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8">
          <BudgetForm onAddBudget={handleAddBudget} />
          <div className="md:col-span-2">
            {loading ? (
              <LoadingSkeleton lines={8} />
            ) : (
              <BudgetList budgets={budgets} onBudgetUpdated={handleBudgetUpdated} />
            )}
          </div>
        </div>

        {/* Reminders Section */}
        <RemindersList reminders={reminders} onMarkRead={handleMarkReminderRead} onDelete={handleDeleteReminder} />
      </div>
      </main>
    </ProtectedRoute>
  )
}
