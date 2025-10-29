"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { BudgetList } from "@/components/budget/budget-list"
import { BudgetForm } from "@/components/budget/budget-form"
import { RemindersList } from "@/components/budget/reminders-list"
import { useState } from "react"

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([
    {
      id: "1",
      category: "Software & Tools",
      limit: 5000,
      spent: 3800,
      period: "monthly",
      status: "warning",
    },
    {
      id: "2",
      category: "Travel",
      limit: 3000,
      spent: 1200,
      period: "monthly",
      status: "ok",
    },
    {
      id: "3",
      category: "Office Supplies",
      limit: 1000,
      spent: 950,
      period: "monthly",
      status: "critical",
    },
    {
      id: "4",
      category: "Meals & Entertainment",
      limit: 2000,
      spent: 1500,
      period: "monthly",
      status: "warning",
    },
  ])

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

  const handleAddBudget = (newBudget: any) => {
    setBudgets([...budgets, { ...newBudget, id: Date.now().toString(), status: "ok" }])
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Budget Management</h1>
          <p className="mt-2 text-foreground-secondary">Set limits and track spending against budgets</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="card">
            <p className="text-sm text-foreground-secondary">Total Budget</p>
            <p className="mt-2 text-2xl font-bold text-foreground">${totalBudget.toFixed(2)}</p>
            <p className="mt-1 text-xs text-foreground-secondary">{budgets.length} categories</p>
          </div>
          <div className="card">
            <p className="text-sm text-foreground-secondary">Total Spent</p>
            <p className="mt-2 text-2xl font-bold text-foreground">${totalSpent.toFixed(2)}</p>
            <p className="mt-1 text-xs text-foreground-secondary">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-foreground-secondary">Alerts</p>
            <p className="mt-2 text-2xl font-bold text-warning">{unreadReminders}</p>
            <p className="mt-1 text-xs text-foreground-secondary">unread reminders</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <BudgetForm onAddBudget={handleAddBudget} />
          <div className="md:col-span-2">
            <BudgetList budgets={budgets} />
          </div>
        </div>

        {/* Reminders Section */}
        <RemindersList reminders={reminders} onMarkRead={handleMarkReminderRead} onDelete={handleDeleteReminder} />
      </main>
    </ProtectedRoute>
  )
}
