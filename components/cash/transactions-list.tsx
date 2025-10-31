"use client"

import { useState } from "react"
import { Edit2, Trash2 } from "lucide-react"
import { Modal } from "@/components/common/modal"
import { CashTransactionEditForm } from "./cash-transaction-edit-form"

interface Transaction {
  id: string
  type: string
  category: string
  amount: number
  date: string
  description: string
  paymentMethod: string
}

interface TransactionsListProps {
  transactions: Transaction[]
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transactionId: string) => void
  onTransactionUpdated?: (updatedTransaction: Transaction) => void
}

export function TransactionsList({ transactions, onEdit, onDelete, onTransactionUpdated }: TransactionsListProps) {
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null)
  const editingTransaction = transactions.find(t => t.id === editingTransactionId)

  const getTypeColor = (type: string) => {
    return type === "income" ? "text-success" : "text-error"
  }

  const getTypeSign = (type: string) => {
    return type === "income" ? "+" : "-"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransactionId(transaction.id)
    onEdit?.(transaction)
  }

  const handleSaveTransaction = (updatedTransaction: Transaction) => {
    setEditingTransactionId(null)
    onTransactionUpdated?.(updatedTransaction)
  }

  return (
    <>
      <div className="card">
        <h2 className="card-title mb-4">Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-cell text-left font-semibold">Category</th>
                <th className="table-cell text-left font-semibold">Date</th>
                <th className="table-cell text-left font-semibold">Method</th>
                <th className="table-cell text-right font-semibold">Amount</th>
                <th className="table-cell text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const paymentMethod = transaction.paymentMethod || 'cash'
                const amount = Number(transaction.amount ?? 0)
                return (
                  <tr key={transaction.id} className="border-b border-border hover:bg-background-secondary">
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-foreground">{transaction.category}</p>
                        <p className="text-xs text-foreground-secondary">{transaction.description}</p>
                      </div>
                    </td>
                    <td className="table-cell text-foreground-secondary">{formatDate(transaction.date)}</td>
                    <td className="table-cell text-foreground-secondary capitalize">
                      {paymentMethod.replace(/_/g, " ")}
                    </td>
                    <td className={`table-cell text-right font-semibold ${getTypeColor(transaction.type)}`}>
                      {getTypeSign(transaction.type)}${amount.toFixed(2)}
                    </td>
                    <td className="table-cell text-center">
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          onClick={() => handleEditClick(transaction)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        {onDelete && (
                          <button
                            onClick={() => onDelete(transaction.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete transaction"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editingTransactionId !== null}
        onClose={() => setEditingTransactionId(null)}
        title={`Edit ${editingTransaction?.category || 'Transaction'}`}
      >
        {editingTransaction && (
          <CashTransactionEditForm
            transaction={editingTransaction}
            onSave={handleSaveTransaction}
            onCancel={() => setEditingTransactionId(null)}
          />
        )}
      </Modal>
    </>
  )
}
