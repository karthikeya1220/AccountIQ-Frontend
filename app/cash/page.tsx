"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { TransactionsList } from "@/components/cash/transactions-list"
import { TransactionForm } from "@/components/cash/transaction-form"
import { ExportModal } from "@/components/export/export-modal"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"

export default function CashPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadTransactions = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await apiClient.getCashTransactions()
      const data = response?.data || response || []
      if (Array.isArray(data)) {
        setTransactions(
          data.map((t: any) => ({
            id: t.id,
            type: t.type || (Number(t.amount) >= 0 ? 'income' : 'expense'),
            category: t.category || 'General',
            amount: Math.abs(Number(t.amount ?? 0)),
            date: t.date || t.created_at || new Date().toISOString(),
            description: t.description || '',
            paymentMethod: t.payment_method || 'cash',
          }))
        )
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load transactions")
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const [showExportModal, setShowExportModal] = useState(false)

  const handleAddTransaction = async (newTransaction: any) => {
    // Optimistically add to list
    const optimistic = { ...newTransaction, id: newTransaction.id || Date.now().toString() }
    setTransactions((prev) => [...prev, optimistic])
    // Form already handles the API call, reload to get fresh data
    loadTransactions()
  }

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cash Transactions</h1>
            <p className="mt-2 text-foreground-secondary">Track cash and bank transfers</p>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Export Transactions
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="card">
            <p className="text-sm text-foreground-secondary">Total Income</p>
            <p className="mt-2 text-2xl font-bold text-success">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="card">
            <p className="text-sm text-foreground-secondary">Total Expenses</p>
            <p className="mt-2 text-2xl font-bold text-error">${totalExpense.toFixed(2)}</p>
          </div>
          <div className="card">
            <p className="text-sm text-foreground-secondary">Net Balance</p>
            <p className="mt-2 text-2xl font-bold text-foreground">${(totalIncome - totalExpense).toFixed(2)}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <TransactionForm onAddTransaction={handleAddTransaction} />
          <div className="md:col-span-2">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading transactions...</div>
            ) : (
              <TransactionsList transactions={transactions} />
            )}
          </div>
        </div>

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          data={transactions.map((t) => ({
            Type: t.type,
            Category: t.category,
            Amount: `$${t.amount}`,
            Date: t.date,
            Description: t.description,
            "Payment Method": t.paymentMethod,
          }))}
          filename="transactions"
          title="Cash Transactions"
        />
      </main>
    </ProtectedRoute>
  )
}
