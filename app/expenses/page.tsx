"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { PettyExpensesList } from "@/components/petty-expenses/petty-expenses-list"
import { PettyExpenseForm } from "@/components/petty-expenses/petty-expense-form"
import { ExportModal } from "@/components/export/export-modal"
import { Card } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { useState } from "react"
import { TrendingDown, DollarSign, Calendar, Download, Plus } from "lucide-react"

export default function PettyExpensesPage() {
  const [expenses, setExpenses] = useState([
    {
      id: "1",
      description: "Office coffee supplies",
      amount: 45.5,
      category: "Supplies",
      date: "2025-10-29",
      submittedBy: "John Smith",
      status: "approved",
      receipt: "coffee-receipt.pdf",
    },
    {
      id: "2",
      description: "Client meeting lunch",
      amount: 78.25,
      category: "Meals",
      date: "2025-10-28",
      submittedBy: "Sarah Johnson",
      status: "pending",
      receipt: "lunch-receipt.pdf",
    },
    {
      id: "3",
      description: "Printer cartridge",
      amount: 65.0,
      category: "Supplies",
      date: "2025-10-27",
      submittedBy: "Mike Chen",
      status: "approved",
      receipt: "printer-receipt.pdf",
    },
  ])

  const [showExportModal, setShowExportModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddExpense = (newExpense: any) => {
    setExpenses([...expenses, { ...newExpense, id: Date.now().toString() }])
  }

  const handleStatusChange = (expenseId: string, newStatus: string) => {
    setExpenses(expenses.map((e) => (e.id === expenseId ? { ...e, status: newStatus } : e)))
  }

  const handleDelete = (expenseId: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      setExpenses(expenses.filter((e) => e.id !== expenseId))
    }
  }

  const monthlyTotal = expenses.reduce((sum, e) => sum + e.amount, 0)
  const approvedExpenses = expenses.filter((e) => e.status === "approved").reduce((sum, e) => sum + e.amount, 0)
  const pendingExpenses = expenses.filter((e) => e.status === "pending").reduce((sum, e) => sum + e.amount, 0)
  const averageExpense = expenses.length > 0 ? monthlyTotal / expenses.length : 0

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Petty Expenses</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage small business expenses and reimbursements
            </p>
          </div>
          <EnhancedButton
            onClick={() => setShowExportModal(true)}
            variant="outline"
            size="md"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </EnhancedButton>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between p-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Monthly Total
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
                  ${monthlyTotal.toFixed(2)}
                </p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {expenses.length} transactions
                  </p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg">
                <TrendingDown className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between p-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Approved
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-3">
                  ${approvedExpenses.toFixed(2)}
                </p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {expenses.filter((e) => e.status === "approved").length} expenses
                  </p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between p-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Pending Review
                </p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-3">
                  ${pendingExpenses.toFixed(2)}
                </p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {expenses.filter((e) => e.status === "pending").length} pending
                  </p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between p-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Avg Expense
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
                  ${averageExpense.toFixed(2)}
                </p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    per transaction
                  </p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <PettyExpenseForm onAddExpense={handleAddExpense} />
          <div className="md:col-span-2">
            <PettyExpensesList 
              expenses={expenses} 
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          </div>
        </div>

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          data={expenses.map((e) => ({
            Description: e.description,
            Amount: `$${e.amount}`,
            Category: e.category,
            Date: e.date,
            "Submitted By": e.submittedBy,
            Status: e.status,
          }))}
          filename="petty-expenses"
          title="Petty Expenses"
        />
      </main>
    </ProtectedRoute>
  )
}
