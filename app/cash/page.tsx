"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { TransactionsList } from "@/components/cash/transactions-list"
import { TransactionForm } from "@/components/cash/transaction-form"
import { ExportModal } from "@/components/export/export-modal"
import { useState } from "react"

export default function CashPage() {
  const [transactions, setTransactions] = useState([
    {
      id: "1",
      type: "expense",
      category: "Office Supplies",
      amount: 125.5,
      date: "2025-10-29",
      description: "Printer paper and ink",
      paymentMethod: "cash",
    },
    {
      id: "2",
      type: "income",
      category: "Client Payment",
      amount: 5000,
      date: "2025-10-28",
      description: "Project completion payment",
      paymentMethod: "bank_transfer",
    },
    {
      id: "3",
      type: "expense",
      category: "Meals",
      amount: 45.75,
      date: "2025-10-27",
      description: "Team lunch",
      paymentMethod: "cash",
    },
  ])

  const [showExportModal, setShowExportModal] = useState(false)

  const handleAddTransaction = (newTransaction: any) => {
    setTransactions([...transactions, { ...newTransaction, id: Date.now().toString() }])
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
            <TransactionsList transactions={transactions} />
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
